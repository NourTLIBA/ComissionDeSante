import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db.js';
import { requireAuth, requireAdmin, publicUser, wrap } from '../auth.js';

const router = Router();
router.use(requireAuth, requireAdmin);

const ROLES = ['admin', 'expert'];
const passwordOk = (p) => typeof p === 'string' && p.length >= 8;

router.get('/', wrap(async (_req, res) => {
  const { rows } = await query('SELECT * FROM users ORDER BY created_at, id');
  res.json({ users: rows.map(publicUser) });
}));

router.post('/', wrap(async (req, res) => {
  const { login, name, password, role = 'expert' } = req.body || {};
  if (typeof login !== 'string' || !login.trim()) return res.status(400).json({ error: 'Identifiant requis' });
  if (typeof name !== 'string' || !name.trim()) return res.status(400).json({ error: 'Nom requis' });
  if (!passwordOk(password)) return res.status(400).json({ error: 'Mot de passe : 8 caractères minimum' });
  if (!ROLES.includes(role)) return res.status(400).json({ error: 'Rôle invalide' });

  const exists = await query('SELECT 1 FROM users WHERE lower(login) = lower($1)', [login.trim()]);
  if (exists.rowCount) return res.status(409).json({ error: 'Cet identifiant existe déjà' });

  const hash = await bcrypt.hash(password, 12);
  const { rows } = await query(
    `INSERT INTO users (login, full_name, password_hash, role)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [login.trim(), name.trim(), hash, role],
  );
  res.status(201).json({ user: publicUser(rows[0]) });
}));

router.patch('/:id', wrap(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Identifiant invalide' });
  const { name, role, active, password } = req.body || {};

  if (id === req.user.id && (active === false || (role && role !== 'admin'))) {
    return res.status(400).json({ error: 'Vous ne pouvez pas désactiver ou rétrograder votre propre compte' });
  }
  if (role !== undefined && !ROLES.includes(role)) return res.status(400).json({ error: 'Rôle invalide' });
  if (password !== undefined && !passwordOk(password)) {
    return res.status(400).json({ error: 'Mot de passe : 8 caractères minimum' });
  }

  const sets = [];
  const vals = [];
  const add = (col, val) => { vals.push(val); sets.push(`${col} = $${vals.length}`); };
  if (typeof name === 'string' && name.trim()) add('full_name', name.trim());
  if (role !== undefined) add('role', role);
  if (typeof active === 'boolean') add('active', active);
  if (password !== undefined) {
    add('password_hash', await bcrypt.hash(password, 12));
    add('must_change_password', true);
  }
  if (!sets.length) return res.status(400).json({ error: 'Rien à modifier' });

  vals.push(id);
  const { rows } = await query(`UPDATE users SET ${sets.join(', ')} WHERE id = $${vals.length} RETURNING *`, vals);
  if (!rows[0]) return res.status(404).json({ error: 'Utilisateur introuvable' });
  res.json({ user: publicUser(rows[0]) });
}));

export default router;
