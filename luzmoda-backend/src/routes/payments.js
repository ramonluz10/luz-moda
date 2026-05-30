const express = require('express');
const { orders } = require('../data/db');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Simulates payment processing (replace with real Stripe/PagSeguro in production)
router.post('/process', auth, (req, res) => {
  const { orderId, method, cardToken, pixKey } = req.body;
  const order = orders.find(o => o.id === orderId && o.userId === req.user.id);
  if (!order) return res.status(404).json({ error: 'Pedido não encontrado.' });

  setTimeout(() => {
    if (method === 'pix') {
      const pixCode = `00020126580014BR.GOV.BCB.PIX0136${Date.now()}5204000053039865802BR5925LUZ MODA LTDA6009SAO PAULO62070503***6304${Math.random().toString(36).slice(2,6).toUpperCase()}`;
      order.paymentStatus = 'awaiting_pix';
      res.json({ success: true, method: 'pix', pixCode, pixExpiry: new Date(Date.now() + 30 * 60 * 1000).toISOString(), message: 'PIX gerado. Pague em até 30 minutos.' });
    } else if (method === 'card') {
      order.paymentStatus = 'paid';
      order.status = 'confirmed';
      const last4 = cardToken?.slice(-4) || '****';
      res.json({ success: true, method: 'card', transactionId: `TXN-${Date.now()}`, last4, message: 'Pagamento aprovado!' });
    } else if (method === 'paypal') {
      order.paymentStatus = 'paid';
      order.status = 'confirmed';
      res.json({ success: true, method: 'paypal', transactionId: `PP-${Date.now()}`, message: 'Pagamento PayPal confirmado!' });
    } else {
      res.status(400).json({ error: 'Método de pagamento não suportado.' });
    }
  }, 800); // Simulate processing delay
});

// POST /api/payments/pix/confirm (webhook simulation)
router.post('/pix/confirm', (req, res) => {
  const { orderId } = req.body;
  const order = orders.find(o => o.id === orderId);
  if (!order) return res.status(404).json({ error: 'Pedido não encontrado.' });
  order.paymentStatus = 'paid';
  order.status = 'confirmed';
  res.json({ success: true, message: 'PIX confirmado.' });
});

// GET /api/payments/methods
router.get('/methods', (req, res) => {
  res.json([
    { id: 'card', label: 'Cartão de Crédito/Débito', description: 'Visa, Mastercard, Amex, Elo', icon: 'card', installments: [1,2,3,6,12], active: true },
    { id: 'pix', label: 'PIX', description: 'Aprovação imediata · 5% de desconto', icon: 'pix', discount: 5, active: true },
    { id: 'paypal', label: 'PayPal', description: 'Pague com sua conta PayPal', icon: 'paypal', active: true },
    { id: 'boleto', label: 'Boleto Bancário', description: 'Vencimento em 3 dias úteis', icon: 'boleto', active: true },
  ]);
});

module.exports = router;
