import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Prata 15 · Revendedoras',
  description: 'Sua loja de prata 925 com +3.000 itens',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Poppins:wght@300;400;500&display=swap" rel="stylesheet"/>
      </head>
      <body>{children}</body>
    </html>
  )
}
