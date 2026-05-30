const express = require('express');
const { orders, products, coupons, users, uuidv4 } = require('../data/db');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

const STATUS_LABELS = { pending: 'Pendente', confirmed: 'Confirmado', processing: 'Em Separação', shipped: 'Enviado', in_transit: 'Em Trânsito', delivered: 'Entregue', cancelled: 'Cancelado', refunded: 'Reembolsado' };
const TRACKING_STEPS = ['confirmed', 'processing', 'shipped', 'in_transit', 'delivered'];

// POST /api/orders
router.post('/', auth, (req, res) => {
  try {
    const { items, address, paymentMethod, couponCode } = req.body;
    if (!items?.length) return res.status(400).json({ error: 'Carrinho vazio.' });
    if (!address) return res.status(400).json({ error: 'Endereço de entrega obrigatório.' });
    if (!paymentMethod) return res.status(400).json({ error: 'Método de pagamento obrigatório.' });

    // Validate & price items
    let subtotal = 0;
    const orderItems = items.map(item => {
      const p = products.find(p => p.id === item.productId && p.active);
      if (!p) throw new Error(`Produto ${item.productId} não encontrado.`);
      const stockQty = p.stock[item.size] || 0;
      if (stockQty < item.qty) throw new Error(`Estoque insuficiente para ${p.name} - ${item.size}.`);
      subtotal += p.price * item.qty;
      return { productId: p.id, name: p.name, qty: item.qty, size: item.size, color: item.color, price: p.price };
    });

    // Apply coupon
    let discount = 0;
    let couponUsed = null;
    if (couponCode) {
      const coupon = coupons.find(c => c.code === couponCode.toUpperCase() && c.active);
      if (!coupon) return res.status(400).json({ error: 'Cupom inválido ou expirado.' });
      if (subtotal < coupon.minOrder) return res.status(400).json({ error: `Pedido mínimo de R$ ${coupon.minOrder} para este cupom.` });
      if (coupon.usedCount >= coupon.maxUses) return res.status(400).json({ error: 'Cupom esgotado.' });
      discount = coupon.type === 'percentage' ? subtotal * (coupon.value / 100) : coupon.type === 'fixed' ? coupon.value : 0;
      coupon.usedCount++;
      couponUsed = coupon.code;
    }

    const shipping = subtotal >= 500 ? 0 : 29.90;
    const tax = (subtotal - discount) * 0.1;
    const total = subtotal - discount + shipping + tax;

    const order = {
      id: `LUZ-${Date.now().toString().slice(-6)}`,
      userId: req.user.id, items: orderItems, subtotal, discount, shipping, tax,
      total: Math.round(total * 100) / 100, coupon: couponUsed,
      status: paymentMethod === 'pix' ? 'pending' : 'confirmed',
      paymentMethod, paymentStatus: paymentMethod === 'pix' ? 'awaiting' : 'paid',
      trackingCode: null, address,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    orders.push(order);

    // Deduct stock
    orderItems.forEach(item => { const p = products.find(p => p.id === item.productId); if (p) p.stock[item.size] = Math.max(0, (p.stock[item.size] || 0) - item.qty); });

    // Add VIP points (1 point per R$1)
    const user = users.find(u => u.id === req.user.id);
    if (user) { user.points = (user.points || 0) + Math.floor(subtotal); }

    res.status(201).json({ order, message: 'Pedido criado com sucesso!', pointsEarned: Math.floor(subtotal) });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// GET /api/orders (my orders)
router.get('/', auth, (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const myOrders = orders.filter(o => o.userId === req.user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const start = (Number(page) - 1) * Number(limit);
  res.json({ orders: myOrders.slice(start, start + Number(limit)), total: myOrders.length });
});

// GET /api/orders/all (admin)
router.get('/all', adminAuth, (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  let result = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (status) result = result.filter(o => o.status === status);
  const start = (Number(page) - 1) * Number(limit);
  res.json({ orders: result.slice(start, start + Number(limit)), total: result.length });
});

// GET /api/orders/:id
router.get('/:id', auth, (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Pedido não encontrado.' });
  if (order.userId !== req.user.id && !['admin','superadmin'].includes(req.user.role)) return res.status(403).json({ error: 'Acesso negado.' });

  const stepIndex = TRACKING_STEPS.indexOf(order.status);
  const tracking = TRACKING_STEPS.map((s, i) => ({ status: s, label: STATUS_LABELS[s], completed: i <= stepIndex, current: i === stepIndex, date: i <= stepIndex ? new Date(Date.now() - (stepIndex - i) * 86400000 * 1.5).toISOString() : null }));

  res.json({ ...order, statusLabel: STATUS_LABELS[order.status], tracking });
});

// PUT /api/orders/:id/status (admin)
router.put('/:id/status', adminAuth, (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Pedido não encontrado.' });
  const { status, trackingCode } = req.body;
  order.status = status;
  order.updatedAt = new Date().toISOString();
  if (trackingCode) order.trackingCode = trackingCode;
  res.json({ order, message: `Status atualizado para: ${STATUS_LABELS[status]}` });
});

// POST /api/orders/:id/cancel
router.post('/:id/cancel', auth, (req, res) => {
  const order = orders.find(o => o.id === req.params.id && o.userId === req.user.id);
  if (!order) return res.status(404).json({ error: 'Pedido não encontrado.' });
  if (['shipped','in_transit','delivered'].includes(order.status)) return res.status(400).json({ error: 'Pedido não pode ser cancelado neste estágio.' });
  order.status = 'cancelled';
  order.updatedAt = new Date().toISOString();
  res.json({ message: 'Pedido cancelado com sucesso.' });
});

module.exports = router;
