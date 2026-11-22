import jwt from 'jsonwebtoken';
import { config } from './config.js';
import { query } from './db.js';

export const signToken = (user) =>
  jwt.sign({ sub: user.id, role: user.role }, config.jwtSecret, { expiresIn: config.jwtExpires });

export const publicUser = (u) => ({
  id: u.id,
  login: u.login,
  name: u.full_name,
  role: u.role,
  active: u.active,
  mustChangePassword: u.must_change_password,
});

// Reads the token, then re-checks the user in the database so a disabled
// account is cut off immediately.
export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Non authentifié' });
    const payload = jwt.verify(token, config.jwtSecret);
    const { rows } = await query('SELECT * FROM users WHERE id = $1', [payload.sub]);
    const user = rows[0];
    if (!user || !user.active) return res.status(401).json({ error: 'Compte inactif ou inconnu' });
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expirée' });
    }
    next(err);
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Réservé aux administrateurs' });
  next();
}

// Wraps async handlers so errors reach the error middleware.
export const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
