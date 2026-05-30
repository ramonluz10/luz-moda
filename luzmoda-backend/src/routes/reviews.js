// reviews.js
const express = require('express');
const { reviews, products, uuidv4 } = require('../data/db');
const { auth, adminAuth, optionalAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/product/:productId', optionalAuth, (req, res) => {
  const { sort = 'recent', filter, page = 1, limit = 10 } = req.query;
  let result = reviews.filter(r => r.productId === req.params.productId && r.approved);
  if (filter && filter !== 'all') result = result.filter(r => r.rating === Number(filter));
  if (sort === 'helpful') result.sort((a, b) => b.helpful - a.helpful);
  else if (sort === 'lowest') result.sort((a, b) => a.rating - b.rating);
  else result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const total = result.length;
  const avg = total ? (result.reduce((s, r) => s + r.rating, 0) / total).toFixed(1) : 0;
  const dist = [5,4,3,2,1].map(n => ({ n, count: result.filter(r => r.rating === n).length }));
  const start = (Number(page) - 1) * Number(limit);
  res.json({ reviews: result.slice(start, start + Number(limit)), total, avg, dist, page: Number(page) });
});

router.post('/', auth, (req, res) => {
  const { productId, rating, title, body, size, color, criteria } = req.body;
  if (!productId || !rating || !title || !body) return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
  const existing = reviews.find(r => r.productId === productId && r.userId === req.user.id);
  if (existing) return res.status(409).json({ error: 'Você já avaliou este produto.' });
  const review = { id: uuidv4(), productId, userId: req.user.id, author: req.user.name || 'Cliente', rating: Number(rating), title, body, size, color, helpful: 0, verified: true, photos: [], criteria: criteria || {}, createdAt: new Date().toISOString(), approved: true };
  reviews.push(review);
  const p = products.find(p => p.id === productId);
  if (p) { const allRev = reviews.filter(r => r.productId === productId && r.approved); p.rating = parseFloat((allRev.reduce((s, r) => s + r.rating, 0) / allRev.length).toFixed(1)); p.reviewCount = allRev.length; }
  res.status(201).json(review);
});

router.post('/:id/helpful', (req, res) => {
  const r = reviews.find(r => r.id === req.params.id);
  if (!r) return res.status(404).json({ error: 'Avaliação não encontrada.' });
  r.helpful++;
  res.json({ helpful: r.helpful });
});

router.get('/all', adminAuth, (req, res) => res.json(reviews));

module.exports = router;
