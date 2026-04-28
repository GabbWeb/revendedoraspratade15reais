import { NextResponse } from 'next/server'

const SG_BASE_URL = 'http://sgps.sgsistemas.com.br:8201/integracao/sgsistemas/v1'

export async function POST() {
  const usuario = process.env.SG_USUARIO
  const senha = process.env.SG_SENHA

  if (!usuario || !senha) {
    return NextResponse.json(
      { erro: 'Credenciais SG não configuradas no .env.local (SG_USUARIO e SG_SENHA)' },
      { status: 500 }
    )
  }

  try {
    const res = await fetch(`${SG_BASE_URL}/autorizacao`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, senha }),
    })

    const text = await res.text()

    let data
    try {
      data = JSON.parse(text)
    } catch {
      return NextResponse.json(
        { erro: 'SG retornou resposta não-JSON', status: res.status, resposta: text.slice(0, 500) },
        { status: 500 }
      )
    }

    if (!res.ok) {
      return NextResponse.json(
        { erro: 'Falha na autenticação SG', status: res.status, detalhes: data },
        { status: res.status }
      )
    }

    return NextResponse.json({ sucesso: true, ...data })
  } catch (e: any) {
    return NextResponse.json(
      { erro: 'Erro de conexão com SG', mensagem: e.message },
      { status: 500 }
    )
  }
}