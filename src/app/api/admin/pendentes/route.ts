import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase
    .from('revendedoras')
    .select('id, nome, email, whatsapp, cidade, estado, criado_em')
    .eq('status', 'pendente')
    .order('criado_em', { ascending: false })

  if (error) {
    return NextResponse.json({ erro: 'Erro ao buscar pendentes', detalhes: error.message }, { status: 500 })
  }

  return NextResponse.json(data || [])
}