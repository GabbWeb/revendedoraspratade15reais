import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export type Revendedora = {
  id: string
  user_id: string
  nome: string
  nome_loja: string | null
  email: string
  whatsapp: string
  cidade: string
  estado: string
  foto_url: string | null
  bio: string | null
  subdominio: string
  status: 'pendente' | 'ativa' | 'suspensa'
  saldo_disponivel: number
  saldo_processando: number
  total_ganho: number
  total_vendas: number
  asaas_customer_id: string | null
  criado_em: string
  atualizado_em: string
}

export type Venda = {
  id: string
  revendedora_id: string
  pedido_id: string
  cliente_nome: string
  produto_nome: string
  produto_foto: string | null
  valor_total: number
  valor_comissao: number
  status: 'processando' | 'pago' | 'cancelado' | 'pendente'
  criado_em: string
}

export type Saque = {
  id: string
  revendedora_id: string
  tipo: 'pix' | 'credito_loja'
  valor: number
  chave_pix: string | null
  status: 'solicitado' | 'processando' | 'pago' | 'recusado'
  criado_em: string
  pago_em: string | null
}

export type Notificacao = {
  id: string
  revendedora_id: string
  titulo: string
  mensagem: string
  tipo: 'info' | 'venda' | 'saque' | 'aviso'
  lida: boolean
  criado_em: string
}
