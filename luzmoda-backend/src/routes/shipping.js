const express = require('express');
const router = express.Router();

// Shipping simulation (integrate Correios/Melhor Envio in production)
router.post('/calculate', (req, res) => {
  const { zip, items } = req.body;
  if (!zip) return res.status(400).json({ error: 'CEP obrigatório.' });
  const cleanZip = zip.replace(/\D/g, '');
  const subtotal = (items || []).reduce((s, i) => s + i.price * i.qty, 0);

  const free = subtotal >= 500;
  const options = [
    { id: 'express', name: 'Entrega Expressa', carrier: 'Luz Moda Express', days: 1, price: free ? 0 : 49.90, freeThreshold: 500 },
    { id: 'standard', name: 'Entrega Padrão', carrier: 'Correios SEDEX', days: 3, price: free ? 0 : 19.90, freeThreshold: 500 },
    { id: 'economic', name: 'Entrega Econômica', carrier: 'Correios PAC', days: 7, price: 0, freeThreshold: 0 },
  ];

  res.json({ zip: cleanZip, options, freeShippingThreshold: 500, qualifiesForFree: free });
});

router.post('/track', (req, res) => {
  const { trackingCode } = req.body;
  if (!trackingCode) return res.status(400).json({ error: 'Código de rastreio obrigatório.' });
  res.json({ trackingCode, carrier: 'Luz Moda Express', status: 'in_transit', events: [
    { date: new Date(Date.now() - 172800000).toISOString(), description: 'Pedido postado', location: 'São Paulo - SP' },
    { date: new Date(Date.now() - 86400000).toISOString(), description: 'Em trânsito para cidade destino', location: 'Campinas - SP' },
    { date: new Date(Date.now() - 43200000).toISOString(), description: 'Saiu para entrega', location: 'Araruama - RJ' },
  ]});
});

module.exports = router;
