const express = require('express');
const { blogPosts } = require('../data/db');
const router = express.Router();

router.get('/', (req, res) => {
  const { category, featured, page = 1, limit = 9 } = req.query;
  let result = [...blogPosts];
  if (category && category !== 'Todos') result = result.filter(p => p.category === category);
  if (featured === 'true') result = result.filter(p => p.featured);
  const total = result.length;
  const start = (Number(page) - 1) * Number(limit);
  res.json({ posts: result.slice(start, start + Number(limit)), total, categories: [...new Set(blogPosts.map(p => p.category))] });
});

router.get('/:slug', (req, res) => {
  const post = blogPosts.find(p => p.slug === req.params.slug || p.id === req.params.slug);
  if (!post) return res.status(404).json({ error: 'Post não encontrado.' });
  post.views = (post.views || 0) + 1;
  const related = blogPosts.filter(p => p.id !== post.id && p.category === post.category).slice(0, 3);
  res.json({ ...post, related });
});

module.exports = router;
