# LUZ MODA — Plataforma Enterprise de Moda Premium

## Stack Completa
- **Frontend**: React + Vite (porta 5173)
- **Backend**: Node.js + Express API REST (porta 3001)
- **Segurança**: JWT, bcrypt, helmet, rate limiting, CORS
- **Pagamentos**: Stripe/PIX/PayPal (simulado — pronto para integração real)

---

## Como Rodar

### 1. Backend (API)
```bash
cd luzmoda-backend
npm install
npm run dev
# API disponível em http://localhost:3001
```

### 2. Frontend
```bash
cd luzmoda
npm install
npm run dev
# Site disponível em http://localhost:5173
```

---

## Credenciais de Teste

| Usuário | Email | Senha | Perfil |
|---------|-------|-------|--------|
| Admin | admin@luzmoda.com | Admin@2026 | Super Admin |
| Cliente VIP | isabella@email.com | Senha@123 | Platina |
| Cliente | rodrigo@email.com | Senha@123 | Ouro |

## Cupons de Desconto
| Código | Tipo | Desconto | Mínimo |
|--------|------|----------|--------|
| BEMVINDO10 | % | 10% | R$ 500 |
| VIP20 | % | 20% | R$ 2.000 |
| FRETEGRATIS | Frete | 100% | R$ 300 |
| LUZ150 | Fixo | R$ 150 | R$ 1.500 |

---

## API Endpoints

### Auth
- `POST /api/auth/register` — Criar conta
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Perfil do usuário logado
- `PUT /api/auth/password` — Alterar senha

### Produtos
- `GET /api/products` — Listar (filtros: category, search, sort, minPrice, maxPrice)
- `GET /api/products/featured` — Produtos em destaque
- `GET /api/products/:id` — Produto individual
- `GET /api/products/:id/related` — Produtos relacionados

### Pedidos
- `POST /api/orders` — Criar pedido
- `GET /api/orders` — Meus pedidos
- `GET /api/orders/:id` — Detalhes + rastreamento
- `POST /api/orders/:id/cancel` — Cancelar

### Carrinho
- `GET /api/cart` — Ver carrinho
- `POST /api/cart/add` — Adicionar item
- `PUT /api/cart/item/:id` — Atualizar quantidade
- `DELETE /api/cart/item/:id` — Remover item

### Reviews
- `GET /api/reviews/product/:productId` — Avaliações do produto
- `POST /api/reviews` — Publicar avaliação
- `POST /api/reviews/:id/helpful` — Marcar como útil

### Pagamentos
- `POST /api/payments/process` — Processar pagamento
- `GET /api/payments/methods` — Métodos disponíveis

### Frete
- `POST /api/shipping/calculate` — Calcular frete por CEP
- `POST /api/shipping/track` — Rastrear pedido

### Cupons
- `POST /api/coupons/validate` — Validar cupom

### Wishlist
- `GET /api/wishlist` — Minha lista de desejos
- `POST /api/wishlist/toggle` — Adicionar/remover

### Blog
- `GET /api/blog` — Listar posts
- `GET /api/blog/:slug` — Post individual

### Alertas
- `POST /api/alerts/stock` — Alerta de estoque
- `POST /api/alerts/newsletter` — Inscrição newsletter

### Admin (requer role admin/superadmin)
- `GET /api/admin/dashboard` — KPIs, vendas, top produtos
- `GET /api/admin/analytics` — Analytics detalhado
- `GET /api/orders/all` — Todos os pedidos
- `PUT /api/orders/:id/status` — Atualizar status

---

## Deploy em Produção

### Vercel (Frontend)
```bash
cd luzmoda
npm run build
npx vercel --prod
```

### Railway / Render (Backend)
```bash
cd luzmoda-backend
# Configure variáveis de ambiente:
# JWT_SECRET, NODE_ENV=production, DATABASE_URL
# Faça push para o GitHub e conecte ao Railway/Render
```

### Variáveis de Ambiente (produção)
```env
JWT_SECRET=sua-chave-secreta-muito-forte-aqui
NODE_ENV=production
PORT=3001
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
SMTP_PASS=sua-api-key-sendgrid
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
```

---

## Próximos Passos para Produção Real

1. **Banco de dados**: Substituir o db.js in-memory por PostgreSQL com Prisma ORM
2. **Stripe real**: Descomentar e configurar com suas chaves de API
3. **E-mail**: Configurar SendGrid/Resend para e-mails transacionais
4. **Imagens**: Integrar Cloudinary para upload e CDN de imagens
5. **Redis**: Cache de sessões e rate limiting distribuído
6. **Kubernetes**: Deploy em EKS para escala multinacional

---

Desenvolvido com ❤️ — Luz Moda Global © 2026
