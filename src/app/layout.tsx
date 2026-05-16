import type { Metadata } from 'next'
import { CarrinhoProvider } from '@/contexts/CarrinhoContext'
import CarrinhoFloatingButton from '@/components/CarrinhoFloatingButton'
import './globals.css'

export const metadata: Metadata = {
  title: 'Loja de Prata 925 · Revendedoras',
  description: 'Sua loja de prata 925 legítima com +3.000 itens',
  icons: {
    icon: '/branding/favicon-925.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Poppins:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap" rel="stylesheet"/>
      </head>
      <body>
        <CarrinhoProvider>
          {children}
          <CarrinhoFloatingButton />
        </CarrinhoProvider>
      </body>
    </html>
  )
}