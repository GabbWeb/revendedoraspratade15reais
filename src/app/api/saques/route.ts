import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { revendedoraId, valor, chavePix } = await req.json()

    // Busca dados da revendedora
    const { data: rev } = await supabase
      .from('revendedoras')
      .select('nome, email, asaas_customer_id, saldo_disponivel')
      .eq('id', revendedoraId)
      .single()

    if (!rev) return NextResponse.json({ error: 'Revendedora não encontrada' }, { status: 404 })
    if (rev.saldo_disponivel < valor) return NextResponse.json({ error: 'Saldo insuficiente' }, { status: 400 })

    const asaasKey = process.env.ASAAS_API_KEY
    const asaasUrl = process.env.ASAAS_BASE_URL

    // 1. Cria ou recupera cliente no Asaas
    let customerId = rev.asaas_customer_id
    if (!customerId) {
      const res = await fetch(`${asaasUrl}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'access_token': asaasKey! },
        body: JSON.stringify({ name: rev.nome, email: rev.email }),
      })
      const customer = await res.json()
      customerId = customer.id

      await supabase.from('revendedoras').update({ asaas_customer_id: customerId }).eq('id', revendedoraId)
    }

    // 2. Cria transferência Pix no Asaas
    const transferRes = await fetch(`${asaasUrl}/transfers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'access_token': asaasKey! },
      body: JSON.stringify({
        value: valor,
        pixAddressKey: chavePix,
        pixAddressKeyType: 'CPF', // auto-detectar em produção
        description: `Comissão Prata 15 — ${rev.nome}`,
      }),
    })

    const transfer = await transferRes.json()

    if (transfer.errors) {
      return NextResponse.json({ error: transfer.errors[0]?.description }, { status: 400 })
    }

    // 3. Atualiza saldo
    await supabase
      .from('revendedoras')
      .update({ saldo_disponivel: rev.saldo_disponivel - valor })
      .eq('id', revendedoraId)

    // 4. Atualiza saque com ID da transferência
    await supabase
      .from('saques')
      .update({ asaas_transfer_id: transfer.id, status: 'processando' })
      .eq('revendedora_id', revendedoraId)
      .eq('status', 'solicitado')
      .order('criado_em', { ascending: false })
      .limit(1)

    // 5. Notificação
    await supabase.from('notificacoes').insert({
      revendedora_id: revendedoraId,
      titulo: '💸 Saque solicitado!',
      mensagem: `Seu Pix de R$${valor} está a caminho. Você recebe em minutos.`,
      tipo: 'saque',
    })

    return NextResponse.json({ ok: true, transfer_id: transfer.id })

  } catch (err) {
    console.error('Saque error:', err)
    return NextResponse.json({ error: 'erro interno' }, { status: 500 })
  }
}
