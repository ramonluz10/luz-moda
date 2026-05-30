const express = require('express');
const { products, uuidv4 } = require('../data/db');
const { adminAuth, optionalAuth } = require('../middleware/auth');
const router = express.Router();

// GET /api/products
router.get('/', optionalAuth, (req, res) => {
  const { category, search, sort, minPrice, maxPrice, page = 1, limit = 20, featured } = req.query;
  let result = products.filter(p => p.active);

  if (category && category !== 'Todos') result = result.filter(p => p.category === category);
  if (search) { const q = search.toLowerCase(); result = result.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)); }
  if (minPrice) result = result.filter(p => p.price >= Number(minPrice));
  if (maxPrice) result = result.filter(p => p.price <= Number(maxPrice));
  if (featured === 'true') result = result.filter(p => p.featured);

  if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);
  else if (sort === 'newest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const total = result.length;
  const start = (Number(page) - 1) * Number(limit);
  const paginated = result.slice(start, start + Number(limit));

  res.json({ products: paginated, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

// GET /api/products/categories
router.get('/categories', (req, res) => {
  const cats = [...new Set(products.map(p => p.category))];
  res.json(cats);
});

// GET /api/products/featured
router.get('/featured', (req, res) => {
  res.json(products.filter(p => p.featured && p.active).slice(0, 8));
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const p = products.find(p => p.id === req.params.id || p.slug === req.params.id);
  if (!p || !p.active) return res.status(404).json({ error: 'Produto não encontrado.' });
  res.json(p);
});

// GET /api/products/:id/related
router.get('/:id/related', (req, res) => {
  const p = products.find(p => p.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'Produto não encontrado.' });
  const related = products.filter(r => r.id !== p.id && r.category === p.category && r.active).slice(0, 4);
  if (related.length < 4) {
    const others = products.filter(r => r.id !== p.id && r.active && !related.find(x => x.id === r.id));
    related.push(...others.slice(0, 4 - related.length));
  }
  res.json(related);
});

// POST /api/products (admin)
router.post('/', adminAuth, (req, res) => {
  const p = { id: uuidv4(), ...req.body, active: true, createdAt: new Date().toISOString(), rating: 0, reviewCount: 0 };
  products.push(p);
  res.status(201).json(p);
});

// PUT /api/products/:id (admin)
router.put('/:id', adminAuth, (req, res) => {
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Produto não encontrado.' });
  products[idx] = { ...products[idx], ...req.body, updatedAt: new Date().toISOString() };
  res.json(products[idx]);
});

// DELETE /api/products/:id (admin - soft delete)
router.delete('/:id', adminAuth, (req, res) => {
  const p = products.find(p => p.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'Produto não encontrado.' });
  p.active = false;
  res.json({ message: 'Produto desativado.' });
});

module.exports = router;
