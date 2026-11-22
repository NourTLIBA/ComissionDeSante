import { Router } from 'express';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import { query } from '../db.js';
import { signToken, publicUser, requireAuth, wrap } from '../auth.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de tentatives. Réessayez dans 15 minutes.' },
});

// Compared against when the login does not exist, so timing does not reveal valid logins.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

router.post('/login', loginLimiter, wrap(async (req, res) => {
  const { login, password } = req.body || {};
  if (typeof login !== 'string' || typeof password !== 'string' || !login.trim()) {
    return res.status(400).json({ error: 'Identifiant et mot de passe requis' });
  }
  const { rows } = await query('SELECT * FROM users WHERE lower(login) = lower($1)', [login.trim()]);
  const user = rows[0];
  const ok = await bcrypt.compare(password, user ? user.password_hash : DUMMY_HASH);
  if (!user || !ok || !user.active) {
    return res.status(401).json({ error: 'Identifiant ou mot de passe incorrect' });
  }
  res.json({ token: signToken(user), user: publicUser(user) });
}));

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

router.post('/change-password', requireAuth, wrap(async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (typeof newPassword !== 'string' || newPassword.length < 8) {
    return res.status(400).json({ error: 'Le nouveau mot de passe doit contenir au moins 8 caractères' });
  }
  const ok = await bcrypt.compare(String(currentPassword || ''), req.user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
  const hash = await bcrypt.hash(newPassword, 12);
  const { rows } = await query(
    'UPDATE users SET password_hash = $1, must_change_password = FALSE WHERE id = $2 RETURNING *',
    [hash, req.user.id],
  );
  res.json({ user: publicUser(rows[0]) });
}));

export default router;
