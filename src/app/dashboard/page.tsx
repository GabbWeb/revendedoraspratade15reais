'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient, type Revendedora, type Venda, type Notificacao } from '@/lib/supabase'
import ModalSaque from '@/components/dashboard/ModalSaque'
import BottomNav from '@/components/dashboard/BottomNav'

export default function DashboardPage() {
  const router = useRouter()
  const [revendedora, setRevendedora] = useState<Revendedora | null>(null)
  const [vendas, setVendas] = useState<Venda[]>([])
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])
  const [loading, setLoading] = useState(true)
  const [modalSaque, setModalSaque] = useState(false)
  const [linkCopiado, setLinkCopiado] = useState(false)

  useEffect(() => {
    async function carregarDados() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      const { data: rev } = await supabase
        .from('revendedoras')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!rev) { router.push('/auth/login'); return }
      setRevendedora(rev)

      const { data: v } = await supabase
        .from('vendas')
        .select('*')
        .eq('revendedora_id', rev.id)
        .order('criado_em', { ascending: false })
        .limit(5)

      const { data: n } = await supabase
        .from('notificacoes')
        .select('*')
        .eq('revendedora_id', rev.id)
        .eq('lida', false)
        .order('criado_em', { ascending: false })
        .limit(10)

      setVendas(v || [])
      setNotificacoes(n || [])
      setLoading(false)
    }
    carregarDados()
  }, [])

  function copiarLink() {
    if (!revendedora) return
    navigator.clipboard.writeText(`https://${revendedora.subdominio}.prata15.com.br`)
    setLinkCopiado(true)
    setTimeout(() => setLinkCopiado(false), 2000)
  }

  function statusCor(status: string) {
    if (status === 'pago') return { bg: '#E1F5EE', color: '#089C82' }
    if (status === 'processando') return { bg: 'var(--teal-pale)', color: 'var(--teal-dark)' }
    return { bg: 'var(--rosa-mist)', color: 'var(--rosa)' }
  }

  function formatBRL(val: number) {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  if (loading) {
    return (
      <div className="revendedora-app" style={{ minHeight: '100vh', background: 'var(--off)', paddingBottom: 90 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid var(--rosa-border)', borderTopColor: 'var(--rosa)', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }}/>
          <div style={{ fontSize: 13, color: 'var(--cinza)' }}>Carregando sua loja...</div>
        </div>
      </div>
    )
  }

  const mesAtual = new Date().toLocaleString('pt-BR', { month: 'long' })
  const vendasMes = vendas.filter(v => new Date(v.criado_em).getMonth() === new Date().getMonth())
  const comissaoMes = vendasMes.reduce((acc, v) => acc + v.valor_comissao, 0)

  return (
    <div className="revendedora-app" style={{ minHeight: '100vh', background: 'var(--off)', paddingBottom: 90 }}>

      {/* HEADER */}
      <header style={{ background: 'white', borderBottom: '1px solid var(--rosa-border)', padding: '0 20px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
       <div>
  <div style={{ fontFamily: 'Montserrat', fontSize: 15, fontWeight: 800, color: 'var(--texto)', lineHeight: 1.1 }}>
    {revendedora?.nome_loja || `Olá, ${revendedora?.nome?.split(' ')[0]}`}
  </div>
  <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--cinza)', marginTop: 3 }}>
    Minha loja 925
  </div>
</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ position: 'relative', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--off)', borderRadius: '50%', border: '1px solid var(--cinza-light)', cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="2" strokeLinecap="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            {notificacoes.length > 0 && (
              <div style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: 'var(--rosa)', border: '1.5px solid white' }}/>
            )}
          </div>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--rosa-pale)', border: '2px solid var(--rosa-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontSize: 14, fontWeight: 800, color: 'var(--rosa)', cursor: 'pointer' }}>
            {revendedora?.nome?.[0]?.toUpperCase()}
          </div>
        </div>
      </header>

      {/* BOAS VINDAS */}
      <div style={{ background: 'var(--rosa)', padding: '20px 20px 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle,rgba(255,255,255,.08) 1.5px,transparent 1.5px)', backgroundSize: '20px 20px', pointerEvents: 'none' }}/>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,.8)', marginBottom: 3, position: 'relative' }}>Olá, bem-vinda de volta 👋</div>
        <div style={{ fontFamily: 'Montserrat', fontSize: 22, fontWeight: 900, color: 'white', marginBottom: 8, position: 'relative' }}>
          {revendedora?.nome?.split(' ')[0]}
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,.15)', borderRadius: 20, padding: '4px 12px', fontSize: 11, color: 'rgba(255,255,255,.9)', fontWeight: 500, position: 'relative' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#5DD9C1' }}/>
          Revendedora ativa
        </div>
      </div>

      {/* SALDO CARD */}
      <div style={{ margin: '-16px 16px 0', position: 'relative', zIndex: 10 }}>
        <div className="card fade-up" style={{ padding: 20, boxShadow: '0 4px 20px rgba(232,57,106,.1)' }}>
          <div style={{ fontSize: 11, color: 'var(--cinza)', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 6, fontWeight: 600 }}>
            Saldo disponível para saque
          </div>
          <div style={{ fontFamily: 'Montserrat', fontSize: 38, fontWeight: 900, color: 'var(--texto)', lineHeight: 1, letterSpacing: -2, marginBottom: 4 }}>
            <sup style={{ fontSize: 16, color: 'var(--cinza)', verticalAlign: 'top', marginTop: 8, display: 'inline-block' }}>R$</sup>
            {formatBRL(revendedora?.saldo_disponivel || 0).replace('R$\u00a0', '').replace('R$', '')}
          </div>
          {(revendedora?.saldo_processando || 0) > 0 && (
            <div style={{ fontSize: 12, color: 'var(--cinza)', marginBottom: 16 }}>
              + <span style={{ color: 'var(--teal-dark)', fontWeight: 600 }}>{formatBRL(revendedora?.saldo_processando || 0)}</span> processando
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
            <button onClick={() => setModalSaque(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 12, borderRadius: 12, border: 'none', cursor: 'pointer', background: 'var(--teal)', color: 'white', fontFamily: 'Montserrat', fontSize: 13, fontWeight: 700 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
              Sacar via Pix
            </button>
            <button onClick={() => setModalSaque(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 12, borderRadius: 12, cursor: 'pointer', background: 'var(--rosa-pale)', color: 'var(--rosa)', fontFamily: 'Montserrat', fontSize: 13, fontWeight: 700, border: '1.5px solid var(--rosa-border)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E8396A" strokeWidth="2.5" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              Crédito loja
            </button>
          </div>
        </div>
      </div>

      {/* MÉTRICAS */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ fontFamily: 'Montserrat', fontSize: 12, fontWeight: 700, color: 'var(--cinza)', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 12 }}>
          Resumo — {mesAtual}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { icon: '🛍️', val: vendasMes.length.toString(), label: 'Vendas no mês', cor: 'var(--teal-pale)', icoCor: '#089C82' },
            { icon: '💰', val: formatBRL(comissaoMes), label: 'Comissão no mês', cor: 'var(--rosa-pale)', icoCor: 'var(--rosa)' },
            { icon: '📦', val: revendedora?.total_vendas?.toString() || '0', label: 'Total de vendas', cor: 'var(--teal-pale)', icoCor: '#089C82' },
            { icon: '💸', val: formatBRL(revendedora?.total_ganho || 0), label: 'Total ganho', cor: 'var(--rosa-pale)', icoCor: 'var(--rosa)' },
          ].map((m, i) => (
            <div key={i} className="card">
              <div style={{ width: 36, height: 36, borderRadius: 10, background: m.cor, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10, fontSize: 18 }}>
                {m.icon}
              </div>
              <div style={{ fontFamily: 'Montserrat', fontSize: 18, fontWeight: 900, color: 'var(--texto)', lineHeight: 1, marginBottom: 3 }}>{m.val}</div>
              <div style={{ fontSize: 11, color: 'var(--cinza)' }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* MINHA LOJA */}
      <div style={{ padding: '16px 16px 0' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--rosa-pale)', border: '1px solid var(--rosa-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E8396A" strokeWidth="2" strokeLinecap="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: 'Montserrat', fontSize: 14, fontWeight: 700, color: 'var(--texto)' }}>Minha loja virtual</div>
              <div style={{ fontSize: 11, color: 'var(--cinza)' }}>+3.000 itens · ativa agora</div>
            </div>
          </div>
          <div style={{ background: 'var(--off)', border: '1px solid var(--cinza-light)', borderRadius: 10, padding: '11px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
            <div style={{ fontSize: 12, color: 'var(--teal-dark)', fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {revendedora?.subdominio}.prata15.com.br
            </div>
            <button onClick={copiarLink} style={{ background: linkCopiado ? 'var(--teal)' : 'var(--teal-pale)', color: linkCopiado ? 'white' : 'var(--teal-dark)', border: '1px solid var(--teal-border)', borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 700, fontFamily: 'Montserrat', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all .2s' }}>
              {linkCopiado ? '✓ Copiado!' : 'Copiar link'}
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => window.open(`https://${revendedora?.subdominio}.prata15.com.br`, '_blank')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: 10, borderRadius: 10, fontSize: 12, fontWeight: 600, fontFamily: 'Montserrat', cursor: 'pointer', border: 'none', background: 'var(--rosa)', color: 'white' }}>
              👁️ Ver minha loja
            </button>
            <button onClick={copiarLink} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: 10, borderRadius: 10, fontSize: 12, fontWeight: 600, fontFamily: 'Montserrat', cursor: 'pointer', background: 'var(--rosa-pale)', color: 'var(--rosa)', border: '1.5px solid var(--rosa-border)' }}>
              📲 Compartilhar
            </button>
          </div>
        </div>
      </div>

      {/* ÚLTIMAS VENDAS */}
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontFamily: 'Montserrat', fontSize: 12, fontWeight: 700, color: 'var(--cinza)', textTransform: 'uppercase', letterSpacing: .5 }}>
            Últimas vendas
          </div>
          <button onClick={() => router.push('/vendas')} style={{ fontSize: 12, color: 'var(--rosa)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
            Ver todas →
          </button>
        </div>

        {vendas.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '32px 20px' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🛍️</div>
            <div style={{ fontFamily: 'Montserrat', fontSize: 14, fontWeight: 700, color: 'var(--texto)', marginBottom: 4 }}>Suas vendas aparecem aqui</div>
            <div style={{ fontSize: 13, color: 'var(--cinza)' }}>Compartilhe seu link da loja para começar!</div>
          </div>
        ) : vendas.map(venda => {
          const cor = statusCor(venda.status)
          return (
            <div key={venda.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              {venda.produto_foto ? (
                <img src={venda.produto_foto} alt="" style={{ width: 52, height: 52, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}/>
              ) : (
                <div style={{ width: 52, height: 52, borderRadius: 10, background: 'var(--rosa-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 22 }}>💎</div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--texto)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 3 }}>
                  {venda.produto_nome}
                </div>
                <div style={{ fontSize: 11, color: 'var(--cinza)' }}>
                  {new Date(venda.criado_em).toLocaleDateString('pt-BR')} · {venda.cliente_nome}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: 'Montserrat', fontSize: 15, fontWeight: 800, color: 'var(--teal-dark)' }}>
                  +{formatBRL(venda.valor_comissao)}
                </div>
                <div style={{ display: 'inline-block', fontSize: 9, fontWeight: 700, fontFamily: 'Montserrat', letterSpacing: .3, padding: '3px 8px', borderRadius: 20, marginTop: 3, textTransform: 'uppercase', background: cor.bg, color: cor.color }}>
                  {venda.status}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* MODAL SAQUE */}
      {modalSaque && (
        <ModalSaque
          saldoDisponivel={revendedora?.saldo_disponivel || 0}
          revendedoraId={revendedora?.id || ''}
          onClose={() => setModalSaque(false)}
          onSucesso={() => {
            setModalSaque(false)
            window.location.reload()
          }}
        />
      )}

      <BottomNav ativa="dashboard" />
    </div>
  )
}
