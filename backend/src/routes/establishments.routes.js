import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth, requireAdmin, wrap } from '../auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', wrap(async (_req, res) => {
  const { rows } = await query('SELECT * FROM establishments ORDER BY type, name');
  res.json({ establishments: rows });
}));

const FIELDS = ['name', 'city', 'wilaya', 'type', 'beds', 'services', 'code'];

router.post('/', requireAdmin, wrap(async (req, res) => {
  const b = req.body || {};
  if (typeof b.id !== 'string' || !/^[A-Z0-9-]{3,60}$/.test(b.id)) {
    return res.status(400).json({ error: 'id requis (majuscules, chiffres, tirets)' });
  }
  if (typeof b.name !== 'string' || !b.name.trim()) return res.status(400).json({ error: 'Nom requis' });
  const exists = await query('SELECT 1 FROM establishments WHERE id = $1', [b.id]);
  if (exists.rowCount) return res.status(409).json({ error: 'Cet établissement existe déjà' });
  const { rows } = await query(
    `INSERT INTO establishments (id, name, city, wilaya, type, beds, services, code)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [b.id, b.name.trim(), b.city ?? null, b.wilaya ?? null, b.type ?? null,
      Number.isInteger(b.beds) ? b.beds : null, Number.isInteger(b.services) ? b.services : null, b.code ?? null],
  );
  res.status(201).json({ establishment: rows[0] });
}));

router.patch('/:id', requireAdmin, wrap(async (req, res) => {
  const sets = [];
  const vals = [];
  for (const f of FIELDS) {
    if (req.body?.[f] !== undefined) { vals.push(req.body[f]); sets.push(`${f} = $${vals.length}`); }
  }
  if (!sets.length) return res.status(400).json({ error: 'Rien à modifier' });
  vals.push(req.params.id);
  const { rows } = await query(`UPDATE establishments SET ${sets.join(', ')} WHERE id = $${vals.length} RETURNING *`, vals);
  if (!rows[0]) return res.status(404).json({ error: 'Établissement introuvable' });
  res.json({ establishment: rows[0] });
}));

export default router;
