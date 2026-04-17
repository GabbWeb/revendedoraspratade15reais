'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setLoading(true)

    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password: senha 
    })

    if (error || !data.user) {
      setErro('E-mail ou senha incorretos.')
      setLoading(false)
      return
    }

    // Verifica se tem perfil, se não, cria um básico
    const { data: rev } = await supabase
      .from('revendedoras')
      .select('id')
      .eq('email', email)
      .single()

    if (!rev) {
      // Cria perfil básico se não existe
      await supabase.from('revendedoras').insert({
        user_id: data.user.id,
        nome: email.split('@')[0],
        email: email,
        whatsapp: '',
        subdominio: email.split('@')[0].replace(/[^a-z0-9]/gi, '').toLowerCase() + Date.now().toString().slice(-4),
        status: 'pendente',
      })
    } else {
      // Atualiza user_id se necessário
      await supabase
        .from('revendedoras')
        .update({ user_id: data.user.id })
        .eq('email', email)
    }

    router.push('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFF0F4', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: 'white', borderBottom: '1px solid #F4C0D1', padding: '16px 20px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Montserrat', fontSize: 18, fontWeight: 900, color: '#1A1A1A' }}>
          Prata <span style={{ color: '#E8396A' }}>15</span>
        </div>
        <div style={{ fontSize: 11, color: '#777', letterSpacing: 1.5, textTransform: 'uppercase' }}>
          Portal da Revendedora
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#E8396A', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div style={{ fontFamily: 'Montserrat', fontSize: 20, fontWeight: 900, color: '#1A1A1A', marginBottom: 4 }}>
            Bem-vinda de volta!
          </div>
          <div style={{ fontSize: 13, color: '#777' }}>
            Entre para acessar sua loja e comissões
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: 20, padding: '24px 20px', border: '1px solid #EDEBE7' }}>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1A1A1A', marginBottom: 7, textTransform: 'uppercase', letterSpacing: .3 }}>E-mail</label>
              <input className="input-padrao" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required/>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1A1A1A', marginBottom: 7, textTransform: 'uppercase', letterSpacing: .3 }}>Senha</label>
              <input className="input-padrao" type="password" placeholder="Sua senha" value={senha} onChange={e => setSenha(e.target.value)} required/>
            </div>

            {erro && (
              <div style={{ background: '#FDE8EE', border: '1px solid #F4C0D1', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#E8396A' }}>
                {erro}
              </div>
            )}

            <button className="btn-rosa" type="submit" disabled={loading}>
              {loading ? 'Entrando...' : '🔑 Entrar na minha conta'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Link href="/auth/register" style={{ fontSize: 13, color: '#089C82', fontWeight: 600, textDecoration: 'none' }}>
              Ainda não é revendedora? Cadastre-se →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}