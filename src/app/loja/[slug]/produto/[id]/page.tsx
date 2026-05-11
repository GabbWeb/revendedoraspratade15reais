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
  lancamento: boolean
  tamanho: string | null
  cor: string | null
  ativo: boolean
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
  const [erro, setErro] = useState<string | null>(null)
  const [fotoAtiva, setFotoAtiva] = useState(0)

  useEffect(() => {
    async function carregarTudo() {
      try {
        // Carrega revendedora e produto em paralelo
        const [resRev, resProd] = await Promise.all([
          fetch(`/api/loja/${params.slug}`),
          fetch(`/api/produtos/${params.id}`),
        ])

        if (!resRev.ok) {
          setErro('loja')
          setLoading(false)
          return
        }
        if (!resProd.ok) {
          setErro('produto')
          setLoading(false)
          return
        }

        const [dataRev, dataProd] = await Promise.all([resRev.json(), resProd.json()])
        setRevendedora(dataRev)
        setProduto(dataProd)
      } catch (e) {
        console.error('Erro ao carregar:', e)
        setErro('rede')
      }
      setLoading(false)
    }
    carregarTudo()
  }, [params.slug, params.id])

  function formatBRL(val: number) {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA' }}>
        <div style={{ fontSize: 13, color: '#999', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 500 }}>
          Carregando...
        </div>
      </div>
    )
  }

  if (erro || !revendedora || !produto) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA', padding: 40 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💎</div>
          <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
            {erro === 'loja' ? 'Loja não encontrada' : 'Produto não encontrado'}
          </h1>
          <Link href={`/loja/${params.slug}`} style={{ color: '#555', fontSize: 14, textDecoration: 'underline' }}>
            ← Voltar para a loja
          </Link>
        </div>
      </div>
    )
  }

  const precoFinal = produto.preco_promo && produto.preco_promo > 0 && produto.preco_promo < produto.preco
    ? produto.preco_promo
    : produto.preco
  const temDesconto = produto.preco_promo && produto.preco_promo > 0 && produto.preco_promo < produto.preco
  const descontoPct = temDesconto ? Math.round(((produto.preco - precoFinal) / produto.preco) * 100) : 0

  const fotos = (produto.fotos && produto.fotos.length > 0) ? produto.fotos : []
  const fotoPrincipal = fotos[fotoAtiva] || ''

  const whatsappLimpo = revendedora.whatsapp.replace(/\D/g, '')
  const mensagemWhatsApp = encodeURIComponent(
    `Olá ${revendedora.nome.split(' ')[0]}! 💎\n\nTenho interesse no produto:\n*${produto.nome}*\n${produto.sku ? `SKU: ${produto.sku}\n` : ''}${produto.tamanho ? `Tamanho: ${produto.tamanho}\n` : ''}Valor: ${formatBRL(precoFinal)}\n\nPode me passar mais informações?`
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

          {/* GALERIA DE FOTOS */}
          <div style={{ position: 'sticky', top: 100 }}>
            <div style={{ aspectRatio: '1', background: '#F5F5F5', borderRadius: 16, overflow: 'hidden', border: '1px solid #EEE', position: 'relative' }}>
              {fotoPrincipal ? (
                <img
                  src={fotoPrincipal}
                  alt={produto.nome}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>
                  💎
                </div>
              )}
              {temDesconto && (
                <div style={{ position: 'absolute', top: 16, right: 16, background: '#DC2626', color: 'white', fontSize: 12, padding: '6px 12px', borderRadius: 14, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 700 }}>
                  -{descontoPct}%
                </div>
              )}
            </div>

            {/* THUMBNAILS - só mostra se tem mais de 1 foto */}
            {fotos.length > 1 && (
              <div style={{ display: 'flex', gap: 8, marginTop: 12, overflowX: 'auto', paddingBottom: 4 }}>
                {fotos.map((foto, i) => (
                  <button
                    key={i}
                    onClick={() => setFotoAtiva(i)}
                    style={{
                      flexShrink: 0,
                      width: 72,
                      height: 72,
                      borderRadius: 10,
                      overflow: 'hidden',
                      border: '2px solid',
                      borderColor: fotoAtiva === i ? '#1A1A1A' : '#EEE',
                      background: '#F5F5F5',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    <img
                      src={foto}
                      alt={`${produto.nome} - foto ${i + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFO PRODUTO */}
          <div>
            <div style={{ fontSize: 11, color: '#999', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}>
              {produto.categoria || 'Joia 925'}
            </div>

            <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 32, fontWeight: 700, color: '#1A1A1A', letterSpacing: -0.5, lineHeight: 1.2, marginBottom: 16 }}>
              {produto.nome}
            </h1>

            {/* PREÇO */}
            <div style={{ marginBottom: 8 }}>
              {temDesconto ? (
                <>
                  <div style={{ fontSize: 15, color: '#999', textDecoration: 'line-through', marginBottom: 4 }}>
                    {formatBRL(produto.preco)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                    <div style={{ fontSize: 32, fontWeight: 700, color: '#DC2626' }}>
                      {formatBRL(precoFinal)}
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ fontSize: 32, fontWeight: 700, color: '#1A1A1A' }}>
                  {formatBRL(precoFinal)}
                </div>
              )}
            </div>
            <div style={{ fontSize: 13, color: '#777', marginBottom: 24 }}>
              ou 3x de {formatBRL(precoFinal / 3)} sem juros
            </div>

            {/* ATRIBUTOS - tamanho e cor como info, só se existem */}
            {(produto.tamanho || produto.cor || produto.sku) && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                {produto.tamanho && (
                  <div style={{
                    padding: '8px 14px',
                    background: 'white',
                    border: '1px solid #EEE',
                    borderRadius: 10,
                    fontSize: 13,
                    color: '#1A1A1A',
                  }}>
                    <span style={{ color: '#999', fontWeight: 500 }}>Tamanho: </span>
                    <span style={{ fontWeight: 600 }}>{produto.tamanho}</span>
                  </div>
                )}
                {produto.cor && (
                  <div style={{
                    padding: '8px 14px',
                    background: 'white',
                    border: '1px solid #EEE',
                    borderRadius: 10,
                    fontSize: 13,
                    color: '#1A1A1A',
                  }}>
                    <span style={{ color: '#999', fontWeight: 500 }}>Cor: </span>
                    <span style={{ fontWeight: 600 }}>{produto.cor}</span>
                  </div>
                )}
                {produto.sku && (
                  <div style={{
                    padding: '8px 14px',
                    background: 'white',
                    border: '1px solid #EEE',
                    borderRadius: 10,
                    fontSize: 13,
                    color: '#999',
                  }}>
                    <span style={{ fontWeight: 500 }}>SKU: </span>
                    <span style={{ fontWeight: 600, color: '#555' }}>{produto.sku}</span>
                  </div>
                )}
              </div>
            )}

            {/* DESCRIÇÃO */}
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

            {/* ESTOQUE */}
            {produto.estoque > 0 && produto.estoque <= 5 && (
              <div style={{ fontSize: 12, color: '#DC2626', marginBottom: 16, fontWeight: 600 }}>
                Restam apenas {produto.estoque} {produto.estoque === 1 ? 'unidade' : 'unidades'}!
              </div>
            )}

            {/* CTA WHATSAPP */}
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
              Atendimento personalizado<br/>
              {revendedora.nome.split(' ')[0]} responde em até 30 minutos
            </div>

            {/* SELOS */}
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
                    <div style={{ fontSize: 11, color: '#777' }}>30 dias contra defeitos</div>
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