import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { revendedora_id, nome } = await req.json()

  // Cliente con service role (bypassa RLS)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 1. Atualiza status
  const { error: errStatus } = await supabase
    .from('revendedoras')
    .update({ status: 'ativa' })
    .eq('id', revendedora_id)

  if (errStatus) {
    return NextResponse.json({ error: 'Erro ao ativar status' }, { status: 500 })
  }

  // 2. Cria notificação
  const { error: errNotif } = await supabase
    .from('notificacoes')
    .insert({
      revendedora_id,
      titulo: '🎉 Sua conta foi ativada!',
      mensagem: 'Parabéns! Agora você pode começar a vender. Acesse sua loja e compartilhe o link com suas clientes.',
      tipo: 'sucesso',
      lida: false,
    })

  if (errNotif) {
    return NextResponse.json({ error: 'Erro ao criar notificação' }, { status: 500 })
  }

  return NextResponse.json({ sucesso: true, nome })
}