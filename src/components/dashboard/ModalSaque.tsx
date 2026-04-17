'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'

interface Props {
  saldoDisponivel: number
  revendedoraId: string
  onClose: () => void
  onSucesso: () => void
}

export default function ModalSaque({ saldoDisponivel, revendedoraId, onClose, onSucesso }: Props) {
  const [tipo, setTipo] = useState<'pix' | 'credito_loja'>('pix')
  const [valor, setValor] = useState(saldoDisponivel.toFixed(2))
  const [chavePix, setChavePix] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  async function handleSaque(e: React.FormEvent) {
    e.preventDefault()
    setErro('')

    const valorNum = parseFloat(valor)
    if (valorNum <= 0 || valorNum > saldoDisponivel) {
      setErro('Valor inválido ou maior que o saldo disponível.')
      return
    }
    if (tipo === 'pix' && !chavePix) {
      setErro('Informe sua chave Pix para sacar.')
      return
    }

    setLoading(true)
    const supabase = createClient()

    // 1. Cria o saque no banco
    const { error } = await supabase.from('saques').insert({
      revendedora_id: revendedoraId,
      tipo,
      valor: valorNum,
      chave_pix: tipo === 'pix' ? chavePix : null,
      status: 'solicitado',
    })

    if (error) {
      setErro('Erro ao solicitar saque. Tente novamente.')
      setLoading(false)
      return
    }

    // 2. Debita do saldo
    await supabase.rpc('debitar_saldo', {
      p_revendedora_id: revendedoraId,
      p_valor: valorNum,
    })

    // 3. Chama API para processar via Asaas (se Pix)
    if (tipo === 'pix') {
      await fetch('/api/saques', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revendedoraId, valor: valorNum, chavePix }),
      })
    }

    onSucesso()
  }

  const formatBRL = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(232,57,106,.15)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: 'white', borderRadius: '24px 24px 0 0', padding: '24px 20px 40px', width: '100%', maxWidth: 430, borderTop: '2px solid var(--rosa-border)' }}>

        <div style={{ width: 40, height: 4, background: 'var(--cinza-light)', borderRadius: 2, margin: '0 auto 20px' }}/>

        <div style={{ fontFamily: 'Montserrat', fontSize: 18, fontWeight: 900, color: 'var(--texto)', marginBottom: 4 }}>
          Solicitar saque
        </div>
        <div style={{ fontSize: 13, color: 'var(--cinza)', marginBottom: 20 }}>
          Escolha como quer receber
        </div>

        {/* Saldo disponível */}
        <div style={{ background: 'var(--teal-pale)', border: '1px solid var(--teal-border)', borderRadius: 14, padding: '14px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 12, color: 'var(--teal-dark)', fontWeight: 500 }}>Disponível para saque</div>
          <div style={{ fontFamily: 'Montserrat', fontSize: 22, fontWeight: 900, color: 'var(--teal-dark)' }}>{formatBRL(saldoDisponivel)}</div>
        </div>

        <form onSubmit={handleSaque}>

          {/* Opções */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            {[
              { key: 'pix', icon: '⚡', titulo: 'Pix', sub: 'Recebe em minutos' },
              { key: 'credito_loja', icon: '🛍️', titulo: 'Crédito', sub: 'Usar na loja' },
            ].map(op => (
              <div
                key={op.key}
                onClick={() => setTipo(op.key as any)}
                style={{ border: `2px solid ${tipo === op.key ? 'var(--rosa)' : 'var(--cinza-light)'}`, background: tipo === op.key ? 'var(--rosa-mist)' : 'white', borderRadius: 14, padding: '16px 12px', textAlign: 'center', cursor: 'pointer', transition: 'all .2s' }}
              >
                <div style={{ fontSize: 22, marginBottom: 6 }}>{op.icon}</div>
                <div style={{ fontFamily: 'Montserrat', fontSize: 13, fontWeight: 700, color: 'var(--texto)', marginBottom: 2 }}>{op.titulo}</div>
                <div style={{ fontSize: 10, color: 'var(--cinza)' }}>{op.sub}</div>
              </div>
            ))}
          </div>

          {/* Valor */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--texto)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: .3 }}>
              Valor a sacar
            </label>
            <input
              className="input-padrao"
              type="number"
              step="0.01"
              min="1"
              max={saldoDisponivel}
              value={valor}
              onChange={e => setValor(e.target.value)}
              required
            />
          </div>

          {/* Chave Pix */}
          {tipo === 'pix' && (
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--texto)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: .3 }}>
                Sua chave Pix
              </label>
              <input
                className="input-padrao"
                type="text"
                placeholder="CPF, e-mail ou telefone"
                value={chavePix}
                onChange={e => setChavePix(e.target.value)}
                required={tipo === 'pix'}
              />
            </div>
          )}

          {erro && (
            <div style={{ background: 'var(--rosa-mist)', border: '1px solid var(--rosa-border)', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: 'var(--rosa)' }}>
              {erro}
            </div>
          )}

          <button className="btn-rosa" type="submit" disabled={loading}>
            {loading ? 'Solicitando...' : '✅ Solicitar saque agora'}
          </button>
          <button type="button" onClick={onClose} style={{ width: '100%', background: 'none', border: 'none', color: 'var(--cinza)', fontSize: 13, cursor: 'pointer', padding: 12, marginTop: 4 }}>
            Cancelar
          </button>

        </form>
      </div>
    </div>
  )
}
