'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const [form, setForm] = useState({
    nome: '', email: '', whatsapp: '', cidade: '',
    estado: '', bio: '', senha: '', confirmarSenha: ''
  })

  function update(field: string, val: string) {
    setForm(prev => ({ ...prev, [field]: val }))
  }

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault()
    setErro('')

    if (form.senha !== form.confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }
    if (form.senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)
    const supabase = createClient()

    // 1. Cria usuário no Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.senha,
    })

    if (authError || !authData.user) {
      setErro('Erro ao criar conta. Este e-mail já pode estar cadastrado.')
      setLoading(false)
      return
    }

    // 2. Gera subdomínio único
    const subdominio = form.nome
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 20)

    // 3. Cria perfil da revendedora
    const { error: profileError } = await supabase
      .from('revendedoras')
      .insert({
        user_id: authData.user.id,
        nome: form.nome,
        email: form.email,
        whatsapp: form.whatsapp,
        cidade: form.cidade,
        estado: form.estado,
        bio: form.bio,
        subdominio: `${subdominio}-${Date.now().toString().slice(-4)}`,
        status: 'pendente',
      })

    if (profileError) {
      setErro('Erro ao criar perfil. Tente novamente.')
      setLoading(false)
      return
    }

    router.push('/dashboard?novo=true')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--rosa-pale)' }}>

      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--rosa-border)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'Montserrat', fontSize: 16, fontWeight: 900, color: 'var(--texto)' }}>
          Prata <span style={{ color: 'var(--rosa)' }}>15</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--cinza)' }}>
          Passo {step} de 2
        </div>
      </div>

      {/* Progress */}
      <div style={{ height: 4, background: 'var(--rosa-border)' }}>
        <div style={{ height: '100%', background: 'var(--rosa)', width: step === 1 ? '50%' : '100%', transition: 'width .3s' }}/>
      </div>

      <div style={{ padding: '24px 20px' }}>

        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontFamily: 'Montserrat', fontSize: 20, fontWeight: 900, color: 'var(--texto)', marginBottom: 4 }}>
            {step === 1 ? '🎉 Crie sua loja!' : '🔐 Crie sua senha'}
          </div>
          <div style={{ fontSize: 13, color: 'var(--cinza)' }}>
            {step === 1 ? 'Preencha seus dados para começar' : 'Quase pronto — defina sua senha de acesso'}
          </div>
        </div>

        <div className="card fade-up" style={{ padding: '22px 20px' }}>
          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2) } : handleCadastro}>

            {step === 1 && (
              <>
                {[
                  { label: 'Nome completo', field: 'nome', type: 'text', placeholder: 'Seu nome completo' },
                  { label: 'E-mail', field: 'email', type: 'email', placeholder: 'seu@email.com' },
                  { label: 'WhatsApp', field: 'whatsapp', type: 'tel', placeholder: '(11) 99999-9999' },
                  { label: 'Cidade', field: 'cidade', type: 'text', placeholder: 'São Paulo' },
                  { label: 'Estado', field: 'estado', type: 'text', placeholder: 'SP' },
                ].map(f => (
                  <div key={f.field} style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--texto)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: .3 }}>
                      {f.label}
                    </label>
                    <input
                      className="input-padrao"
                      type={f.type}
                      placeholder={f.placeholder}
                      value={(form as any)[f.field]}
                      onChange={e => update(f.field, e.target.value)}
                      required
                    />
                  </div>
                ))}

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--texto)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: .3 }}>
                    Bio (opcional)
                  </label>
                  <textarea
                    className="input-padrao"
                    placeholder="Conte um pouco sobre você para suas clientes..."
                    value={form.bio}
                    onChange={e => update('bio', e.target.value)}
                    rows={3}
                    style={{ resize: 'none' }}
                  />
                </div>

                <button className="btn-teal" type="submit">
                  Continuar →
                </button>
              </>
            )}

            {step === 2 && (
              <>
                {/* Preview do link */}
                <div style={{ background: 'var(--teal-pale)', border: '1px solid var(--teal-border)', borderRadius: 12, padding: '12px 16px', marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: 'var(--teal-dark)', fontWeight: 600, marginBottom: 3 }}>Seu link da loja será:</div>
                  <div style={{ fontFamily: 'Montserrat', fontSize: 14, fontWeight: 800, color: 'var(--teal-dark)' }}>
                    {form.nome.toLowerCase().replace(/\s+/g, '').slice(0, 15)}.prata15.com.br
                  </div>
                </div>

                {[
                  { label: 'Senha', field: 'senha', placeholder: 'Mínimo 6 caracteres' },
                  { label: 'Confirmar senha', field: 'confirmarSenha', placeholder: 'Repita a senha' },
                ].map(f => (
                  <div key={f.field} style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--texto)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: .3 }}>
                      {f.label}
                    </label>
                    <input
                      className="input-padrao"
                      type="password"
                      placeholder={f.placeholder}
                      value={(form as any)[f.field]}
                      onChange={e => update(f.field, e.target.value)}
                      required
                    />
                  </div>
                ))}

                {erro && (
                  <div style={{ background: 'var(--rosa-mist)', border: '1px solid var(--rosa-border)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: 'var(--rosa)' }}>
                    {erro}
                  </div>
                )}

                <button className="btn-rosa" type="submit" disabled={loading} style={{ marginBottom: 10 }}>
                  {loading ? 'Criando sua loja...' : '🚀 Criar minha loja agora!'}
                </button>

                <button type="button" onClick={() => setStep(1)} style={{ width: '100%', background: 'none', border: 'none', color: 'var(--cinza)', fontSize: 13, cursor: 'pointer', padding: 10 }}>
                  ← Voltar
                </button>
              </>
            )}

          </form>

          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <Link href="/auth/login" style={{ fontSize: 13, color: 'var(--cinza)', textDecoration: 'none' }}>
              Já tem conta? <span style={{ color: 'var(--rosa)', fontWeight: 600 }}>Entrar</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
