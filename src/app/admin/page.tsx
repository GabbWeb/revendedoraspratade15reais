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
      
      // Total de revendedoras
      const { count: total } = await supabase
        .from('revendedoras')
        .select('*', { count: 'exact', head: true })

      // Revendedoras ativas
      const { count: ativas } = await supabase
        .from('revendedoras')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ativa')

      // Vendas do mês
      const inicioMes = new Date()
      inicioMes.setDate(1)
      inicioMes.setHours(0, 0, 0, 0)

      const { data: vendasMes } = await supabase
        .from('vendas')
        .select('valor_total, valor_comissao')
        .gte('criado_em', inicioMes.toISOString())
        .eq('status', 'pago')

      const receita = vendasMes?.reduce((acc, v) => acc + Number(v.valor_total), 0) || 0

      // Saldo pendente (total a pagar a revendedoras)
      const { data: saldos } = await supabase
        .from('revendedoras')
        .select('saldo_disponivel')

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

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ fontSize: 14, color: '#777' }}>Carregando backoffice...</div>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: 'Montserrat', fontSize: 12, fontWeight: 700, color: '#E8396A', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>
          Prata de 15 Reais · Backoffice
        </div>
        <div style={{ fontFamily: 'Montserrat', fontSize: 28, fontWeight: 900, color: '#1A1A1A' }}>
          Visão geral
        </div>
      </div>

      {/* Métricas principales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Revendedoras totais', val: stats.totalRevendedoras.toString(), icon: '👯‍♀️' },
          { label: 'Revendedoras ativas', val: stats.revendedorasAtivas.toString(), icon: '✅' },
          { label: 'Vendas do mês', val: stats.vendasMes.toString(), icon: '🛍️' },
          { label: 'Receita do mês', val: formatBRL(stats.receitaMes), icon: '💰' },
          { label: 'Saldo pendente a pagar', val: formatBRL(stats.saldoPendente), icon: '⏳' },
        ].map((m, i) => (
          <div key={i} style={{ background: 'white', padding: 20, borderRadius: 12, border: '1px solid #f0f0f0' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{m.icon}</div>
            <div style={{ fontFamily: 'Montserrat', fontSize: 24, fontWeight: 800, color: '#1A1A1A', marginBottom: 4 }}>
              {m.val}
            </div>
            <div style={{ fontSize: 12, color: '#777' }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Accesos rápidos */}
      <div style={{ fontFamily: 'Montserrat', fontSize: 14, fontWeight: 700, color: '#1A1A1A', marginBottom: 12 }}>
        Gerenciar
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        {[
          { label: 'Revendedoras', href: '/admin/revendedoras', desc: 'Lista completa e filtros' },
          { label: 'Vendas', href: '/admin/vendas', desc: 'Todas as vendas realizadas' },
          { label: 'Saldos', href: '/admin/saldos', desc: 'Pagamentos e comissões' },
          { label: 'Mensalidades', href: '/admin/mensalidades', desc: 'Status de pagamento' },
        ].map((link, i) => (
          <a key={i} href={link.href} style={{ background: 'white', padding: 20, borderRadius: 12, border: '1px solid #f0f0f0', textDecoration: 'none', color: '#1A1A1A', display: 'block', transition: 'border-color .2s' }}>
            <div style={{ fontFamily: 'Montserrat', fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
              {link.label} →
            </div>
            <div style={{ fontSize: 12, color: '#777' }}>{link.desc}</div>
          </a>
        ))}
      </div>
    </div>
  )
}