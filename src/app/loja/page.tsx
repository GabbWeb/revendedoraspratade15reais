'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient, type Revendedora } from '@/lib/supabase'
import BottomNav from '@/components/dashboard/BottomNav'

export default function LojaPage() {
  const router = useRouter()
  const [revendedora, setRevendedora] = useState<Revendedora | null>(null)
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [salvo, setSalvo] = useState(false)
  const [linkCopiado, setLinkCopiado] = useState(false)

  const [form, setForm] = useState({ bio: '', whatsapp: '', cidade: '', estado: '' })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      const { data: rev } = await supabase.from('revendedoras').select('*').eq('user_id', user.id).single()
      if (!rev) return
      setRevendedora(rev)
      setForm({ bio: rev.bio || '', whatsapp: rev.whatsapp || '', cidade: rev.cidade || '', estado: rev.estado || '' })
      setLoading(false)
    }
    load()
  }, [])

  async function salvarPerfil(e: React.FormEvent) {
    e.preventDefault()
    setSalvando(true)
    const supabase = createClient()
    await supabase.from('revendedoras').update({
      bio: form.bio, whatsapp: form.whatsapp,
      cidade: form.cidade, estado: form.estado,
      atualizado_em: new Date().toISOString(),
    }).eq('id', revendedora?.id)
    setSalvando(false)
    setSalvo(true)
    setTimeout(() => setSalvo(false), 2500)
  }

  function copiarLink() {
    navigator.clipboard.writeText(`https://${revendedora?.subdominio}.prata15.com.br`)
    setLinkCopiado(true)
    setTimeout(() => setLinkCopiado(false), 2000)
  }

  function compartilharWhatsApp() {
    const link = `https://${revendedora?.subdominio}.prata15.com.br`
    const texto = `✨ Confere minha loja de prata 925! Temos mais de 3.000 peças com qualidade garantida 💎\n\n${link}`
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 13, color: 'var(--cinza)' }}>Carregando...</div>
    </div>
  )

  const link = `${revendedora?.subdominio}.prata15.com.br`

  return (
    <div style={{ minHeight: '100vh', background: 'var(--off)', paddingBottom: 90 }}>

      <header style={{ background: 'white', borderBottom: '1px solid var(--rosa-border)', padding: '0 20px', height: 58, display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 100 }}>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cinza)', display: 'flex', alignItems: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div style={{ fontFamily: 'Montserrat', fontSize: 16, fontWeight: 800, color: 'var(--texto)' }}>Minha loja</div>
      </header>

      {/* Preview da loja */}
      <div style={{ background: 'var(--rosa)', padding: '24px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle,rgba(255,255,255,.08) 1.5px,transparent 1.5px)', backgroundSize: '20px 20px', pointerEvents: 'none' }}/>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,.2)', border: '2px solid rgba(255,255,255,.3)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontSize: 26, fontWeight: 900, color: 'white', position: 'relative' }}>
          {revendedora?.nome?.[0]?.toUpperCase()}
        </div>
        <div style={{ fontFamily: 'Montserrat', fontSize: 18, fontWeight: 900, color: 'white', marginBottom: 4, position: 'relative' }}>
          {revendedora?.nome}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.8)', marginBottom: 16, position: 'relative' }}>
          {revendedora?.cidade}, {revendedora?.estado}
        </div>
        <div style={{ background: 'rgba(255,255,255,.15)', borderRadius: 12, padding: '10px 14px', display: 'inline-flex', alignItems: 'center', gap: 8, position: 'relative' }}>
          <div style={{ fontSize: 13, color: 'white', fontWeight: 600 }}>{link}</div>
        </div>
      </div>

      {/* Ações do link */}
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
          <button onClick={copiarLink} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '12px 8px', borderRadius: 12, border: '1px solid var(--cinza-light)', background: linkCopiado ? 'var(--teal-pale)' : 'white', cursor: 'pointer', transition: 'all .2s' }}>
            <span style={{ fontSize: 20 }}>{linkCopiado ? '✅' : '📋'}</span>
            <span style={{ fontSize: 11, fontWeight: 600, fontFamily: 'Montserrat', color: linkCopiado ? 'var(--teal-dark)' : 'var(--texto)' }}>{linkCopiado ? 'Copiado!' : 'Copiar link'}</span>
          </button>
          <button onClick={compartilharWhatsApp} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '12px 8px', borderRadius: 12, border: '1px solid var(--cinza-light)', background: 'white', cursor: 'pointer' }}>
            <span style={{ fontSize: 20 }}>📲</span>
            <span style={{ fontSize: 11, fontWeight: 600, fontFamily: 'Montserrat', color: 'var(--texto)' }}>Whatsapp</span>
          </button>
          <button onClick={() => window.open(`https://${link}`, '_blank')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '12px 8px', borderRadius: 12, border: '1px solid var(--cinza-light)', background: 'white', cursor: 'pointer' }}>
            <span style={{ fontSize: 20 }}>👁️</span>
            <span style={{ fontSize: 11, fontWeight: 600, fontFamily: 'Montserrat', color: 'var(--texto)' }}>Ver loja</span>
          </button>
        </div>

        {/* Stats da loja */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: 'Montserrat', fontSize: 12, fontWeight: 700, color: 'var(--cinza)', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 12 }}>
            Status da loja
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Itens no catálogo', val: '+3.000', icon: '💎' },
              { label: 'Total de vendas', val: revendedora?.total_vendas?.toString() || '0', icon: '🛍️' },
              { label: 'Status', val: revendedora?.status === 'ativa' ? 'Ativa ✅' : 'Pendente ⏳', icon: '📊' },
              { label: 'Subdomínio', val: revendedora?.subdominio || '', icon: '🌐' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>{s.icon}</span>
                <div>
                  <div style={{ fontFamily: 'Montserrat', fontSize: 13, fontWeight: 700, color: 'var(--texto)' }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: 'var(--cinza)' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editar perfil */}
        <div className="card">
          <div style={{ fontFamily: 'Montserrat', fontSize: 14, fontWeight: 700, color: 'var(--texto)', marginBottom: 16 }}>
            ✏️ Editar meu perfil
          </div>
          <form onSubmit={salvarPerfil}>
            {[
              { label: 'WhatsApp', field: 'whatsapp', type: 'tel', placeholder: '(11) 99999-9999' },
              { label: 'Cidade', field: 'cidade', type: 'text', placeholder: 'São Paulo' },
              { label: 'Estado', field: 'estado', type: 'text', placeholder: 'SP' },
            ].map(f => (
              <div key={f.field} style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--texto)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: .3 }}>{f.label}</label>
                <input className="input-padrao" type={f.type} placeholder={f.placeholder} value={(form as any)[f.field]} onChange={e => setForm(p => ({ ...p, [f.field]: e.target.value }))}/>
              </div>
            ))}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--texto)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: .3 }}>Bio da loja</label>
              <textarea className="input-padrao" placeholder="Fale sobre você para suas clientes..." value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={3} style={{ resize: 'none' }}/>
            </div>

            {salvo && (
              <div style={{ background: '#E1F5EE', border: '1px solid #9FE1CB', borderRadius: 10, padding: '10px 14px', marginBottom: 12, fontSize: 13, color: '#089C82', textAlign: 'center', fontWeight: 600 }}>
                ✅ Perfil salvo com sucesso!
              </div>
            )}

            <button className="btn-rosa" type="submit" disabled={salvando}>
              {salvando ? 'Salvando...' : '💾 Salvar alterações'}
            </button>
          </form>
        </div>
      </div>

      <BottomNav ativa="loja" />
    </div>
  )
}
