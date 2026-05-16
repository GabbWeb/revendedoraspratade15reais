'use client'
import { useCarrinho } from '@/contexts/CarrinhoContext'
import Link from 'next/link'

export default function CarrinhoPage() {
  const { itens, alterarQuantidade, remover, subtotal, totalItens, limpar } = useCarrinho()

  function formatBRL(val: number) {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const linkVoltar = itens.length > 0 ? `/loja/${itens[0].slugRevendedora}` : '/'

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: '-apple-system, "Inter", sans-serif' }}>

      <header style={{ background: 'white', borderBottom: '1px solid #EEE', padding: '20px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <Link href={linkVoltar} style={{ fontSize: 13, color: '#555', textDecoration: 'none', fontWeight: 500 }}>
            ← Continuar comprando
          </Link>
          <div style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 20, fontWeight: 700, color: '#1A1A1A', letterSpacing: -0.3 }}>
            Carrinho
          </div>
          <div style={{ fontSize: 13, color: '#999' }}>
            {totalItens} {totalItens === 1 ? 'item' : 'itens'}
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>

        {itens.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: 16, border: '1px solid #EEE' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🛒</div>
            <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 24, fontWeight: 700, color: '#1A1A1A', marginBottom: 8 }}>
              Seu carrinho está vazio
            </h2>
            <p style={{ fontSize: 14, color: '#777', marginBottom: 24, lineHeight: 1.6 }}>
              Que tal explorar nossas joias em prata 925?
            </p>
            <Link href="/" style={{ display: 'inline-block', padding: '14px 28px', borderRadius: 12, background: '#1A1A1A', color: 'white', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
              Ver coleção
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, alignItems: 'start' }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {itens.map(item => (
                <div key={item.id} style={{ background: 'white', borderRadius: 12, padding: 16, border: '1px solid #EEE', display: 'flex', gap: 16, alignItems: 'flex-start' }}>

                  <div style={{ width: 80, height: 80, flexShrink: 0, background: '#F5F5F5', borderRadius: 8, overflow: 'hidden' }}>
                    {item.foto ? (
                      <img src={item.foto} alt={item.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>💎</div>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 14, fontWeight: 600, color: '#1A1A1A', lineHeight: 1.3, marginBottom: 4 }}>
                      {item.nome}
                    </div>
                    <div style={{ fontSize: 11, color: '#999', marginBottom: 10 }}>
                      SKU: {item.sku}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #EEE', borderRadius: 8, background: '#FAFAFA' }}>
                        <button
                          onClick={() => alterarQuantidade(item.id, item.quantidade - 1)}
                          style={{ width: 32, height: 32, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 16, color: '#555' }}
                          aria-label="Diminuir quantidade"
                        >
                          −
                        </button>
                        <div style={{ minWidth: 24, textAlign: 'center', fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>
                          {item.quantidade}
                        </div>
                        <button
                          onClick={() => alterarQuantidade(item.id, item.quantidade + 1)}
                          style={{ width: 32, height: 32, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 16, color: '#555' }}
                          aria-label="Aumentar quantidade"
                        >
                          +
                        </button>
                      </div>

                      <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>
                        {formatBRL(item.preco * item.quantidade)}
                      </div>
                    </div>

                    <button
                      onClick={() => remover(item.id)}
                      style={{ marginTop: 8, padding: 0, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 12, color: '#DC2626', textDecoration: 'underline' }}
                    >
                      Remover
                    </button>
                  </div>

                </div>
              ))}

              <button
                onClick={() => {
                  if (confirm('Tem certeza que deseja limpar o carrinho?')) limpar()
                }}
                style={{ marginTop: 8, padding: '10px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 12, color: '#999', textDecoration: 'underline', textAlign: 'center' }}
              >
                Limpar carrinho
              </button>
            </div>

            <div style={{ position: 'sticky', top: 24, background: 'white', borderRadius: 16, padding: 24, border: '1px solid #EEE' }}>
              <div style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 20, fontWeight: 700, color: '#1A1A1A', marginBottom: 16 }}>
                Resumo
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#555', marginBottom: 8 }}>
                <span>Subtotal ({totalItens} {totalItens === 1 ? 'item' : 'itens'})</span>
                <span>{formatBRL(subtotal)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#555', marginBottom: 16 }}>
                <span>Frete</span>
                <span style={{ color: '#999' }}>Calculado no checkout</span>
              </div>

              <div style={{ borderTop: '1px solid #EEE', paddingTop: 16, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>Total</span>
                <span style={{ fontSize: 24, fontWeight: 700, color: '#1A1A1A' }}>{formatBRL(subtotal)}</span>
              </div>

              <div style={{ fontSize: 12, color: '#777', marginBottom: 16, textAlign: 'center' }}>
                ou 3x de {formatBRL(subtotal / 3)} sem juros
              </div>

              <button
                disabled
                style={{
                  display: 'block', width: '100%', textAlign: 'center',
                  padding: '16px 20px', borderRadius: 12,
                  background: '#1A1A1A', color: 'white',
                  fontSize: 15, fontWeight: 600, textDecoration: 'none',
                  border: 'none', cursor: 'not-allowed', opacity: 0.6,
                  boxSizing: 'border-box',
                }}
              >
                Finalizar compra (em breve)
              </button>

              <div style={{ marginTop: 16, padding: 12, background: '#FFF8E1', borderRadius: 8, fontSize: 11, color: '#866', lineHeight: 1.5, textAlign: 'center' }}>
                💎 Checkout com PagBank será habilitado em breve. Por enquanto, finalize sua compra via WhatsApp pela loja da revendedora.
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}