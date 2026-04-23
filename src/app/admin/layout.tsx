'use client'
import { useState, useEffect } from 'react'

const ADMIN_PASSWORD = 'prata925'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [autorizado, setAutorizado] = useState(false)
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState(false)
  const [carregou, setCarregou] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('admin_auth')
      if (saved === ADMIN_PASSWORD) {
        setAutorizado(true)
      }
      setCarregou(true)
    }
  }, [])

  function entrar(e: React.FormEvent) {
    e.preventDefault()
    if (senha === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', senha)
      setAutorizado(true)
      setErro(false)
    } else {
      setErro(true)
    }
  }

  if (!carregou) return null

  if (!autorizado) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF0F4', padding: 20 }}>
        <form onSubmit={entrar} style={{ background: 'white', padding: 40, borderRadius: 16, maxWidth: 400, width: '100%', boxShadow: '0 4px 20px rgba(232,57,106,.1)' }}>
          <div style={{ fontFamily: 'Montserrat', fontSize: 12, fontWeight: 700, color: '#E8396A', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8, textAlign: 'center' }}>
            Backoffice
          </div>
          <div style={{ fontFamily: 'Montserrat', fontSize: 22, fontWeight: 900, color: '#1A1A1A', marginBottom: 24, textAlign: 'center' }}>
            Prata de 15 Reais
          </div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 8, textTransform: 'uppercase', letterSpacing: .5 }}>
            Senha de administrador
          </label>
          <input
            type="password"
            value={senha}
            onChange={e => { setSenha(e.target.value); setErro(false) }}
            autoFocus
            style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: erro ? '1px solid #DC2626' : '1px solid #e0e0e0', fontSize: 14, outline: 'none', marginBottom: 12, boxSizing: 'border-box' }}
          />
          {erro && (
            <div style={{ fontSize: 12, color: '#DC2626', marginBottom: 12 }}>
              Senha incorreta
            </div>
          )}
          <button type="submit" style={{ width: '100%', padding: 14, background: '#E8396A', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, fontFamily: 'Montserrat', cursor: 'pointer' }}>
            Entrar no backoffice
          </button>
        </form>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {children}
    </div>
  )
}