const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

// ── Security middleware ────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500, message: { error: 'Muitas requisições. Tente novamente em breve.' } });
app.use('/api/', limiter);

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { error: 'Muitas tentativas de login.' } });
app.use('/api/auth/', authLimiter);

// ── Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/reviews',  require('./routes/reviews'));
app.use('/api/cart',     require('./routes/cart'));
app.use('/api/users',    require('./routes/users'));
app.use('/api/blog',     require('./routes/blog'));
app.use('/api/coupons',  require('./routes/coupons'));
app.use('/api/admin',    require('./routes/admin'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/shipping', require('./routes/shipping'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/alerts',   require('./routes/alerts'));

// ── Health check ──────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', version: '1.0.0', timestamp: new Date().toISOString() }));

// ── Serve frontend build ──────────────────────────────────────────────────
const frontendPath = path.join(__dirname, '../../luzmoda/dist');
app.use(express.static(frontendPath));
app.use((req, res) => {
  const indexPath = path.join(frontendPath, 'index.html');
  const fs = require('fs');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.json({ message: 'Luz Moda API v1.0 — Frontend não encontrado nesta rota.' });
  }
});

// ── Error handler ─────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`\n🚀 Luz Moda API rodando em http://localhost:${PORT}\n📦 Frontend em http://localhost:${PORT}\n`));

module.exports = app;
