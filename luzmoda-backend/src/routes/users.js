const express = require('express');
const { users, orders, uuidv4 } = require('../data/db');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/me', auth, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
  const { password: _, ...safe } = user;
  const myOrders = orders.filter(o => o.userId === user.id);
  const totalSpent = myOrders.reduce((s, o) => s + o.total, 0);
  res.json({ ...safe, totalOrders: myOrders.length, totalSpent });
});

router.put('/me', auth, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
  const allowed = ['name', 'phone', 'birthdate', 'preferences'];
  allowed.forEach(k => { if (req.body[k] !== undefined) user[k] = req.body[k]; });
  user.updatedAt = new Date().toISOString();
  const { password: _, ...safe } = user;
  res.json(safe);
});

router.post('/me/addresses', auth, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
  const addr = { id: uuidv4(), ...req.body };
  if (addr.default) user.addresses.forEach(a => a.default = false);
  user.addresses.push(addr);
  res.status(201).json(addr);
});

router.delete('/me/addresses/:addrId', auth, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
  user.addresses = user.addresses.filter(a => a.id !== req.params.addrId);
  res.json({ message: 'Endereço removido.' });
});

router.get('/', adminAuth, (req, res) => {
  const safe = users.map(({ password: _, ...u }) => u);
  res.json(safe);
});

module.exports = router;
