'use client'
import { useEffect, useState } from 'react'
import { type Revendedora } from '@/lib/supabase'

export default function AdminRevendedorasPage() {
  const [revendedoras, setRevendedoras] = useState<Revendedora[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState<'todas' | 'ativa' | 'pendente' | 'suspensa'>('todas')

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/revendedoras')
        if (!res.ok) {
          setRevendedoras([])
          setLoading(false)
          return
        }
        const data = await res.json()
        setRevendedoras(data || [])
      } catch (e) {
        console.error('Erro ao carregar revendedoras:', e)
        setRevendedoras([])
      }
      setLoading(false)
    }
    load()
  }, [])

  function formatBRL(val: number) {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  function formatData(data: string) {
    return new Date(data).toLocaleDateString('pt-BR')
  }

  const filtradas = revendedoras.filter(r => {
    const matchBusca =
      busca === '' ||
      r.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      r.email?.toLowerCase().includes(busca.toLowerCase()) ||
      r.nome_loja?.toLowerCase().includes(busca.toLowerCase()) ||
      r.whatsapp?.includes(busca)
    const matchStatus = filtroStatus === 'todas' || r.status === filtroStatus
    return matchBusca && matchStatus
  })

  function statusBadge(status: string) {
    const cores: Record<string, { bg: string; color: string }> = {
      ativa: { bg: '#ECFDF5', color: '#059669' },
      pendente: { bg: '#FFFBEB', color: '#D97706' },
      suspensa: { bg: '#FEE2E2', color: '#DC2626' },
    }
    const c = cores[status] || cores.pendente
    return (
      <span style={{ background: c.bg, color: c.color, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .3, whiteSpace: 'nowrap' }}>
        {status}
      </span>
    )
  }

  return (
    <div className="rv-wrap">
      <header className="rv-top">
        <a href="/admin" className="rv-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Voltar ao backoffice
        </a>
      </header>

      <div className="rv-hero">
        <div>
          <div className="rv-eyebrow">Gestão</div>
          <div className="rv-title">Revendedoras</div>
          <div className="rv-sub">{revendedoras.length} cadastradas · {filtradas.length} exibindo</div>
        </div>
      </div>

      <div className="rv-filters">
        <div className="rv-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            placeholder="Buscar por nome, email, loja ou whatsapp..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>
        <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value as any)} className="rv-select">
          <option value="todas">Todos os status</option>
          <option value="ativa">Ativas</option>
          <option value="pendente">Pendentes</option>
          <option value="suspensa">Suspensas</option>
        </select>
      </div>

      {loading ? (
        <div className="rv-state">Carregando...</div>
      ) : filtradas.length === 0 ? (
        <div className="rv-state">Nenhuma revendedora encontrada</div>
      ) : (
        <>
          <div className="rv-table-wrap">
            <table className="rv-table">
              <thead>
                <tr>
                  <th>Nome / Loja</th>
                  <th>Contato</th>
                  <th>Localização</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Vendas</th>
                  <th>Saldo</th>
                  <th>Cadastro</th>
                </tr>
              </thead>
              <tbody>
                {filtradas.map(r => (
                  <tr key={r.id}>
                    <td>
                      <div className="rv-name">{r.nome}</div>
                      <div className="rv-loja">
                        {r.nome_loja || <span className="rv-loja-empty">sem nome de loja</span>}
                      </div>
                      <div className="rv-email">{r.email}</div>
                    </td>
                    <td>{r.whatsapp || '—'}</td>
                    <td>{r.cidade ? `${r.cidade}, ${r.estado}` : '—'}</td>
                    <td>{statusBadge(r.status)}</td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{r.total_vendas || 0}</td>
                    <td className="rv-saldo">{formatBRL(r.saldo_disponivel || 0)}</td>
                    <td className="rv-data">{formatData(r.criado_em)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rv-cards">
            {filtradas.map(r => (
              <div key={r.id} className="rv-card">
                <div className="rv-card-head">
                  <div>
                    <div className="rv-name">{r.nome}</div>
                    <div className="rv-loja">
                      {r.nome_loja || <span className="rv-loja-empty">sem nome de loja</span>}
                    </div>
                  </div>
                  {statusBadge(r.status)}
                </div>
                <div className="rv-card-info">
                  <div>{r.email}</div>
                  {r.whatsapp && <div>{r.whatsapp}</div>}
                  {r.cidade && <div>{r.cidade}, {r.estado}</div>}
                </div>
                <div className="rv-card-stats">
                  <div>
                    <div className="rv-stat-label">Vendas</div>
                    <div className="rv-stat-val">{r.total_vendas || 0}</div>
                  </div>
                  <div>
                    <div className="rv-stat-label">Saldo</div>
                    <div className="rv-stat-val rv-saldo">{formatBRL(r.saldo_disponivel || 0)}</div>
                  </div>
                  <div>
                    <div className="rv-stat-label">Cadastro</div>
                    <div className="rv-stat-val rv-data">{formatData(r.criado_em)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <style jsx>{`
        .rv-wrap {
          width: 100%;
          max-width: 100%;
          min-height: 100vh;
          padding: 40px 56px 56px;
          box-sizing: border-box;
          background: #FAFAFA;
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', system-ui, sans-serif;
        }
        .rv-top {
          margin-bottom: 24px;
        }
        .rv-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #64748B;
          text-decoration: none;
          padding: 6px 10px;
          border-radius: 6px;
          transition: all .15s;
        }
        .rv-back:hover {
          background: #F5F5F5;
          color: #1A1A1A;
        }
        .rv-hero {
          margin-bottom: 32px;
        }
        .rv-eyebrow {
          font-size: 11px;
          font-weight: 600;
          color: #E8396A;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 10px;
        }
        .rv-title {
          font-size: 32px;
          font-weight: 700;
          color: #1A1A1A;
          letter-spacing: -.5px;
          margin-bottom: 6px;
        }
        .rv-sub {
          font-size: 14px;
          color: #64748B;
        }
        .rv-filters {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }
        .rv-search {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;
          background: white;
          border: 1px solid #EFEFEF;
          border-radius: 10px;
          padding: 0 14px;
          transition: border-color .15s;
        }
        .rv-search:focus-within {
          border-color: #1A1A1A;
        }
        .rv-search :global(svg) {
          color: #94A3B8;
          flex-shrink: 0;
        }
        .rv-search :global(input) {
          flex: 1;
          border: none;
          outline: none;
          font-size: 14px;
          padding: 12px 0;
          background: transparent;
        }
        .rv-select {
          padding: 12px 14px;
          background: white;
          border: 1px solid #EFEFEF;
          border-radius: 10px;
          font-size: 14px;
          cursor: pointer;
          min-width: 180px;
          outline: none;
        }
        .rv-state {
          background: white;
          border: 1px solid #EFEFEF;
          border-radius: 12px;
          padding: 60px 20px;
          text-align: center;
          color: #94A3B8;
          font-size: 14px;
        }
        .rv-table-wrap {
          background: white;
          border: 1px solid #EFEFEF;
          border-radius: 12px;
          overflow: hidden;
        }
        .rv-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        .rv-table :global(th) {
          padding: 14px 16px;
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: .5px;
          background: #FAFAFA;
          border-bottom: 1px solid #EFEFEF;
        }
        .rv-table :global(td) {
          padding: 16px;
          border-bottom: 1px solid #F5F5F5;
          color: #1A1A1A;
        }
        .rv-table :global(tr:last-child td) {
          border-bottom: none;
        }
        .rv-table :global(tr:hover td) {
          background: #FAFAFA;
        }
        .rv-name {
          font-weight: 600;
          color: #1A1A1A;
          margin-bottom: 2px;
        }
        .rv-loja {
          font-size: 12px;
          color: #E8396A;
          font-weight: 500;
          margin-bottom: 2px;
        }
        .rv-loja-empty {
          color: #CBD5E1;
          font-style: italic;
          font-weight: 400;
        }
        .rv-email {
          font-size: 11px;
          color: #94A3B8;
        }
        .rv-saldo {
          font-weight: 600;
          color: #059669;
        }
        .rv-data {
          font-size: 12px;
          color: #94A3B8;
        }

        .rv-cards {
          display: none;
        }

        @media (max-width: 900px) {
          .rv-wrap {
            padding: 24px 20px;
          }
          .rv-filters {
            flex-direction: column;
          }
          .rv-select {
            width: 100%;
          }
          .rv-table-wrap {
            display: none;
          }
          .rv-cards {
            display: grid;
            gap: 12px;
          }
          .rv-card {
            background: white;
            border: 1px solid #EFEFEF;
            border-radius: 12px;
            padding: 16px;
          }
          .rv-card-head {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 10px;
            margin-bottom: 12px;
          }
          .rv-card-info {
            font-size: 12px;
            color: #64748B;
            line-height: 1.7;
            margin-bottom: 12px;
            padding-bottom: 12px;
            border-bottom: 1px solid #F5F5F5;
          }
          .rv-card-stats {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 12px;
          }
          .rv-stat-label {
            font-size: 10px;
            color: #94A3B8;
            text-transform: uppercase;
            letter-spacing: .5px;
            font-weight: 600;
            margin-bottom: 4px;
          }
          .rv-stat-val {
            font-size: 14px;
            font-weight: 600;
            color: #1A1A1A;
          }
          .rv-title {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  )
}