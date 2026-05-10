import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Counts de revendedoras
  const { count: total } = await supabase
    .from('revendedoras')
    .select('*', { count: 'exact', head: true })

  const { count: ativas } = await supabase
    .from('revendedoras')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'ativa')

  const { count: pendentes } = await supabase
    .from('revendedoras')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pendente')

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

  // Saldo pendente total
  const { data: saldos } = await supabase
    .from('revendedoras')
    .select('saldo_disponivel')

  const saldoPendente = saldos?.reduce((acc, r) => acc + Number(r.saldo_disponivel || 0), 0) || 0

  return NextResponse.json({
    totalRevendedoras: total || 0,
    revendedorasAtivas: ativas || 0,
    revendedorasPendentes: pendentes || 0,
    vendasMes: vendasMes?.length || 0,
    receitaMes: receita,
    saldoPendente,
  })
}