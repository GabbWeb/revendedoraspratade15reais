'use client'
import { useState } from 'react'

export default function LandingPage() {
  const [form, setForm] = useState({ nome: '', whatsapp: '', email: '', cidade: '', revende: '' })
  const [loading, setLoading] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState('')

  function update(f: string, v: string) { setForm(p => ({ ...p, [f]: v })) }

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setLoading(true)

    const res = await fetch('/api/revendedoras', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      setErro(data.error || 'Erro ao enviar. Tente novamente.')
      setLoading(false)
      return
    }

    setSucesso(true)
    setLoading(false)
  }

  // Scroll para formulário
  function scrollForm() {
    document.getElementById('cadastro')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', background: 'white', color: '#1A1A1A', maxWidth: 430, margin: '0 auto', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ══ HERO ══ */}
      <section style={{ background: '#FFF0F4', padding: '36px 20px 0', textAlign: 'center', position: 'relative', overflow: 'hidden', borderBottom: '3px solid #F4C0D1' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle,rgba(232,57,106,.07) 1.5px,transparent 1.5px)', backgroundSize: '22px 22px', pointerEvents: 'none' }}/>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#0BBFA0', borderRadius: 30, padding: '7px 18px', fontFamily: 'Montserrat, sans-serif', fontSize: 11, fontWeight: 800, color: 'white', letterSpacing: .5, textTransform: 'uppercase', marginBottom: 16, position: 'relative' }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'white' }}/>
          Sem estoque · Sem risco · 100% online
        </div>

        <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 30, fontWeight: 900, color: '#1A1A1A', lineHeight: 1.05, letterSpacing: -1, marginBottom: 8, textTransform: 'uppercase', position: 'relative' }}>
          Venda prata 925<br/>
          <span style={{ color: '#E8396A' }}>ganhe 30% em tudo!</span>
        </h1>

        <p style={{ fontSize: 14, color: '#777', lineHeight: 1.7, maxWidth: 340, margin: '0 auto 16px', position: 'relative' }}>
          Você compartilha o link, <strong style={{ color: '#1A1A1A' }}>nós enviamos</strong> direto para sua cliente. Zero estoque, zero risco, <strong style={{ color: '#1A1A1A' }}>100% lucro seu.</strong>
        </p>

        {/* Valor 3M */}
        <div style={{ background: '#E8396A', borderRadius: 16, padding: '16px 18px', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 12, position: 'relative', textAlign: 'left' }}>
          <div style={{ fontSize: 28, flexShrink: 0 }}>🏪</div>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,.7)', marginBottom: 3, fontWeight: 600 }}>Loja avaliada em</div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 22, fontWeight: 900, color: 'white', lineHeight: 1, letterSpacing: -1 }}>R$ 3.000.000</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.7)', marginTop: 3 }}>por apenas <strong style={{ color: '#5DD9C1' }}>R$39,99/mês</strong> — isso é real.</div>
          </div>
        </div>

        {/* Foto hero */}
        <div style={{ position: 'relative' }}>
          <img src="https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&q=80" alt="Joias prata 925" style={{ width: '100%', height: 260, objectFit: 'cover', display: 'block' }}/>
          {/* Badges */}
          {[
            { style: { top: 16, left: 12 }, icon: '🛡️', val: 'Sem estoque', sub: 'você só vende', cor: '#E0FAF5', corTxt: '#089C82' },
            { style: { top: 16, right: 12 }, icon: '💰', val: '30%', sub: 'de comissão', cor: '#FFF0F4', corTxt: '#E8396A' },
            { style: { bottom: 16, left: 12 }, icon: '📦', val: '+3.000 itens', sub: 'no catálogo', cor: '#E1F5EE', corTxt: '#1FAD52' },
            { style: { bottom: 16, right: 12 }, icon: '⭐', val: 'Prata 925', sub: 'certificada', cor: '#FFF0F4', corTxt: '#1A1A1A' },
          ].map((b, i) => (
            <div key={i} style={{ position: 'absolute', ...b.style, background: 'white', borderRadius: 14, padding: '10px 13px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 6px 24px rgba(232,57,106,.18)', border: '1.5px solid #F4C0D1' }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: b.cor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{b.icon}</div>
              <div>
                <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 12, fontWeight: 800, color: b.corTxt, lineHeight: 1 }}>{b.val}</div>
                <div style={{ fontSize: 9.5, color: '#777', fontWeight: 500, lineHeight: 1.2 }}>{b.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <div style={{ background: '#E8396A', padding: 16, display: 'flex', justifyContent: 'space-around' }}>
        {[['30%','comissão/venda'],['R$0','investimento'],['3mil+','itens na loja'],['R$39','por mês']].map(([v,l], i) => (
          <div key={i} style={{ textAlign: 'center', flex: 1, borderRight: i < 3 ? '1px solid rgba(255,255,255,.25)' : 'none' }}>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 18, fontWeight: 900, color: 'white', lineHeight: 1, marginBottom: 3 }}>{v}</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,.75)', lineHeight: 1.3 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* VALOR 3M */}
      <section style={{ background: '#E0FAF5', padding: '36px 20px', textAlign: 'center', borderTop: '2px solid #9FE1CB', borderBottom: '2px solid #9FE1CB' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'white', borderRadius: 30, padding: '5px 14px', fontFamily: 'Montserrat, sans-serif', fontSize: 10, fontWeight: 700, color: '#089C82', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 14, border: '1px solid #9FE1CB' }}>
          🏪 Sua loja virtual
        </div>
        <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 13, fontWeight: 600, color: '#777', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 8 }}>Uma loja avaliada em</div>
        <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 46, fontWeight: 900, color: '#1A1A1A', lineHeight: 1, letterSpacing: -2, marginBottom: 6 }}>
          R$3<span style={{ color: '#089C82' }}> milhões</span>
        </div>
        <div style={{ fontSize: 13, color: '#777', marginBottom: 22, lineHeight: 1.6 }}>
          +3.000 itens de prata 925 · estoque nosso · <strong style={{ color: '#1A1A1A' }}>sua marca</strong>
        </div>

        <div style={{ background: '#E8396A', borderRadius: 16, padding: '18px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.8)', marginBottom: 4 }}>Tudo isso por apenas</div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 32, fontWeight: 900, color: 'white', lineHeight: 1, letterSpacing: -1 }}>
              <sup style={{ fontSize: 14, verticalAlign: 'top', marginTop: 8, display: 'inline-block' }}>R$</sup>39<span style={{ fontSize: 15, letterSpacing: 0, fontWeight: 600 }}>,99/mês</span>
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,.2)', borderRadius: 10, padding: '8px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.8)', lineHeight: 1.5 }}>cancele</div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 13, fontWeight: 800, color: 'white' }}>QUANDO</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.8)', lineHeight: 1.5 }}>quiser</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            ['🏪','Loja +3.000 itens'],['📦','Nós enviamos tudo'],
            ['💰','30% de comissão'],['🎯','Suporte + bônus'],
          ].map(([ic, tx], i) => (
            <div key={i} style={{ background: 'white', border: '1px solid #9FE1CB', borderRadius: 12, padding: '12px', display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left' }}>
              <span style={{ fontSize: 18 }}>{ic}</span>
              <span style={{ fontSize: 12, color: '#1A1A1A', fontWeight: 500, lineHeight: 1.3 }}>{tx}</span>
            </div>
          ))}
        </div>

        <button onClick={scrollForm} style={{ display: 'block', width: '100%', background: '#0BBFA0', color: 'white', fontFamily: 'Montserrat, sans-serif', fontSize: 16, fontWeight: 800, padding: 17, borderRadius: 14, border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: .3, marginTop: 18 }}>
          🚀 Quero minha loja agora!
        </button>
      </section>

      {/* COMO FUNCIONA */}
      <section style={{ padding: '36px 20px', background: 'white' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#E0FAF5', borderRadius: 30, padding: '5px 14px', fontFamily: 'Montserrat, sans-serif', fontSize: 10, fontWeight: 700, color: '#089C82', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 10, border: '1px solid #9FE1CB' }}>
          ✅ Como funciona
        </div>
        <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 24, fontWeight: 900, color: '#1A1A1A', textTransform: 'uppercase', lineHeight: 1.1, marginBottom: 6 }}>
          4 passos <span style={{ color: '#E8396A' }}>simples</span>
        </h2>
        <p style={{ fontSize: 13, color: '#777', lineHeight: 1.6, marginBottom: 24 }}>Do cadastro ao primeiro Pix em menos de 1 semana.</p>

        {[
          { n: '01', titulo: '📋 Cadastre-se grátis', desc: 'Preencha o formulário aqui embaixo. Em até 2 dias úteis você recebe o link da sua loja com +3.000 itens de prata 925.' },
          { n: '02', titulo: '📲 Compartilhe sua loja', desc: 'Mande o link para amigas, família e grupos do WhatsApp. Sua cliente clica, escolhe e compra.' },
          { n: '03', titulo: '📦 Nós cuidamos de tudo', desc: 'Embalamos e entregamos direto para sua cliente. Você não precisa tocar em nada.' },
          { n: '04', titulo: '💸 Receba 30% via Pix', desc: 'Automaticamente após o pagamento confirmado. Sem espera, sem burocracia.' },
        ].map(p => (
          <div key={p.n} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: '#FAF8F5', border: '1.5px solid #F4C0D1', borderRadius: 16, padding: 16, marginBottom: 12, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: '#0BBFA0', borderRadius: '4px 0 0 4px' }}/>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 34, fontWeight: 900, color: 'rgba(11,191,160,.18)', lineHeight: 1, flexShrink: 0, minWidth: 40, textAlign: 'center' }}>{p.n}</div>
            <div>
              <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 14, fontWeight: 700, color: '#1A1A1A', marginBottom: 3 }}>{p.titulo}</div>
              <div style={{ fontSize: 12, color: '#777', lineHeight: 1.5 }}>{p.desc}</div>
            </div>
          </div>
        ))}
      </section>

      {/* SIMULAÇÃO GANHOS */}
      <section style={{ background: '#FFF0F4', padding: '36px 20px', borderTop: '2px solid #F4C0D1', borderBottom: '2px solid #F4C0D1' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#FDE8EE', borderRadius: 30, padding: '5px 14px', fontFamily: 'Montserrat, sans-serif', fontSize: 10, fontWeight: 700, color: '#E8396A', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 10, border: '1px solid #F4C0D1' }}>
          💸 Simulação real
        </div>
        <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 24, fontWeight: 900, color: '#1A1A1A', textTransform: 'uppercase', lineHeight: 1.1, marginBottom: 6 }}>
          Veja o <span style={{ color: '#E8396A' }}>lucro real</span>
        </h2>
        <p style={{ fontSize: 13, color: '#777', lineHeight: 1.6, marginBottom: 20 }}>Ticket médio de R$300 — veja o que entra na sua conta.</p>

        {[
          { nome: '💎 Pulseira com pedras prata 925', preco: 150, foto: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&q=80' },
          { nome: '🌸 Conjunto pérola — colar + brinco + anel', preco: 300, foto: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&q=80' },
        ].map(p => (
          <div key={p.nome} style={{ background: 'white', border: '1.5px solid #F4C0D1', borderRadius: 16, overflow: 'hidden', marginBottom: 12 }}>
            <img src={p.foto} alt="" style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}/>
            <div style={{ padding: '14px 16px 16px' }}>
              <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 13, fontWeight: 700, color: '#1A1A1A', marginBottom: 12 }}>{p.nome}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
                {[['Preço', `R$${p.preco}`, '#777'],['Comissão','30%','#777'],['Você recebe',`R$${p.preco * 0.3}`, '#089C82']].map(([l,v,c],i) => (
                  <div key={i} style={{ background: '#FAF8F5', borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
                    <div style={{ fontSize: 9, color: '#777', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 4 }}>{l}</div>
                    <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 15, fontWeight: 800, color: c, lineHeight: 1 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: '#0BBFA0', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.9)', fontWeight: 500 }}>Lucro por peça</div>
                <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 18, fontWeight: 900, color: 'white' }}>R${p.preco * 0.3} 🤑</div>
              </div>
            </div>
          </div>
        ))}

        {/* Simulação mensal */}
        <div style={{ background: '#FDE8EE', border: '1.5px solid #F4C0D1', borderRadius: 16, padding: 20 }}>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 11, fontWeight: 700, color: '#E8396A', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 14 }}>
            📊 Simulação mensal — ticket médio R$300
          </div>
          {[['10 vendas × R$300','+R$900'],['20 vendas × R$300','+R$1.800'],['30 vendas × R$300','+R$2.700']].map(([l,v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F4C0D1' }}>
              <span style={{ fontSize: 13, color: '#777' }}>{l}</span>
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 14, fontWeight: 800, color: '#089C82' }}>{v}</span>
            </div>
          ))}
          <div style={{ height: 1, background: '#F4C0D1', margin: '6px 0' }}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F4C0D1' }}>
            <span style={{ fontSize: 13, color: '#777' }}>Mensalidade da loja</span>
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 13, fontWeight: 700, color: '#aaa', textDecoration: 'line-through' }}>−R$39,99</span>
          </div>
          <div style={{ background: '#E8396A', borderRadius: 12, padding: '14px 16px', marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.85)', fontWeight: 500 }}>Lucro líquido (30 vendas/mês)</div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 24, fontWeight: 900, color: 'white', letterSpacing: -1 }}>R$2.660</div>
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section style={{ background: '#FAF8F5', padding: '36px 20px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#E0FAF5', borderRadius: 30, padding: '5px 14px', fontFamily: 'Montserrat, sans-serif', fontSize: 10, fontWeight: 700, color: '#089C82', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 10, border: '1px solid #9FE1CB' }}>
          ⭐ Quem já é revendedora
        </div>
        <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 24, fontWeight: 900, color: '#1A1A1A', textTransform: 'uppercase', lineHeight: 1.1, marginBottom: 20 }}>
          Elas já <span style={{ color: '#0BBFA0' }}>começaram</span>
        </h2>

        {[
          { ini: 'M', cor: '#E8396A', nome: 'Maria Fernanda', info: 'São Paulo, SP · 3 meses', txt: '"Comecei sem gastar nada, só compartilhei o link no grupo da família. Em 2 semanas já tinha R$630 de comissão. Sem sair de casa!"' },
          { ini: 'J', cor: '#0BBFA0', nome: 'Juliana Costa', info: 'Guarulhos, SP · 2 meses', txt: '"A mensalidade paguei com a venda do primeiro conjunto. Minha loja tem +3.000 peças e não preciso comprar nada — a Prata 15 cuida de tudo!"' },
        ].map(d => (
          <div key={d.nome} style={{ background: 'white', borderRadius: 16, padding: 18, borderLeft: '4px solid #0BBFA0', border: '1px solid #EDEBE7', borderLeft: '4px solid #0BBFA0', marginBottom: 14 }}>
            <div style={{ display: 'flex', gap: 3, marginBottom: 10 }}>
              {'★★★★★'.split('').map((s, i) => <span key={i} style={{ fontSize: 15, color: '#E8396A' }}>★</span>)}
            </div>
            <p style={{ fontSize: 13, color: '#1A1A1A', lineHeight: 1.65, fontStyle: 'italic', marginBottom: 12 }}>{d.txt}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: d.cor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat, sans-serif', fontSize: 16, fontWeight: 800, color: 'white', flexShrink: 0 }}>{d.ini}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{d.nome}</div>
                <div style={{ fontSize: 11, color: '#777' }}>{d.info}</div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ══ FORMULÁRIO FUNCIONAL ══ */}
      <section id="cadastro" style={{ background: '#E8396A', padding: '36px 20px 52px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle,rgba(255,255,255,.08) 1.5px,transparent 1.5px)', backgroundSize: '22px 22px', pointerEvents: 'none' }}/>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,.2)', borderRadius: 30, padding: '5px 14px', fontFamily: 'Montserrat, sans-serif', fontSize: 10, fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 10, border: '1px solid rgba(255,255,255,.3)' }}>
          📝 Cadastro gratuito
        </div>
        <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 24, fontWeight: 900, color: 'white', textTransform: 'uppercase', lineHeight: 1.1, marginBottom: 6 }}>
          Abra sua loja <span style={{ color: '#E0FAF5' }}>agora!</span>
        </h2>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,.85)', marginBottom: 20, lineHeight: 1.6 }}>
          Preencha abaixo e entraremos em contato pelo WhatsApp em até 2 dias úteis.
        </p>

        {!sucesso ? (
          <div style={{ background: 'white', borderRadius: 20, padding: 22, position: 'relative' }}>
            <form onSubmit={enviar}>
              {[
                { label: '👤 Nome completo', field: 'nome', type: 'text', placeholder: 'Seu nome completo' },
                { label: '📱 WhatsApp', field: 'whatsapp', type: 'tel', placeholder: '(11) 99999-9999' },
                { label: '📧 E-mail', field: 'email', type: 'email', placeholder: 'seu@email.com' },
                { label: '📍 Cidade e estado', field: 'cidade', type: 'text', placeholder: 'São Paulo, SP' },
              ].map(f => (
                <div key={f.field} style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1A1A1A', marginBottom: 7, textTransform: 'uppercase', letterSpacing: .3 }}>{f.label}</label>
                  <input style={{ width: '100%', background: '#FAF8F5', border: '2px solid #EDEBE7', borderRadius: 12, padding: '13px 16px', fontFamily: 'Poppins, sans-serif', fontSize: 14, color: '#1A1A1A', outline: 'none' }} type={f.type} placeholder={f.placeholder} value={(form as any)[f.field]} onChange={e => update(f.field, e.target.value)} onFocus={e => (e.target as any).style.borderColor = '#0BBFA0'} onBlur={e => (e.target as any).style.borderColor = '#EDEBE7'} required/>
                </div>
              ))}

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1A1A1A', marginBottom: 7, textTransform: 'uppercase', letterSpacing: .3 }}>❓ Já revende outros produtos?</label>
                <select style={{ width: '100%', background: '#FAF8F5', border: '2px solid #EDEBE7', borderRadius: 12, padding: '13px 16px', fontFamily: 'Poppins, sans-serif', fontSize: 14, color: '#1A1A1A', outline: 'none', appearance: 'none' }} value={form.revende} onChange={e => update('revende', e.target.value)}>
                  <option value="">Selecione...</option>
                  <option>Sim — Avon, Natura ou similares</option>
                  <option>Sim — semi-joias ou acessórios</option>
                  <option>Não, será minha primeira vez</option>
                </select>
              </div>

              {erro && (
                <div style={{ background: '#FDE8EE', border: '1px solid #F4C0D1', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#E8396A' }}>
                  {erro}
                </div>
              )}

              <button type="submit" disabled={loading} style={{ width: '100%', background: '#0BBFA0', color: 'white', fontFamily: 'Montserrat, sans-serif', fontSize: 16, fontWeight: 800, padding: 17, borderRadius: 14, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', textTransform: 'uppercase', letterSpacing: .3, opacity: loading ? .7 : 1 }}>
                {loading ? '⏳ Enviando...' : '🚀 ABRIR MINHA LOJA AGORA!'}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
                <div style={{ flex: 1, height: 1.5, background: '#EDEBE7' }}/>
                <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 11, fontWeight: 700, color: '#777', textTransform: 'uppercase', letterSpacing: .5 }}>ou</div>
                <div style={{ flex: 1, height: 1.5, background: '#EDEBE7' }}/>
              </div>

              <a href="https://wa.me/5511999999999?text=Oi!%20Quero%20abrir%20minha%20loja%20de%20prata%20925!" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#1FAD52', color: 'white', fontFamily: 'Montserrat, sans-serif', fontSize: 15, fontWeight: 800, padding: 16, borderRadius: 14, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: .3 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                FALAR NO WHATSAPP AGORA
              </a>
              <p style={{ textAlign: 'center', fontSize: 11, color: '#777', marginTop: 14, lineHeight: 1.5 }}>🔒 Seus dados são privados e usados só para contato.</p>
            </form>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: 20, padding: '40px 24px', textAlign: 'center', position: 'relative' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#E0FAF5', border: '2px solid #9FE1CB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0BBFA0" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 22, fontWeight: 900, color: '#1A1A1A', textTransform: 'uppercase', marginBottom: 8 }}>🎉 Cadastro feito!</div>
            <p style={{ fontSize: 13, color: '#777', lineHeight: 1.6 }}>
              Recebemos seu interesse! Em até 2 dias úteis nossa equipe entra em contato pelo WhatsApp. Sua loja está quase pronta!
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer style={{ padding: 24, textAlign: 'center', background: '#FFF0F4', borderTop: '2px solid #F4C0D1' }}>
        <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 13, fontWeight: 800, color: '#E8396A', marginBottom: 6, letterSpacing: .5 }}>
          PRATA 15 · REVENDEDORAS
        </div>
        <div style={{ fontSize: 11, color: '#777', lineHeight: 1.6 }}>
          <a href="#" style={{ color: '#089C82', textDecoration: 'none', fontWeight: 600 }}>pratade15reais.com.br</a> · 
          <a href="#" style={{ color: '#089C82', textDecoration: 'none', fontWeight: 600 }}> Privacidade</a>
        </div>
      </footer>

      {/* Sticky CTA */}
      <div id="sticky-cta" style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, background: 'rgba(255,255,255,.97)', backdropFilter: 'blur(12px)', borderTop: '2px solid #F4C0D1', padding: '12px 16px 16px', zIndex: 100 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href="https://wa.me/5511999999999" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#1FAD52', color: 'white', fontFamily: 'Montserrat, sans-serif', fontSize: 12, fontWeight: 800, padding: 13, borderRadius: 12, textDecoration: 'none', textTransform: 'uppercase' }}>
            Whats
          </a>
          <button onClick={scrollForm} style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#E8396A', color: 'white', fontFamily: 'Montserrat, sans-serif', fontSize: 12, fontWeight: 800, padding: 13, borderRadius: 12, border: 'none', cursor: 'pointer', textTransform: 'uppercase' }}>
            🚀 ABRIR MINHA LOJA AGORA!
          </button>
        </div>
      </div>

    </div>
  )
}
