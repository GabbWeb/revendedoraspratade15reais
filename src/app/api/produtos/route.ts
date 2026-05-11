import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { searchParams } = new URL(request.url)
  const categoria = searchParams.get('categoria')
  const busca = searchParams.get('busca')

  let query = supabase
    .from('produtos')
    .select('id, sku, nome, descricao, categoria, preco, preco_promo, fotos, estoque, destaque, lancamento, tamanho, cor')
    .eq('ativo', true)
    .gt('estoque', 0)
    .order('destaque', { ascending: false })
    .order('nome', { ascending: true })

  if (categoria && categoria !== 'Tudo') {
    query = query.eq('categoria', categoria)
  }

  if (busca) {
    query = query.ilike('nome', `%${busca}%`)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ erro: 'Erro ao buscar produtos', detalhes: error.message }, { status: 500 })
  }

  // Buscar todas as categorias para o filtro
  const { data: cats } = await supabase
    .from('produtos')
    .select('categoria')
    .eq('ativo', true)
    .gt('estoque', 0)

  const categorias = Array.from(new Set((cats || []).map(c => c.categoria).filter(Boolean)))

  return NextResponse.json({
    produtos: data || [],
    categorias,
    total: (data || []).length,
  })
}