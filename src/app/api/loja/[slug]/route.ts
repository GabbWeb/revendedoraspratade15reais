import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase
    .from('revendedoras')
    .select('id, nome, nome_loja, whatsapp, cidade, estado, foto_url, bio, status, subdominio')
    .eq('subdominio', params.slug)
    .single()

  if (error || !data) {
    return NextResponse.json({ erro: 'Revendedora não encontrada' }, { status: 404 })
  }

  if (data.status !== 'ativa') {
    return NextResponse.json({ erro: 'Loja inativa' }, { status: 403 })
  }

  return NextResponse.json(data)
}