'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

const PRODUTOS_MOCK = [
  { id: 1, nome: 'Anel Solitário Coração', categoria: 'Anéis', preco: 89.90, foto: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop', descricao: 'Anel delicado em prata 925 com detalhe de coração. Perfeito para uso diário ou presente especial. Acabamento ródio branco que garante brilho duradouro e resistência.', tamanhos: ['14', '15', '16', '17', '18', '19'] },
  { id: 2, nome: 'Brincos Argola Trançada', categoria: 'Brincos', preco: 65.50, foto: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=800&h=800&fit=crop', descricao: 'Argolas trançadas em prata 925 com 1.5cm de diâmetro. Design clássico que combina com qualquer ocasião. Fecho seguro tipo click.', tamanhos: ['Único'] },
  { id: 3, nome: 'Colar Veneziana 45cm', categoria: 'Colares', preco: 129.00, foto: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&h=800&fit=crop', descricao: 'Colar veneziana clássica em prata 925 maciça. Comprimento de 45cm com fecho mosquetão. Espessura confortável para uso diário.', tamanhos: ['40cm', '45cm', '50cm'] },
  { id: 4, nome: 'Pulseira Berloque Estrela', categoria: 'Pulseiras', preco: 75.00, foto: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop', descricao: 'Pulseira ajustável com pingente em forma de estrela. Prata 925 com banho de ródio. Tamanho regulável de 16-20cm.', tamanhos: ['Único'] },
  { id: 5, nome: 'Anel Infinito Zircônia', categoria: 'Anéis', preco: 95.00, foto: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&h=800&fit=crop', descricao: 'Anel símbolo do infinito cravejado com zircônias delicadas. Prata 925 legítima com acabamento brilhante.', tamanhos: ['14', '15', '16', '17', '18'] },
  { id: 6, nome: 'Brincos Pérola Clássica', categoria: 'Brincos', preco: 55.00, foto: 'https://images.unsplash.com/photo-1631982690223-8aa4be0a2497?w=800&h=800&fit=crop', descricao: 'Brincos com pérola natural cultivada de 6mm. Base em prata 925 com pino de pressão. Atemporais e elegantes.', tamanhos: ['Único'] },
  { id: 7, nome: 'Conjunto Cordão + Pingente', categoria: 'Conjuntos', preco: 159.90, foto: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop', descricao: 'Kit com cordão veneziana 45cm + pingente delicado. Toda a peça em prata 925. Embalagem para presente inclusa.', tamanhos: ['Único'] },
  { id: 8, nome: 'Tornozeleira Veneziana', categoria: 'Tornozeleiras', preco: 49.90, foto: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop', descricao: 'Tornozeleira veneziana ajustável em prata 925. Comprimento regulável de 22 a 26cm. Perfeita para o verão.', tamanhos: ['Único'] },
]

type Revendedora = {
  id: string
  nome: string
  nome_loja: string | null
  whatsapp: string
  subdominio: string
  status: string
}

export default function ProdutoPage({ params }: { params: { slug: string; id: string } }) {
  const router = useRouter()
  const [revendedora, setRevendedora] = useState<Revendedora | null>(null)
  const [loading, setLoading] = useState(true)
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState<string>('')

  const produto = PRODUTOS_MOCK.find(p => p.id === parseInt(params.id))

  useEffect(() => {
    async function carregar() {
      const supabase = createClient()
      const { data } = await supabase
        .from('revendedoras')
        .select('*')
        .eq('subdominio', params.slug)
        .single()

      if (!data || data.status !== 'ativa') {
        setLoading(false)
        return
      }
      setRevendedora(data)
      if (produto && produto.tamanhos.length === 1) setTamanhoSelecionado(produto.tamanhos[0])
      setLoading(false)
    }
    carregar()
  }, [params.slug])

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
  const mensagemWhatsApp = encodeURIComponent(
    `Olá ${revendedora.nome.split(' ')[0]}! 💎\n\nTenho interesse no produto:\n*${produto.nome}*\n${tamanhoSelecionado ? `Tamanho: ${tamanhoSelecionado}\n` : ''}Valor: ${formatBRL(produto.preco)}\n\nPode me passar mais informações?`
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
            <div style={{ aspectRatio: '1', background: '#F5F5F5', borderRadius: 16, overflow: 'hidden', border: '1px solid #EEE' }}>
              <img src={produto.foto} alt={produto.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, color: '#999', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}>
              {produto.categoria}
            </div>

            <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 32, fontWeight: 700, color: '#1A1A1A', letterSpacing: -0.5, lineHeight: 1.2, marginBottom: 16 }}>
              {produto.nome}
            </h1>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#1A1A1A' }}>
                {formatBRL(produto.preco)}
              </div>
            </div>
            <div style={{ fontSize: 13, color: '#777', marginBottom: 32 }}>
              ou 3x de {formatBRL(produto.preco / 3)} sem juros
            </div>

            <div style={{ background: 'white', borderRadius: 12, padding: 20, border: '1px solid #EEE', marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 12 }}>
                Descrição
              </div>
              <p style={{ fontSize: 14, color: '#444', lineHeight: 1.7, margin: 0 }}>
                {produto.descricao}
              </p>
            </div>

            {produto.tamanhos.length > 1 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 12 }}>
                  Tamanho
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {produto.tamanhos.map(t => (
                    <button
                      key={t}
                      onClick={() => setTamanhoSelecionado(t)}
                      style={{
                        padding: '10px 18px', borderRadius: 8,
                        border: '1px solid', borderColor: tamanhoSelecionado === t ? '#1A1A1A' : '#EEE',
                        background: tamanhoSelecionado === t ? '#1A1A1A' : 'white',
                        color: tamanhoSelecionado === t ? 'white' : '#555',
                        fontSize: 13, fontWeight: 500, cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
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
              Atendimento personalizado<br/>
              {revendedora.nome.split(' ')[0]} responde em até 30 minutos
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