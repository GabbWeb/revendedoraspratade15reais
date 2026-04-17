import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export default async function HomePage() {
  // Redireciona usuário logado para dashboard
  // Caso contrário, mostra landing page de recrutamento
  redirect('/landing')
}
