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
                      <div style={{ width: '100%',