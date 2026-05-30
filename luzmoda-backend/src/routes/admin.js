const express = require('express');
const { orders, products, users, reviews, subscribers, stockAlerts } = require('../data/db');
const { adminAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/dashboard', adminAuth, (req, res) => {
  const now = new Date();
  const thisMonth = orders.filter(o => { const d = new Date(o.createdAt); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
  const lastMonth = orders.filter(o => { const d = new Date(o.createdAt); const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1); return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear(); });

  const revenue = thisMonth.reduce((s, o) => s + o.total, 0);
  const lastRevenue = lastMonth.reduce((s, o) => s + o.total, 0);
  const revenueGrowth = lastRevenue ? (((revenue - lastRevenue) / lastRevenue) * 100).toFixed(1) : 100;

  const today = orders.filter(o => new Date(o.createdAt).toDateString() === now.toDateString());
  const yesterday = orders.filter(o => { const d = new Date(o.createdAt); d.setDate(d.getDate() + 1); return d.toDateString() === now.toDateString(); });

  const avgTicket = thisMonth.length ? revenue / thisMonth.length : 0;
  const activeUsers = users.filter(u => u.active && u.role === 'customer').length;

  // Monthly sales for chart (last 12 months)
  const monthlySales = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    const mo = orders.filter(o => { const od = new Date(o.createdAt); return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear(); });
    return { month: d.toLocaleString('pt-BR', { month: 'short' }), revenue: mo.reduce((s, o) => s + o.total, 0), orders: mo.length };
  });

  // Top products
  const productSales = {};
  orders.forEach(o => o.items.forEach(i => { productSales[i.productId] = (productSales[i.productId] || 0) + i.qty; }));
  const topProducts = Object.entries(productSales).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id, qty]) => ({ product: products.find(p => p.id === id), qty })).filter(x => x.product);

  res.json({
    kpis: {
      revenue: { value: revenue, growth: Number(revenueGrowth), label: 'Receita Mensal' },
      orders: { value: today.length, growth: yesterday.length ? today.length - yesterday.length : 0, label: 'Pedidos Hoje' },
      customers: { value: activeUsers, label: 'Clientes Ativos' },
      avgTicket: { value: avgTicket, growth: 6, label: 'Ticket Médio' },
      reviews: { value: reviews.length, avg: reviews.length ? (reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1) : 0, label: 'Avaliações' },
      subscribers: { value: subscribers.length, label: 'Newsletter' },
    },
    monthlySales,
    topProducts,
    recentOrders: orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10),
    pendingAlerts: stockAlerts.filter(a => !a.notified).length,
    lowStock: products.filter(p => Object.values(p.stock).some(q => q <= 3) && p.active),
  });
});

router.get('/analytics', adminAuth, (req, res) => {
  const categoryRevenue = {};
  orders.forEach(o => o.items.forEach(i => {
    const p = products.find(p => p.id === i.productId);
    if (p) categoryRevenue[p.category] = (categoryRevenue[p.category] || 0) + i.price * i.qty;
  }));
  res.json({
    categoryRevenue: Object.entries(categoryRevenue).map(([cat, rev]) => ({ category: cat, revenue: rev })).sort((a,b)=>b.revenue-a.revenue),
    conversionRate: 3.4,
    bounceRate: 42.1,
    avgSessionTime: '4m 32s',
    topPages: ['/loja','/produto/trench-coat','/produto/bolsa','/checkout','/blog'],
  });
});

module.exports = router;
