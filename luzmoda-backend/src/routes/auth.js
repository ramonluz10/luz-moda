const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users, uuidv4 } = require('../data/db');
const { auth, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
    if (password.length < 8) return res.status(400).json({ error: 'Senha deve ter no mínimo 8 caracteres.' });
    if (users.find(u => u.email === email.toLowerCase())) return res.status(409).json({ error: 'Este e-mail já está cadastrado.' });

    const user = {
      id: uuidv4(), name: name.trim(), email: email.toLowerCase().trim(),
      password: await bcrypt.hash(password, 12), role: 'customer',
      vipLevel: 'standard', points: 0, active: true,
      createdAt: new Date().toISOString(), addresses: [], orders: [],
    };
    users.push(user);

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...safeUser } = user;
    res.status(201).json({ token, user: safeUser, message: 'Conta criada com sucesso! Bem-vindo(a) à Luz Moda.' });
  } catch (e) {
    res.status(500).json({ error: 'Erro ao criar conta.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });

    const user = users.find(u => u.email === email.toLowerCase());
    if (!user || !user.active) return res.status(401).json({ error: 'Credenciais inválidas.' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Credenciais inválidas.' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch {
    res.status(500).json({ error: 'Erro ao fazer login.' });
  }
});

// GET /api/auth/me
router.get('/me', auth, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
  const { password: _, ...safeUser } = user;
  res.json(safeUser);
});

// PUT /api/auth/password
router.put('/password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) return res.status(400).json({ error: 'Senha atual incorreta.' });
  if (newPassword.length < 8) return res.status(400).json({ error: 'Nova senha deve ter no mínimo 8 caracteres.' });
  user.password = await bcrypt.hash(newPassword, 12);
  res.json({ message: 'Senha alterada com sucesso.' });
});

// POST /api/auth/forgot-password
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email?.toLowerCase());
  // Always return success to prevent email enumeration
  res.json({ message: 'Se este e-mail estiver cadastrado, você receberá um link de recuperação em breve.' });
});

module.exports = router;
