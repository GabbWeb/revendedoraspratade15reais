'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

type Produto = {
  id: string
  sku: string
  nome: string
  descricao: string | null
  categoria: string | null
  preco: number
  preco_promo: number | null
  fotos: string[]
  estoque: number
  destaque: boolean
  tamanho: string | null
  cor: string | null
  marca: string | null
  itens_inclusos: string | null
  peso_g: number | null
}

type Revendedora = {
  id: string
  nome: string
  nome_loja: string | null
  whatsapp: string
  subdominio: string
  status: string
}

export default function ProdutoPage({ params }: { params: { slug: string; id: string } }) {
  const [revendedora, setRevendedora] = useState<Revendedora | null>(null)
  const [produto, setProduto] = useState<Produto | null>(null)
  const [loading, setLoading] = useState(true)
  const [fotoAtiva, setFotoAtiva] = useState(0)

  useEffect(() => {
    async function carregar() {
      try {
        const [resRev, resProd] = await Promise.all([
          fetch(`/api/loja/${params.slug}`),
          fetch(`/api/produtos/${params.id}`),
        ])

        if (resRev.ok) {
          const data = await resRev.json()
          setRevendedora(data)
        }

        if (resProd.ok) {
          const data = await resProd.json()
          setProduto(data)
        }
      } catch (e) {
        console.error('Erro ao carregar:', e)
      }
      setLoading(false)
    }
    carregar()
  }, [params.slug, params.id])

  function formatBRL(val: number) {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA' }}>
        <div style={{ fontSize: 13, color: '#999', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 500 }}>Carregando...</div>
      </div>
    )
  }

  if (!revendedora || !produto) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA', padding: 40 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💎</div>
          <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Produto não encontrado</h1>
          <Link href={`/loja/${params.slug}`} style={{ color: '#555', fontSize: 14, textDecoration: 'underline' }}>
            ← Voltar para a loja
          </Link>
        </div>
      </div>
    )
  }

  const whatsappLimpo = revendedora.whatsapp.replace(/\D/g, '')
  const precoFinal = produto.preco_promo && produto.preco_promo > 0 && produto.preco_promo < produto.preco ? produto.preco_promo : produto.preco
  const temDesconto = produto.preco_promo && produto.preco_promo > 0 && produto.preco_promo < produto.preco
  const descontoPercent = temDesconto ? Math.round((1 - produto.preco_promo! / produto.preco) * 100) : 0

  const mensagemWhatsApp = encodeURIComponent(
    `Olá ${revendedora.nome.split(' ')[0]}! 💎\n\nTenho interesse no produto:\n*${produto.nome}*\nSKU: ${produto.sku}\nValor: ${formatBRL(precoFinal)}\n\nPode me passar mais informações?`
  )
  const linkWhatsApp = `https://wa.me/55${whatsappLimpo}?text=${mensagemWhatsApp}`

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: '-apple-system, "Inter", sans-serif' }}>

      <header style={{ background: 'white', borderBottom: '1px solid #EEE', padding: '20px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <Link href={`/loja/${params.slug}`} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#555', textDecoration: 'none', fontWeight: 500 }}>
            ← Voltar à loja
          </Link>
          <div style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>
            {revendedora.nome_loja || `Loja da ${revendedora.nome.split(' ')[0]}`}
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, alignItems: 'start' }}>

          <div style={{ position: 'sticky', top: 100 }}>
            <div style={{ aspectRatio: '1', background: '#F5F5F5', borderRadius: 16, overflow: 'hidden', border: '1px solid #EEE', marginBottom: 12 }}>
              {produto.fotos && produto.fotos.length > 0 && (
                <img src={produto.fotos[fotoAtiva]} alt={produto.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
              )}
            </div>
            {produto.fotos && produto.fotos.length > 1 && (
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
                {produto.fotos.map((foto, i) => (
                  <button
                    key={i}
                    onClick={() => setFotoAtiva(i)}
                    style={{
                      width: 70, height: 70, flexShrink: 0,
                      borderRadius: 8, overflow: 'hidden',
                      border: '2px solid', borderColor: fotoAtiva === i ? '#1A1A1A' : '#EEE',
                      cursor: 'pointer', padding: 0, background: '#F5F5F5',
                    }}
                  >
                    <img src={foto} alt={`${produto.nome} ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div style={{ fontSize: 11, color: '#999', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}>
              {produto.categoria}
            </div>

            <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 28, fontWeight: 700, color: '#1A1A1A', letterSpacing: -0.5, lineHeight: 1.2, marginBottom: 16 }}>
              {produto.nome}
            </h1>

            {temDesconto ? (
              <>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4, flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 16, color: '#999', textDecoration: 'line-through' }}>
                    {formatBRL(produto.preco)}
                  </div>
                  <div style={{ fontSize: 12, color: 'white', background: '#DC2626', padding: '3px 10px', borderRadius: 4, fontWeight: 700 }}>
                    -{descontoPercent}%
                  </div>
                </div>
                <div style={{ fontSize: 32, fontWeight: 700, color: '#DC2626', marginBottom: 4 }}>
                  {formatBRL(precoFinal)}
                </div>
              </>
            ) : (
              <div style={{ fontSize: 32, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>
                {formatBRL(precoFinal)}
              </div>
            )}
            <div style={{ fontSize: 13, color: '#777', marginBottom: 24 }}>
              ou 3x de {formatBRL(precoFinal / 3)} sem juros
            </div>

            {produto.descricao && (
              <div style={{ background: 'white', borderRadius: 12, padding: 20, border: '1px solid #EEE', marginBottom: 24 }}>
                <div style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 12 }}>
                  Descrição
                </div>
                <p style={{ fontSize: 14, color: '#444', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
                  {produto.descricao}
                </p>
              </div>
            )}

            {(produto.tamanho || produto.cor) && (
              <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                {produto.tamanho && (
                  <div style={{ flex: 1, minWidth: 120, background: 'white', padding: '12px 16px', borderRadius: 10, border: '1px solid #EEE' }}>
                    <div style={{ fontSize: 10, color: '#999', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>Tamanho</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', marginTop: 2 }}>{produto.tamanho}</div>
                  </div>
                )}
                {produto.cor && (
                  <div style={{ flex: 1, minWidth: 120, background: 'white', padding: '12px 16px', borderRadius: 10, border: '1px solid #EEE' }}>
                    <div style={{ fontSize: 10, color: '#999', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>Cor</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', marginTop: 2 }}>{produto.cor}</div>
                  </div>
                )}
              </div>
            )}

            <a
              href={linkWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block', width: '100%', textAlign: 'center',
                padding: '16px 20px', borderRadius: 12,
                background: '#1A1A1A', color: 'white',
                fontSize: 15, fontWeight: 600, textDecoration: 'none',
                marginBottom: 12,
                boxSizing: 'border-box',
              }}
            >
              Comprar via WhatsApp
            </a>

            <div style={{ fontSize: 12, color: '#999', textAlign: 'center', lineHeight: 1.6 }}>
              {produto.estoque} unidades disponíveis · SKU: {produto.sku}
            </div>

            <div style={{ marginTop: 32, paddingTop: 32, borderTop: '1px solid #EEE' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ fontSize: 16, color: '#1A1A1A' }}>✦</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#1A1A1A' }}>Prata 925</div>
                    <div style={{ fontSize: 11, color: '#777' }}>Legítima certificada</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ fontSize: 16, color: '#1A1A1A' }}>◇</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#1A1A1A' }}>Frete</div>
                    <div style={{ fontSize: 11, color: '#777' }}>Para todo o Brasil</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ fontSize: 16, color: '#1A1A1A' }}>↺</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#1A1A1A' }}>Troca grátis</div>
                    <div style={{ fontSize: 11, color: '#777' }}>Em até 7 dias</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ fontSize: 16, color: '#1A1A1A' }}>✓</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#1A1A1A' }}>Garantia</div>
                    <div style={{ fontSize: 11, color: '#777' }}>7 dias contra defeitos</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <footer style={{ background: '#1A1A1A', color: 'white', padding: '32px 24px', marginTop: 80, textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: '#999', letterSpacing: 2, textTransform: 'uppercase' }}>
          Joias 925 · Prata Legítima
        </div>
      </footer>
    </div>
  )
}