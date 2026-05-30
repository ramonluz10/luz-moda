const express = require('express');
const { wishlists, products } = require('../data/db');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, (req, res) => {
  const ids = wishlists[req.user.id] || [];
  const items = ids.map(id => products.find(p => p.id === id)).filter(Boolean);
  res.json({ items, count: items.length });
});

router.post('/toggle', auth, (req, res) => {
  const { productId } = req.body;
  if (!wishlists[req.user.id]) wishlists[req.user.id] = [];
  const idx = wishlists[req.user.id].indexOf(productId);
  if (idx === -1) { wishlists[req.user.id].push(productId); res.json({ added: true, message: 'Adicionado aos favoritos.' }); }
  else { wishlists[req.user.id].splice(idx, 1); res.json({ added: false, message: 'Removido dos favoritos.' }); }
});

module.exports = router;
