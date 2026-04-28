'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

const PRODUTOS_MOCK = [
  { id: 1, nome: 'Anel Solitário Coração', categoria: 'Anéis', preco: 89.90, foto: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop', destaque: true },
  { id: 2, nome: 'Brincos Argola Trançada', categoria: 'Brincos', preco: 65.50, foto: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=600&h=600&fit=crop' },
  { id: 3, nome: 'Colar Veneziana 45cm', categoria: 'Colares', preco: 129.00, foto: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&h=600&fit=crop' },
  { id: 4, nome: 'Pulseira Berloque Estrela', categoria: 'Pulseiras', preco: 75.00, foto: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop' },
  { id: 5, nome: 'Anel Infinito Zircônia', categoria: 'Anéis', preco: 95.00, foto: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&h=600&fit=crop' },
  { id: 6, nome: 'Brincos Pérola Clássica', categoria: 'Brincos', preco: 55.00, foto: 'https://images.unsplash.com/photo-1631982690223-8aa4be0a2497?w=600&h=600&fit=crop', destaque: true },
  { id: 7, nome: 'Conjunto Cordão + Pingente', categoria: 'Conjuntos', preco: 159.90, foto: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop' },
  { id: 8, nome: 'Tornozeleira Veneziana', categoria: 'Tornozeleiras', preco: 49.90, foto: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=600&fit=crop' },
]

const CATEGORIAS = ['Tudo', 'Anéis', 'Brincos', 'Colares', 'Pulseiras', 'Conjuntos', 'Tornozeleiras']

type Revendedora = {
  id: string
  nome: string
  nome_loja: string | null
  whatsapp: string
  cidade: string
  estado: string
  foto_url: string | null
  bio: string | null
  status: string
  subdominio: string
}

export default function LojaPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [revendedora, setRevendedora] = useState<Revendedora | null>(null)
  const [loading, setLoading] = useState(true)
  const [categoriaAtiva, setCategoriaAtiva] = useState('Tudo')
  const [busca, setBusca] = useState('')

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
      setLoading(false)
    }
    carregar()
  }, [params.slug])

  function formatBRL(val: number) {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const produtosFiltrados = PRODUTOS_MOCK.filter(p => {
    const matchCategoria = categoriaAtiva === 'Tudo' || p.categoria === categoriaAtiva
    const matchBusca = busca === '' || p.nome.toLowerCase().includes(busca.toLowerCase())
    return matchCategoria && matchBusca
  })

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA' }}>
        <div style={{ fontSize: 13, color: '#999', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 500 }}>
          Carregando loja...
        </div>
      </div>
    )
  }

  if (!revendedora) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA', padding: 40 }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💎</div>
          <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 28, fontWeight: 700, color: '#1A1A1A', marginBottom: 8 }}>
            Loja não encontrada
          </h1>
          <p style={{ fontSize: 14, color: '#777', lineHeight: 1.6 }}>
            Esta loja pode estar inativa ou o link está incorreto.
          </p>
        </div>
      </div>
    )
  }

  const nomeLoja = revendedora.nome_loja || `Loja da ${revendedora.nome.split(' ')[0]}`
  const whatsappLimpo = revendedora.whatsapp.replace(/\D/g, '')

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: '-apple-system, "Inter", sans-serif' }}>

      <header style={{ background: 'white', borderBottom: '1px solid #EEE', padding: '20px 24px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: revendedora.foto_url ? `url(${revendedora.foto_url}) center/cover` : '#1A1A1A',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: 18,
            }}>
              {!revendedora.foto_url && revendedora.nome[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 20, fontWeight: 700, color: '#1A1A1A', letterSpacing: -0.3, lineHeight: 1.1 }}>
                {nomeLoja}
              </div>
              <div style={{ fontSize: 11, color: '#999', letterSpacing: 1, textTransform: 'uppercase', marginTop: 2, fontWeight: 500 }}>
                Joias 925 · {revendedora.cidade}/{revendedora.estado}
              </div>
            </div>
          </div>

          <a
            href={`https://wa.me/55${whatsappLimpo}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 18px', borderRadius: 24,
              background: '#1A1A1A', color: 'white',
              fontSize: 13, fontWeight: 600, textDecoration: 'none',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Atendimento
          </a>
        </div>
      </header>

      <section style={{ padding: '60px 24px 40px', textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#999', fontWeight: 600, marginBottom: 16 }}>
          Prata 925 Legítima
        </div>
        <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 700, color: '#1A1A1A', letterSpacing: -1, lineHeight: 1.15, marginBottom: 16 }}>
          Joias que contam<br/>
          <em style={{ fontStyle: 'italic', color: '#555' }}>histórias suas</em>
        </h1>
        <p style={{ fontSize: 15, color: '#777', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
          {revendedora.bio || `Curadoria especial de peças em prata 925, escolhidas com carinho por ${revendedora.nome.split(' ')[0]} para você.`}
        </p>
      </section>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 32px' }}>
        <div style={{ marginBottom: 20 }}>
          <input
            type="text"
            placeholder="Buscar joia..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            style={{
              width: '100%', padding: '14px 18px',
              border: '1px solid #EEE', borderRadius: 12,
              fontSize: 14, background: 'white',
              outline: 'none',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
          {CATEGORIAS.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoriaAtiva(cat)}
              style={{
                padding: '8px 18px', borderRadius: 24,
                border: '1px solid',
                borderColor: categoriaAtiva === cat ? '#1A1A1A' : '#EEE',
                background: categoriaAtiva === cat ? '#1A1A1A' : 'white',
                color: categoriaAtiva === cat ? 'white' : '#555',
                fontSize: 13, fontWeight: 500,
                whiteSpace: 'nowrap', cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all .15s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>
        {produtosFiltrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>
            Nenhuma joia encontrada nesta busca.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
            {produtosFiltrados.map(p => (
              <Link
                key={p.id}
                href={`/loja/${params.slug}/produto/${p.id}`}
                style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
              >
                <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', border: '1px solid #EEE', transition: 'all .2s' }}>
                  <div style={{ position: 'relative', paddingTop: '100%', background: '#F5F5F5', overflow: 'hidden' }}>
                    <img src={p.foto} alt={p.nome} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}/>
                    {p.destaque && (
                      <div style={{ position: 'absolute', top: 12, left: 12, background: '#1A1A1A', color: 'white', fontSize: 10, padding: '4px 10px', borderRadius: 12, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>
                        Destaque
                      </div>
                    )}
                  </div>
                  <div style={{ padding: 16 }}>
                    <div style={{ fontSize: 10, color: '#999', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>
                      {p.categoria}
                    </div>
                    <div style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 16, color: '#1A1A1A', marginBottom: 8, lineHeight: 1.3, fontWeight: 600 }}>
                      {p.nome}
                    </div>
                    <div style={{ fontSize: 18, color: '#1A1A1A', fontWeight: 700 }}>
                      {formatBRL(p.preco)}
                    </div>
                    <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>
                      ou 3x de {formatBRL(p.preco / 3)} sem juros
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <footer style={{ background: '#1A1A1A', color: 'white', padding: '48px 24px', marginTop: 80 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 24, fontWeight: 700, marginBottom: 8, letterSpacing: -0.3 }}>
            {nomeLoja}
          </div>
          <div style={{ fontSize: 12, color: '#999', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 24 }}>
            Joias 925
          </div>

          <div style={{ display: 'inline-block', padding: '20px 32px', border: '1px solid #333', borderRadius: 16, marginBottom: 32 }}>
            <div style={{ fontSize: 11, color: '#999', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>
              Selo de qualidade
            </div>
            <div style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 32, fontWeight: 700, color: 'white', letterSpacing: 2 }}>
              925
            </div>
            <div style={{ fontSize: 10, color: '#777', marginTop: 4 }}>
              Prata legítima certificada
            </div>
          </div>

          <div style={{ fontSize: 13, color: '#999', lineHeight: 1.8, marginBottom: 16 }}>
            Atendimento personalizado via WhatsApp<br/>
            Envio para todo o Brasil
          </div>

          <a
            href={`https://wa.me/55${whatsappLimpo}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 24, background: 'white', color: '#1A1A1A', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
          >
            Falar com {revendedora.nome.split(' ')[0]}
          </a>

          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #333', fontSize: 11, color: '#666' }}>
            © Prata de 15 Reais · {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </div>
  )
}