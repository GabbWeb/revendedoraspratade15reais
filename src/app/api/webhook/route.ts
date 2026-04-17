import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Cliente admin (bypassa RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const COMISSAO = parseFloat(process.env.NEXT_PUBLIC_COMISSAO_PERCENT || '30') / 100

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Evento da Nuvemshop: pedido pago
    if (body.event !== 'order/paid') {
      return NextResponse.json({ ok: true, msg: 'evento ignorado' })
    }

    const pedido = body.payload
    const ref = pedido.customer?.note || '' // O ?ref= vem como observação do cliente

    if (!ref) {
      return NextResponse.json({ ok: true, msg: 'sem ref' })
    }

    // Busca revendedora pelo subdomínio
    const { data: revendedora } = await supabase
      .from('revendedoras')
      .select('id, saldo_processando')
      .eq('subdominio', ref)
      .eq('status', 'ativa')
      .single()

    if (!revendedora) {
      return NextResponse.json({ ok: true, msg: 'revendedora não encontrada' })
    }

    const valorTotal = parseFloat(pedido.total)
    const valorComissao = Math.round(valorTotal * COMISSAO * 100) / 100
    const produto = pedido.products?.[0]

    // Registra a venda
    const { data: venda } = await supabase.from('vendas').insert({
      revendedora_id: revendedora.id,
      pedido_id: pedido.number.toString(),
      cliente_nome: `${pedido.customer.name} ${pedido.customer.lastName}`,
      cliente_email: pedido.customer.email,
      produto_nome: produto?.name || 'Produto Prata 15',
      produto_foto: produto?.image?.src || null,
      valor_total: valorTotal,
      valor_comissao: valorComissao,
      status: 'processando',
    }).select().single()

    // Adiciona ao saldo processando
    await supabase
      .from('revendedoras')
      .update({ saldo_processando: revendedora.saldo_processando + valorComissao })
      .eq('id', revendedora.id)

    // Cria notificação
    await supabase.from('notificacoes').insert({
      revendedora_id: revendedora.id,
      titulo: '🎉 Nova venda!',
      mensagem: `${produto?.name || 'Produto'} vendido! R$${valorComissao} processando.`,
      tipo: 'venda',
    })

    // Após 2 dias úteis, confirma automaticamente (simplificado)
    // Em produção: usar um cron job ou webhook de confirmação de entrega

    return NextResponse.json({ ok: true, venda_id: venda?.id })

  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'erro interno' }, { status: 500 })
  }
}
