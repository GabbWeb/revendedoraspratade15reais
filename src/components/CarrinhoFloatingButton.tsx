'use client'
import { useCarrinho } from '@/contexts/CarrinhoContext'
import Link from 'next/link'

export default function CarrinhoFloatingButton() {
  const { totalItens, toastVisivel } = useCarrinho()

  return (
    <>
      {toastVisivel && (
        <div style={{
          position: 'fixed',
          top: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#1A1A1A',
          color: 'white',
          padding: '14px 24px',
          borderRadius: 12,
          fontSize: 14,
          fontWeight: 600,
          zIndex: 1000,
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          animation: 'slideDown .3s ease-out',
        }}>
          <span style={{ fontSize: 18 }}>✓</span>
          Adicionado ao carrinho
        </div>
      )}

      {totalItens > 0 && (
        <Link href="/carrinho" style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: '#1A1A1A',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
          zIndex: 999,
          fontSize: 24,
        }}>
          🛒
          <span style={{
            position: 'absolute',
            top: -4,
            right: -4,
            background: '#DC2626',
            color: 'white',
            fontSize: 11,
            fontWeight: 700,
            minWidth: 22,
            height: 22,
            borderRadius: 11,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 6px',
            border: '2px solid white',
          }}>
            {totalItens}
          </span>
        </Link>
      )}

      <style jsx global>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </>
  )
}