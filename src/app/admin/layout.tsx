import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Si no está logueado → al login
  if (!user) {
    redirect('/auth/login')
  }

  // Verificar si el email está en la lista de admins
  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim())
  
  if (!adminEmails.includes(user.email || '')) {
    // Si no es admin → al dashboard normal
    redirect('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {children}
    </div>
  )
}