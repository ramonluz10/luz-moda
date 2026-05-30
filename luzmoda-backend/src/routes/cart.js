const express = require('express');
const { carts, products, uuidv4 } = require('../data/db');
const { auth } = require('../middleware/auth');
const router = express.Router();

const getCart = (userId) => { if (!carts[userId]) carts[userId] = { items: [], updatedAt: new Date().toISOString() }; return carts[userId]; };

router.get('/', auth, (req, res) => {
  const cart = getCart(req.user.id);
  const enriched = cart.items.map(item => { const p = products.find(p => p.id === item.productId); return { ...item, product: p || null, subtotal: (p?.price || 0) * item.qty }; });
  const total = enriched.reduce((s, i) => s + i.subtotal, 0);
  res.json({ items: enriched, total, itemCount: cart.items.reduce((s, i) => s + i.qty, 0) });
});

router.post('/add', auth, (req, res) => {
  const { productId, qty = 1, size, color } = req.body;
  const p = products.find(p => p.id === productId && p.active);
  if (!p) return res.status(404).json({ error: 'Produto não encontrado.' });
  if ((p.stock[size] || 0) < qty) return res.status(400).json({ error: 'Estoque insuficiente.' });
  const cart = getCart(req.user.id);
  const existing = cart.items.find(i => i.productId === productId && i.size === size);
  if (existing) existing.qty += qty; else cart.items.push({ id: uuidv4(), productId, qty, size, color });
  cart.updatedAt = new Date().toISOString();
  res.json({ message: 'Adicionado ao carrinho.', itemCount: cart.items.reduce((s, i) => s + i.qty, 0) });
});

router.put('/item/:id', auth, (req, res) => {
  const cart = getCart(req.user.id);
  const item = cart.items.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Item não encontrado.' });
  if (req.body.qty <= 0) { cart.items = cart.items.filter(i => i.id !== req.params.id); }
  else { item.qty = req.body.qty; }
  res.json({ message: 'Carrinho atualizado.' });
});

router.delete('/item/:id', auth, (req, res) => {
  const cart = getCart(req.user.id);
  cart.items = cart.items.filter(i => i.id !== req.params.id);
  res.json({ message: 'Item removido.' });
});

router.delete('/', auth, (req, res) => {
  carts[req.user.id] = { items: [], updatedAt: new Date().toISOString() };
  res.json({ message: 'Carrinho esvaziado.' });
});

module.exports = router;
