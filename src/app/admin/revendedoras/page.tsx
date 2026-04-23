'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function AdminHomePage() {
  const [stats, setStats] = useState({
    totalRevendedoras: 0,
    revendedorasAtivas: 0,
    vendasMes: 0,
    receitaMes: 0,
    saldoPendente: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { count: total } = await supabase.from('revendedoras').select('*', { count: 'exact', head: true })
      const { count: ativas } = await supabase.from('revendedoras').select('*', { count: 'exact', head: true }).eq('status', 'ativa')
      const inicioMes = new Date()
      inicioMes.setDate(1)
      inicioMes.setHours(0, 0, 0, 0)
      const { data: vendasMes } = await supabase.from('vendas').select('valor_total, valor_comissao').gte('criado_em', inicioMes.toISOString()).eq('status', 'pago')
      const receita = vendasMes?.reduce((acc, v) => acc + Number(v.valor_total), 0) || 0
      const { data: saldos } = await supabase.from('revendedoras').select('saldo_disponivel')
      const pendente = saldos?.reduce((acc, r) => acc + Number(r.saldo_disponivel), 0) || 0
      setStats({
        totalRevendedoras: total || 0,
        revendedorasAtivas: ativas || 0,
        vendasMes: vendasMes?.length || 0,
        receitaMes: receita,
        saldoPendente: pendente,
      })
      setLoading(false)
    }
    load()
  }, [])

  function formatBRL(val: number) {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  function formatNum(n: number) {
    return n.toLocaleString('pt-BR')
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ fontSize: 13, color: '#94A3B8', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>Carregando</div>
      </div>
    )
  }

  const metricas = [
    {
      label: 'Revendedoras',
      sub: 'cadastradas',
      val: formatNum(stats.totalRevendedoras),
      delta: `${stats.revendedorasAtivas} ativas`,
      deltaType: 'neutral',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      )
    },
    {
      label: 'Vendas',
      sub: 'este mês',
      val: formatNum(stats.vendasMes),
      delta: stats.vendasMes > 0 ? 'Em progresso' : 'Sem vendas',
      deltaType: stats.vendasMes > 0 ? 'positive' : 'neutral',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
          <path d="M3 6h18"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
      )
    },
    {
      label: 'Receita',
      sub: 'este mês',
      val: formatBRL(stats.receitaMes),
      delta: 'Vendas pagas',
      deltaType: 'neutral',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      )
    },
    {
      label: 'Comissões',
      sub: 'a pagar',
      val: formatBRL(stats.saldoPendente),
      delta: 'Pendente',
      deltaType: 'warning',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      )
    },
  ]

  const secoes = [
    {
      label: 'Revendedoras',
      href: '/admin/revendedoras',
      desc: 'Lista completa com busca e filtros por status',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="8.5" cy="7" r="4"/>
          <line x1="20" y1="8" x2="20" y2="14"/>
          <line x1="23" y1="11" x2="17" y2="11"/>
        </svg>
      )
    },
    {
      label: 'Vendas',
      href: '/admin/vendas',
      desc: 'Histórico de vendas por revendedora',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      )
    },
    {
      label: 'Saldos',
      href: '/admin/saldos',
      desc: 'Pagamentos pendentes e histórico',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
          <line x1="1" y1="10" x2="23" y2="10"/>
        </svg>
      )
    },
    {
      label: 'Mensalidades',
      href: '/admin/mensalidades',
      desc: 'Status de pagamento mensal',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      )
    },
  ]

  return (
    <div className="bo-wrap">
      <header className="bo-top">
        <div className="bo-brand">
          <div className="bo-brand-mark">P15</div>
          <div className="bo-brand-text">
            <div className="bo-brand-name">Prata de 15 Reais</div>
            <div className="bo-brand-sub">Backoffice administrativo</div>
          </div>
        </div>
        <button onClick={() => { sessionStorage.removeItem('admin_auth'); window.location.reload() }} className="bo-logout">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sair
        </button>
      </header>

      <div className="bo-hero">
        <div className="bo-hero-eyebrow">Visão geral</div>
        <div className="bo-hero-title">Painel de controle</div>
        <div className="bo-hero-sub">Acompanhe o desempenho das revendedoras em tempo real</div>
      </div>

      <div className="bo-metrics">
        {metricas.map((m, i) => (
          <div key={i} className="bo-metric">
            <div className="bo-metric-head">
              <div className="bo-metric-icon">{m.icon}</div>
              <div className="bo-metric-sub">{m.sub}</div>
            </div>
            <div className="bo-metric-label">{m.label}</div>
            <div className="bo-metric-val">{m.val}</div>
            <div className={`bo-metric-delta bo-delta-${m.deltaType}`}>{m.delta}</div>
          </div>
        ))}
      </div>

      <div className="bo-section-head">
        <div className="bo-section-title">Gestão</div>
        <div className="bo-section-sub">Acesse as áreas administrativas</div>
      </div>

      <div className="bo-sections">
        {secoes.map((s, i) => (
          <a key={i} href={s.href} className="bo-section">
            <div className="bo-section-icon">{s.icon}</div>
            <div className="bo-section-content">
              <div className="bo-section-label">{s.label}</div>
              <div className="bo-section-desc">{s.desc}</div>
            </div>
            <div className="bo-section-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </a>
        ))}
      </div>

      <style jsx>{`
        .bo-wrap {
          width: 100%;
          max-width: 100%;
          min-height: 100vh;
          padding: 40px 56px 56px;
          box-sizing: border-box;
          background: #FAFAFA;
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', system-ui, sans-serif;
        }
        .bo-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 24px;
          border-bottom: 1px solid #EFEFEF;
          margin-bottom: 40px;
        }
        .bo-brand {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .bo-brand-mark {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #1A1A1A;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 13px;
          letter-spacing: .5px;
        }
        .bo-brand-name {
          font-size: 14px;
          font-weight: 600;
          color: #1A1A1A;
          line-height: 1.2;
        }
        .bo-brand-sub {
          font-size: 12px;
          color: #94A3B8;
          margin-top: 2px;
        }
        .bo-logout {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: white;
          border: 1px solid #E5E5E5;
          border-radius: 8px;
          font-size: 13px;
          cursor: pointer;
          color: #555;
          transition: all .15s;
        }
        .bo-logout:hover {
          border-color: #1A1A1A;
          color: #1A1A1A;
        }
        .bo-hero {
          margin-bottom: 32px;
        }
        .bo-hero-eyebrow {
          font-size: 11px;
          font-weight: 600;
          color: #E8396A;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 10px;
        }
        .bo-hero-title {
          font-size: 32px;
          font-weight: 700;
          color: #1A1A1A;
          letter-spacing: -.5px;
          margin-bottom: 6px;
        }
        .bo-hero-sub {
          font-size: 14px;
          color: #64748B;
        }
        .bo-metrics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 48px;
        }
        .bo-metric {
          background: white;
          padding: 24px;
          border-radius: 12px;
          border: 1px solid #EFEFEF;
          transition: border-color .15s;
        }
        .bo-metric:hover {
          border-color: #1A1A1A;
        }
        .bo-metric-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .bo-metric-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: #F5F5F5;
          color: #1A1A1A;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bo-metric-sub {
          font-size: 11px;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: .5px;
          font-weight: 600;
        }
        .bo-metric-label {
          font-size: 13px;
          color: #64748B;
          margin-bottom: 8px;
        }
        .bo-metric-val {
          font-size: 28px;
          font-weight: 700;
          color: #1A1A1A;
          letter-spacing: -.5px;
          margin-bottom: 12px;
          line-height: 1;
        }
        .bo-metric-delta {
          font-size: 12px;
          font-weight: 500;
          display: inline-block;
          padding: 3px 10px;
          border-radius: 20px;
        }
        .bo-delta-positive {
          background: #ECFDF5;
          color: #059669;
        }
        .bo-delta-warning {
          background: #FFFBEB;
          color: #D97706;
        }
        .bo-delta-neutral {
          background: #F5F5F5;
          color: #64748B;
        }
        .bo-section-head {
          margin-bottom: 20px;
        }
        .bo-section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1A1A1A;
          margin-bottom: 4px;
        }
        .bo-section-sub {
          font-size: 13px;
          color: #94A3B8;
        }
        .bo-sections {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .bo-section {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 24px;
          background: white;
          border: 1px solid #EFEFEF;
          border-radius: 12px;
          text-decoration: none;
          color: inherit;
          transition: all .15s;
        }
        .bo-section:hover {
          border-color: #1A1A1A;
          transform: translateX(2px);
        }
        .bo-section-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #F5F5F5;
          color: #1A1A1A;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .bo-section-content {
          flex: 1;
          min-width: 0;
        }
        .bo-section-label {
          font-size: 15px;
          font-weight: 600;
          color: #1A1A1A;
          margin-bottom: 2px;
        }
        .bo-section-desc {
          font-size: 12px;
          color: #64748B;
        }
        .bo-section-arrow {
          color: #CBD5E1;
          flex-shrink: 0;
        }
        .bo-section:hover .bo-section-arrow {
          color: #1A1A1A;
        }
        @media (max-width: 1100px) {
          .bo-metrics { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 900px) {
          .bo-wrap { padding: 24px 20px; }
          .bo-hero-title { font-size: 24px; }
          .bo-sections { grid-template-columns: 1fr; }
        }
        @media (max-width: 500px) {
          .bo-metrics { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}