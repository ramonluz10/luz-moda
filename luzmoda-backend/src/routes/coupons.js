const express = require('express');
const { coupons } = require('../data/db');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

router.post('/validate', auth, (req, res) => {
  const { code, subtotal } = req.body;
  const c = coupons.find(c => c.code === code?.toUpperCase() && c.active);
  if (!c) return res.status(404).json({ error: 'Cupom inválido ou expirado.' });
  if (subtotal < c.minOrder) return res.status(400).json({ error: `Pedido mínimo de R$ ${c.minOrder} para este cupom.` });
  if (c.usedCount >= c.maxUses) return res.status(400).json({ error: 'Cupom esgotado.' });
  const discount = c.type === 'percentage' ? subtotal * (c.value / 100) : c.type === 'fixed' ? c.value : 0;
  res.json({ coupon: c, discount, message: `Cupom aplicado! Desconto de R$ ${discount.toFixed(2)}` });
});

router.get('/', adminAuth, (req, res) => res.json(coupons));

module.exports = router;
