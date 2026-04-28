import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { revendedora_id, nome } = await req.json()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 1. Atualiza status (crítico)
  const { error: errStatus } = await supabase
    .from('revendedoras')
    .update({ status: 'ativa' })
    .eq('id', revendedora_id)

  if (errStatus) {
    return NextResponse.json({ error: 'Erro ao ativar status', detalhes: errStatus.message }, { status: 500 })
  }

  // 2. Cria notificação (não-crítico, não bloqueia se falhar)
  try {
    const { error: errNotif } = await supabase
      .from('notificacoes')
      .insert({
        revendedora_id,
        titulo: '🎉 Sua conta foi ativada!',
        mensagem: 'Parabéns! Agora você pode começar a vender.',
        tipo: 'sucesso',
        lida: false,
      })

    if (errNotif) {
      console.error('Aviso: notificação não foi criada:', errNotif.message)
    }
  } catch (e) {
    console.error('Erro silencioso ao criar notificação:', e)
  }

  return NextResponse.json({ sucesso: true, nome })
}