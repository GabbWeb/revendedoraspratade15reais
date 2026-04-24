'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

const LINK_PAGAMENTO = 'https://pag.ae/81JjyJNps'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [cadastroOk, setCadastroOk] = useState(false)

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

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.senha,
    })

    if (authError || !authData.user) {
      setErro('Erro ao criar conta. Este e-mail já pode estar cadastrado.')
      setLoading(false)
      return
    }

    const subdominio = form.nome
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 20)

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

    setCadastroOk(true)
    setLoading(false)
  }

  // TELA DE PAGAMENTO (após cadastro exitoso)
  if (cadastroOk) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--rosa-pale)', padding: '40px 20px' }}>
        <div className="card fade-up" style={{ maxWidth: 420, margin: '0 auto', padding: '32px 24px', textAlign: 'center' }}>
          
          <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
          
          <div style={{ fontFamily: 'Montserrat', fontSize: 22, fontWeight: 900, color: 'var(--texto)', marginBottom: 8 }}>
            Conta criada, {form.nome.split(' ')[0]}!
          </div>
          
          <div style={{ fontSize: 14, color: 'var(--cinza)', marginBottom: 24, lineHeight: 1.5 }}>
            Só falta um passo para ativar sua loja 💎
          </div>

          <div style={{ background: 'var(--rosa-pale)', border: '2px dashed var(--rosa-border)', borderRadius: 14, padding: '20px 16px', marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: 'var(--rosa)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
              Taxa de ativação
            </div>
            <div style={{ fontFamily: 'Montserrat', fontSize: 36, fontWeight: 900, color: 'var(--rosa)', lineHeight: 1, marginBottom: 4 }}>
              R$ 39,90
            </div>
            <div style={{ fontSize: 12, color: 'var(--cinza)' }}>
              Pagamento único pela plataforma
            </div>
          </div>

          <div style={{ textAlign: 'left', background: 'white', border: '1px solid var(--cinza-light)', borderRadius: 12, padding: 16, marginBottom: 20, fontSize: 13, color: 'var(--texto)', lineHeight: 1.6 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Como funciona:</div>
            <div>1️⃣ Clica no botão abaixo e paga via PagBank</div>
            <div>2️⃣ Aceita PIX, boleto e cartão (até 12x)</div>
            <div>3️⃣ Em até 24h ativamos sua conta</div>
            <div>4️⃣ Você recebe notificação e pode começar a vender ✨</div>
          </div>

          <a 
            href={LINK_PAGAMENTO} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ display: 'block', background: 'var(--rosa)', color: 'white', fontFamily: 'Montserrat', fontWeight: 800, fontSize: 15, padding: 16, borderRadius: 14, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: .3, marginBottom: 12 }}
          >
            💳 Pagar agora via PagBank
          </a>

          <button 
            onClick={() => router.push('/auth/login')}
            style={{ width: '100%', background: 'none', border: 'none', color: 'var(--cinza)', fontSize: 13, cursor: 'pointer', padding: 10 }}
          >
            Já paguei, ir para login →
          </button>

          <div style={{ marginTop: 16, fontSize: 11, color: 'var(--cinza)', lineHeight: 1.5 }}>
            Ao pagar você confirma sua conta e concorda com os termos de uso da plataforma OceanIt.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--rosa-pale)' }}>

      <div style={{ background: 'white', borderBottom: '1px solid var(--rosa-border)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'Montserrat', fontSize: 16, fontWeight: 900, color: 'var(--texto)' }}>
          Prata <span style={{ color: 'var(--rosa)' }}>15</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--cinza)' }}>
          Passo {step} de 2
        </div>
      </div>

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
                <div style={{ background: 'var(--teal-pale)', border: '1px solid var(--teal-border)', borderRadius: 12, padding: '12px 16px', marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: 'var(--teal-dark)', fontWeight: 600, marginBottom: 3 }}>Seu link da loja será:</div>
                  <div style={{ fontFamily: 'Montserrat', fontSize: 14, fontWeight: 800, color: 'var(--teal-dark)' }}>
                    {form.nome.toLowerCase().replace(/\s+/g, '').slice(0, 15)}.lojadeprata925.com.br
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