'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient, type Venda } from '@/lib/supabase'
import BottomNav from '@/components/dashboard/BottomNav'

export default function VendasPage() {
  const router = useRouter()
  const [vendas, setVendas] = useState<Venda[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<'todos' | 'pago' | 'processando' | 'pendente'>('todos')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      const { data: rev } = await supabase.from('revendedoras').select('id').eq('user_id', user.id).single()
      if (!rev) return

      const { data } = await supabase
        .from('vendas').select('*')
        .eq('revendedora_id', rev.id)
        .order('criado_em', { ascending: false })

      setVendas(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const vendasFiltradas = filtro === 'todos' ? vendas : vendas.filter(v => v.status === filtro)
  const totalComissao = vendas.filter(v => v.status === 'pago').reduce((acc, v) => acc + v.valor_comissao, 0)
  const formatBRL = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const statusCor = (s: string) => {
    if (s === 'pago') return { bg: '#E1F5EE', color: '#089C82', label: 'Pago' }
    if (s === 'processando') return { bg: 'var(--teal-pale)', color: 'var(--teal-dark)', label: 'Processando' }
    if (s === 'cancelado') return { bg: '#FCEBEB', color: '#A32D2D', label: 'Cancelado' }
    return { bg: 'var(--rosa-mist)', color: 'var(--rosa)', label: 'Pendente' }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--off)', paddingBottom: 90 }}>

      <header style={{ background: 'white', borderBottom: '1px solid var(--rosa-border)', padding: '0 20px', height: 58, display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 100 }}>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--cinza)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div style={{ fontFamily: 'Montserrat', fontSize: 16, fontWeight: 800, color: 'var(--texto)' }}>Minhas vendas</div>
      </header>

      {/* Resumo */}
      <div style={{ background: 'var(--rosa)', padding: '16px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { val: vendas.length.toString(), label: 'Total' },
            { val: vendas.filter(v => v.status === 'pago').length.toString(), label: 'Pagas' },
            { val: formatBRL(totalComissao), label: 'Comissão' },
          ].map((m, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Montserrat', fontSize: 20, fontWeight: 900, color: 'white', lineHeight: 1, marginBottom: 3 }}>{m.val}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.75)' }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 8, padding: '16px 16px 8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {(['todos', 'pago', 'processando', 'pendente'] as const).map(f => (
          <button key={f} onClick={() => setFiltro(f)} style={{ whiteSpace: 'nowrap', padding: '7px 16px', borderRadius: 30, fontSize: 12, fontWeight: 600, fontFamily: 'Montserrat', border: 'none', cursor: 'pointer', background: filtro === f ? 'var(--rosa)' : 'white', color: filtro === f ? 'white' : 'var(--cinza)', border: filtro === f ? 'none' : '1px solid var(--cinza-light)' } as any}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ padding: '8px 16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--cinza)' }}>Carregando...</div>
        ) : vendasFiltradas.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px 20px', marginTop: 8 }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🛍️</div>
            <div style={{ fontFamily: 'Montserrat', fontSize: 14, fontWeight: 700, color: 'var(--texto)', marginBottom: 4 }}>Nenhuma venda aqui</div>
            <div style={{ fontSize: 13, color: 'var(--cinza)' }}>Compartilhe seu link para começar a vender!</div>
          </div>
        ) : vendasFiltradas.map(v => {
          const cor = statusCor(v.status)
          return (
            <div key={v.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <div style={{ width: 52, height: 52, borderRadius: 10, background: 'var(--rosa-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 22 }}>
                {v.produto_foto ? <img src={v.produto_foto} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }}/> : '💎'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--texto)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 2 }}>
                  {v.produto_nome}
                </div>
                <div style={{ fontSize: 11, color: 'var(--cinza)', marginBottom: 2 }}>
                  {v.cliente_nome} · Pedido #{v.pedido_id}
                </div>
                <div style={{ fontSize: 11, color: 'var(--cinza)' }}>
                  {new Date(v.criado_em).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: 'Montserrat', fontSize: 15, fontWeight: 800, color: 'var(--teal-dark)', marginBottom: 3 }}>
                  +{formatBRL(v.valor_comissao)}
                </div>
                <div style={{ fontSize: 9, fontWeight: 700, fontFamily: 'Montserrat', padding: '3px 8px', borderRadius: 20, textTransform: 'uppercase', background: cor.bg, color: cor.color, display: 'inline-block' }}>
                  {cor.label}
                </div>
                <div style={{ fontSize: 10, color: 'var(--cinza)', marginTop: 2 }}>
                  {formatBRL(v.valor_total)} total
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <BottomNav ativa="vendas" />
    </div>
  )
}
