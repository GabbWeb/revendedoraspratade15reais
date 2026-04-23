'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient, type Revendedora } from '@/lib/supabase'
import BottomNav from '@/components/dashboard/BottomNav'

export default function PerfilPage() {
  const router = useRouter()
  const [revendedora, setRevendedora] = useState<Revendedora | null>(null)
  const [loading, setLoading] = useState(true)
  const [saindo, setSaindo] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data: rev } = await supabase.from('revendedoras').select('*').eq('user_id', user.id).single()
      if (!rev) return
      setRevendedora(rev)
      setLoading(false)
    }
    load()
  }, [])

  async function sair() {
    setSaindo(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const formatBRL = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  const formatDate = (d: string) => new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })

  if (loading) return (
    <div className="revendedora-app" style={{ minHeight: '100vh', background: 'var(--off)', paddingBottom: 90 }}>
      <div style={{ fontSize: 13, color: 'var(--cinza)' }}>Carregando...</div>
    </div>
  )

  return (
    <div className="revendedora-app" style={{ minHeight: '100vh', background: 'var(--off)', paddingBottom: 90 }}>

      <header style={{ background: 'white', borderBottom: '1px solid var(--rosa-border)', padding: '0 20px', height: 58, display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 100 }}>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cinza)', display: 'flex', alignItems: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div style={{ fontFamily: 'Montserrat', fontSize: 16, fontWeight: 800, color: 'var(--texto)' }}>Meu perfil</div>
      </header>

      {/* Avatar + nome */}
      <div style={{ background: 'var(--rosa-pale)', padding: '32px 20px', textAlign: 'center', borderBottom: '1px solid var(--rosa-border)' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--rosa)', border: '3px solid var(--rosa-border)', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontSize: 32, fontWeight: 900, color: 'white' }}>
          {revendedora?.nome?.[0]?.toUpperCase()}
        </div>
        <div style={{ fontFamily: 'Montserrat', fontSize: 20, fontWeight: 900, color: 'var(--texto)', marginBottom: 4 }}>
          {revendedora?.nome}
        </div>
        <div style={{ fontSize: 13, color: 'var(--cinza)', marginBottom: 8 }}>
          {revendedora?.email}
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: revendedora?.status === 'ativa' ? '#E1F5EE' : 'var(--rosa-mist)', borderRadius: 20, padding: '5px 14px', fontSize: 12, fontWeight: 600, color: revendedora?.status === 'ativa' ? '#089C82' : 'var(--rosa)' }}>
          {revendedora?.status === 'ativa' ? '✅ Revendedora ativa' : '⏳ Aprovação pendente'}
        </div>
      </div>

      <div style={{ padding: '16px 16px 0' }}>

        {/* Dados */}
        <div className="card" style={{ marginBottom: 12 }}>
          <div style={{ fontFamily: 'Montserrat', fontSize: 13, fontWeight: 700, color: 'var(--texto)', marginBottom: 14 }}>
            📋 Seus dados
          </div>
          {[
            { label: 'Nome', val: revendedora?.nome },
            { label: 'E-mail', val: revendedora?.email },
            { label: 'WhatsApp', val: revendedora?.whatsapp },
            { label: 'Cidade / Estado', val: `${revendedora?.cidade}, ${revendedora?.estado}` },
            { label: 'Subdomínio da loja', val: `${revendedora?.subdominio}.prata15.com.br` },
            { label: 'Membro desde', val: formatDate(revendedora?.criado_em || '') },
          ].map((d, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 5 ? '1px solid var(--cinza-light)' : 'none' }}>
              <div style={{ fontSize: 12, color: 'var(--cinza)' }}>{d.label}</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--texto)', textAlign: 'right', maxWidth: '60%', wordBreak: 'break-all' }}>{d.val}</div>
            </div>
          ))}
        </div>

        {/* Resumo financeiro */}
        <div className="card" style={{ marginBottom: 12 }}>
          <div style={{ fontFamily: 'Montserrat', fontSize: 13, fontWeight: 700, color: 'var(--texto)', marginBottom: 14 }}>
            💰 Resumo financeiro
          </div>
          {[
            { label: 'Total de vendas', val: revendedora?.total_vendas?.toString() || '0' },
            { label: 'Total ganho', val: formatBRL(revendedora?.total_ganho || 0) },
            { label: 'Saldo disponível', val: formatBRL(revendedora?.saldo_disponivel || 0) },
          ].map((d, i, arr) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--cinza-light)' : 'none' }}>
              <div style={{ fontSize: 12, color: 'var(--cinza)' }}>{d.label}</div>
              <div style={{ fontFamily: 'Montserrat', fontSize: 14, fontWeight: 800, color: 'var(--teal-dark)' }}>{d.val}</div>
            </div>
          ))}
        </div>

        {/* Ações */}
        <div className="card" style={{ marginBottom: 12 }}>
          {[
            { label: '🔐 Alterar senha', action: () => router.push('/auth/alterar-senha') },
            { label: '🛍️ Configurar minha loja', action: () => router.push('/loja') },
            { label: '💸 Ver histórico de saques', action: () => router.push('/saldo') },
            { label: '📊 Ver todas as vendas', action: () => router.push('/vendas') },
          ].map((a, i, arr) => (
            <button key={i} onClick={a.action} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--cinza-light)' : 'none', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--texto)', textAlign: 'left' }}>
              {a.label}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cinza)" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          ))}
        </div>

        {/* Sair */}
        <button onClick={sair} disabled={saindo} style={{ width: '100%', padding: 16, borderRadius: 14, border: '1.5px solid var(--rosa-border)', background: 'var(--rosa-pale)', color: 'var(--rosa)', fontFamily: 'Montserrat', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: 8 }}>
          {saindo ? 'Saindo...' : '🚪 Sair da conta'}
        </button>

        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--cinza)', padding: '8px 0' }}>
          Prata 15 · Sistema de Revendedoras · v1.0
        </div>
      </div>

      <BottomNav ativa="perfil" />
    </div>
  )
}
