'use client'
import { useState } from 'react'

export default function TesteSGPage() {
  const [token, setToken] = useState<string>('')
  const [resultado, setResultado] = useState<any>(null)
  const [erro, setErro] = useState<string>('')
  const [loading, setLoading] = useState(false)

  async function autenticar() {
    setLoading(true)
    setErro('')
    setResultado(null)

    try {
      const res = await fetch('/api/sg/autenticar', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) {
        setErro(JSON.stringify(data, null, 2))
      } else {
        setToken(data.token || '')
        setResultado(data)
      }
    } catch (e: any) {
      setErro(e.message)
    }
    setLoading(false)
  }

  async function buscarProdutos() {
    setLoading(true)
    setErro('')
    setResultado(null)

    try {
      const res = await fetch('/api/sg/produtos?limit=3')
      const data = await res.json()

      if (!res.ok) {
        setErro(JSON.stringify(data, null, 2))
      } else {
        setResultado(data)
      }
    } catch (e: any) {
      setErro(e.message)
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: 40, maxWidth: 1200, margin: '0 auto', fontFamily: '-apple-system, sans-serif' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Teste API SG Cloud</h1>
      <p style={{ color: '#64748B', marginBottom: 24 }}>Ambiente: Homologação</p>

      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        <button
          onClick={autenticar}
          disabled={loading}
          style={{ padding: '12px 20px', background: '#1A1A1A', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          {loading ? 'Testando...' : '1. Autenticar'}
        </button>
        <button
          onClick={buscarProdutos}
          disabled={loading}
          style={{ padding: '12px 20px', background: '#E8396A', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          {loading ? 'Buscando...' : '2. Buscar 3 produtos'}
        </button>
      </div>

      {erro && (
        <div style={{ padding: 16, background: '#FEE2E2', color: '#991B1B', borderRadius: 10, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Erro:</div>
          <pre style={{ fontSize: 12, overflow: 'auto', whiteSpace: 'pre-wrap' }}>{erro}</pre>
        </div>
      )}

      {resultado && (
        <div style={{ padding: 16, background: '#ECFDF5', color: '#064E3B', borderRadius: 10 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Resposta da API:</div>
          <pre style={{ fontSize: 12, overflow: 'auto', whiteSpace: 'pre-wrap', background: 'white', padding: 12, borderRadius: 6 }}>
            {JSON.stringify(resultado, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}