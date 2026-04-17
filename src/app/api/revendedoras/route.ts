import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { nome, email, whatsapp, cidade, estado, revende } = await req.json()

    if (!nome || !email || !whatsapp || !cidade) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
    }

    // Verifica se e-mail já existe
    const { data: existe } = await supabase
      .from('revendedoras')
      .select('id')
      .eq('email', email)
      .single()

    if (existe) {
      return NextResponse.json({ error: 'Este e-mail já está cadastrado.' }, { status: 409 })
    }

    // Gera subdomínio único
    const base = nome
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 15)
    const subdominio = `${base}${Date.now().toString().slice(-4)}`

    // Salva lead no banco (status pendente — você aprova manualmente)
    const { data, error } = await supabase.from('revendedoras').insert({
      nome, email, whatsapp,
      cidade: cidade.split(',')[0]?.trim() || cidade,
      estado: cidade.split(',')[1]?.trim() || estado || '',
      subdominio,
      status: 'pendente',
      bio: `Olá! Sou ${nome.split(' ')[0]} e vendo joias de prata 925 com qualidade garantida. Entre em contato!`,
    }).select().single()

    if (error) {
      return NextResponse.json({ error: 'Erro ao salvar cadastro.' }, { status: 500 })
    }

    // Notifica via WhatsApp (opcional — use Twilio ou Z-API em produção)
    // await notificarWhatsApp(whatsapp, nome)

    return NextResponse.json({
      ok: true,
      mensagem: `Cadastro recebido! Entraremos em contato em até 2 dias úteis pelo WhatsApp ${whatsapp}.`,
      id: data.id,
    })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
