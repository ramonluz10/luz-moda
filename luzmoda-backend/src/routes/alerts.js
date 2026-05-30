const express = require('express');
const { stockAlerts, subscribers, uuidv4 } = require('../data/db');
const router = express.Router();

router.post('/stock', (req, res) => {
  const { email, productId, size } = req.body;
  if (!email || !productId) return res.status(400).json({ error: 'E-mail e produto são obrigatórios.' });
  const exists = stockAlerts.find(a => a.email === email && a.productId === productId && a.size === size);
  if (exists) return res.json({ message: 'Você já está na lista de espera para este produto.' });
  stockAlerts.push({ id: uuidv4(), email, productId, size, createdAt: new Date().toISOString(), notified: false });
  res.status(201).json({ message: 'Alerta criado! Você será avisado quando o produto estiver disponível.' });
});

router.post('/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'E-mail obrigatório.' });
  const exists = subscribers.find(s => s.email === email.toLowerCase());
  if (exists) return res.json({ message: 'Este e-mail já está inscrito. Obrigado!' });
  subscribers.push({ id: uuidv4(), email: email.toLowerCase(), createdAt: new Date().toISOString(), active: true });
  res.status(201).json({ message: 'Inscrito com sucesso! Seu cupom de 10% foi enviado para ' + email, coupon: 'BEMVINDO10' });
});

module.exports = router;
