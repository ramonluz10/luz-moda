const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'luzmoda-super-secret-key-2026';

const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido.' });
  }
  try {
    const token = header.split(' ')[1];
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};

const optionalAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    try { req.user = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET || 'luzmoda-super-secret-key-2026'); } catch {}
  }
  next();
};

const adminAuth = (req, res, next) => {
  auth(req, res, () => {
    if (!['admin', 'superadmin'].includes(req.user?.role)) {
      return res.status(403).json({ error: 'Acesso restrito a administradores.' });
    }
    next();
  });
};

module.exports = { auth, optionalAuth, adminAuth, JWT_SECRET };
