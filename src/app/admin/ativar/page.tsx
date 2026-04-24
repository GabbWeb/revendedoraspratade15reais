'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

type RevendedoraPendente = {
  id: string
  nome: string
  email: string
  whatsapp: string
  cidade: string
  estado: string
  criado_em: string
}

export default function AdminAtivarPage() {
  const router = useRouter()
  const [pendentes, setPendentes] = useState<RevendedoraPendente[]>([])
  const [loading, setLoading] = useState(true)
  const [ativando, setAtivando] = useState<string | null>(null)
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    carregarPendentes()
  }, [])

  async function carregarPendentes() {
    const supabase = createClient()
    const { data } = await supabase
      .from('revendedoras')
      .select('id, nome, email, whatsapp, cidade, estado, criado_em')
      .eq('status', 'pendente')
      .order('criado_em', { ascending: false })

    setPendentes(data || [])
    setLoading(false)
  }

  async function ativarRevendedora(id: string, nome: string) {
    if (!confirm(`Confirmar ativação de ${nome}?\n\nVerifique se o pagamento de R$ 39,99 foi recebido.`)) return

    setAtivando(id)

    const res = await fetch('/api/admin/ativar-revendedora', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ revendedora_id: id, nome }),
    })

    if (!res.ok) {
      alert('Erro ao ativar. Tenta de novo.')
      setAtivando(null)
      return
    }

    setMensagem(`✅ ${nome} ativada com sucesso!`)
    setTimeout(() => setMensagem(''), 4000)
    setAtivando(null)
    carregarPendentes()
  }

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1100, margin: '0 auto' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <button
          onClick={() => router.push('/admin')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', fontSize: 14, padding: 0 }}
        >
          ← Voltar
        </button>
      </div>

      <h1 style={{ fontFamily: 'Inter', fontSize: 28, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
        Ativar revendedoras
      </h1>
      <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 32 }}>
        Revendedoras pendentes de ativação. Confirme o pagamento antes de ativar.
      </p>

      {mensagem && (
        <div style={{ background: '#D1FAE5', border: '1px solid #10B981', color: '#065F46', padding: '12px 16px', borderRadius: 10, marginBottom: 20, fontSize: 14, fontWeight: 600 }}>
          {mensagem}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#6B7280' }}>Carregando...</div>
      ) : pendentes.length === 0 ? (
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 14, padding: 48, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✨</div>
          <div style={{ fontFamily: 'Inter', fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 4 }}>
            Nenhuma pendente
          </div>
          <div style={{ fontSize: 13, color: '#6B7280' }}>
            Todas as revendedoras estão ativas.
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {pendentes.map(r => (
            <div key={r.id} style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 14, padding: 20, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontSize: 18, fontWeight: 800, color: '#92400E', flexShrink: 0 }}>
                {r.nome[0]?.toUpperCase()}
              </div>

              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontFamily: 'Inter', fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 4 }}>
                  {r.nome}
                </div>
                <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>
                  📧 {r.email}
                </div>
                <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>
                  📱 {r.whatsapp} · 📍 {r.cidade}/{r.estado}
                </div>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
                  Cadastrada em {new Date(r.criado_em).toLocaleDateString('pt-BR')} às {new Date(r.criado_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              <button
                onClick={() => ativarRevendedora(r.id, r.nome)}
                disabled={ativando === r.id}
                style={{
                  background: ativando === r.id ? '#9CA3AF' : '#10B981',
                  color: 'white',
                  border: 'none',
                  borderRadius: 10,
                  padding: '12px 20px',
                  fontFamily: 'Inter',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: ativando === r.id ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {ativando === r.id ? '⏳ Ativando...' : '✓ Ativar conta'}
              </button>
            </div>
          ))}
        </div>
      )}

      {pendentes.length > 0 && (
        <div style={{ marginTop: 24, background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 10, padding: 16, fontSize: 13, color: '#78350F', lineHeight: 1.6 }}>
          ⚠️ <strong>Importante:</strong> Confirme no seu PagBank/banco que o pagamento de R$ 39,99 foi recebido ANTES de ativar. Uma vez ativada, a revendedora pode começar a vender.
        </div>
      )}

    </div>
  )
}