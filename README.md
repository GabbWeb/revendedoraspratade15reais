# Prata 15 — Sistema de Revendedoras
## Guia de implementação passo a passo

---

## PASSO 1 — Instalar ferramentas no Mac

Abra o Terminal (CMD + Espaço → "Terminal") e execute:

```bash
# Instala Homebrew (gerenciador de pacotes Mac)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instala Node.js
brew install node

# Confirma instalação
node --version  # deve aparecer v20+
npm --version   # deve aparecer v10+
```

---

## PASSO 2 — Clonar e instalar o projeto

```bash
# Vai para a pasta de projetos
cd ~/Documents

# Copia este projeto para sua máquina
# (você vai criar a pasta manualmente com os arquivos deste ZIP)

# Entra na pasta
cd prata15

# Instala as dependências
npm install
```

---

## PASSO 3 — Criar projeto no Supabase (gratuito)

1. Acesse https://supabase.com e crie uma conta
2. Clique em "New Project"
3. Nome: `prata15` · Senha: crie uma senha forte · Região: South America (São Paulo)
4. Aguarde 2 minutos enquanto cria
5. Vá em **Settings → API** e copie:
   - `Project URL` → cola no `.env.local` como `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → cola como `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → cola como `SUPABASE_SERVICE_ROLE_KEY`

6. Vá em **SQL Editor** → cole todo o conteúdo de `supabase-schema.sql` → clique **Run**

---

## PASSO 4 — Criar conta no Asaas (gratuito)

1. Acesse https://asaas.com e crie conta
2. Vá em **Configurações → Integrações → API**
3. Copie a chave e cole no `.env.local` como `ASAAS_API_KEY`
4. Para testes use o ambiente sandbox: `ASAAS_BASE_URL=https://sandbox.asaas.com/api/v3`

---

## PASSO 5 — Rodar o projeto localmente

```bash
npm run dev
```

Abre http://localhost:3000 no navegador — sua app está rodando!

---

## PASSO 6 — Deploy na Vercel (gratuito)

```bash
# Instala a CLI da Vercel
npm install -g vercel

# Faz o deploy
vercel

# Segue as instruções:
# - Projeto: prata15
# - Framework: Next.js (detecta automático)
# - Confirma as configurações
```

Depois vá no painel da Vercel → Settings → Environment Variables e adicione todas as variáveis do `.env.local`

---

## PASSO 7 — Configurar webhook na Nuvemshop

1. No painel da Nuvemshop vá em **Configurações → Webhooks**
2. Adicione novo webhook:
   - Evento: `order/paid`
   - URL: `https://seu-projeto.vercel.app/api/webhook`
3. Salve

A partir de agora, quando uma cliente comprar usando o link de uma revendedora (`?ref=nomerevendedora`), o sistema registra automaticamente a comissão!

---

## ESTRUTURA DE ARQUIVOS

```
prata15/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── login/page.tsx      ← Tela de login
│   │   │   └── register/page.tsx   ← Cadastro nova revendedora
│   │   ├── dashboard/page.tsx      ← Painel principal
│   │   ├── vendas/page.tsx         ← Lista de vendas
│   │   ├── saldo/page.tsx          ← Saldo e saques
│   │   ├── loja/page.tsx           ← Configurar loja
│   │   ├── api/
│   │   │   ├── webhook/route.ts    ← Recebe pedidos da Nuvemshop
│   │   │   └── saques/route.ts     ← Processa Pix via Asaas
│   │   └── layout.tsx
│   ├── components/
│   │   └── dashboard/
│   │       ├── ModalSaque.tsx      ← Modal de saque
│   │       └── BottomNav.tsx       ← Navegação inferior
│   └── lib/
│       └── supabase.ts             ← Cliente do banco
├── supabase-schema.sql             ← Schema do banco
├── .env.local                      ← Suas chaves (não commitar!)
└── package.json
```

---

## FLUXO COMPLETO

1. Revendedora se cadastra em `/auth/register`
2. Você aprova no painel admin do Supabase (muda status para 'ativa')
3. Ela recebe o link: `nomesubdominio.prata15.com.br`
4. Cliente compra pelo link (com `?ref=nome` na URL)
5. Nuvemshop dispara webhook → sistema registra a venda
6. Revendedora vê a comissão no dashboard
7. Ela solicita saque → Asaas transfere via Pix

---

## DÚVIDAS FREQUENTES

**Como aprovar uma revendedora?**
No Supabase → Table Editor → revendedoras → mude o campo `status` de `pendente` para `ativa`

**Como ver todos os saques pendentes?**
No Supabase → Table Editor → saques → filtre por `status = solicitado`

**Como testar sem Nuvemshop?**
Insira uma venda manualmente no Supabase: Table Editor → vendas → Insert row
