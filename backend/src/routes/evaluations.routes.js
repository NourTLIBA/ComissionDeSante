import { Router } from 'express';
import { query, pool } from '../db.js';
import { requireAuth, requireAdmin, wrap } from '../auth.js';
import { CRITERION_IDS, computeScore, accreditationLevel } from '../scoring.js';

const router = Router();
router.use(requireAuth);

const SELECT_EVAL = `
  SELECT e.*, s.name AS establishment_name, u.full_name AS expert_name, u.login AS expert_login
  FROM evaluations e
  JOIN establishments s ON s.id = e.establishment_id
  JOIN users u ON u.id = e.expert_id`;

const shape = (e) => ({
  id: e.id,
  establishmentId: e.establishment_id,
  establishmentName: e.establishment_name,
  expertId: e.expert_id,
  expertName: e.expert_name,
  expertLogin: e.expert_login,
  status: e.status,
  finalScore: e.final_score,
  accreditationLevel: e.accreditation_level,
  comment: e.comment,
  startedAt: e.started_at,
  finishedAt: e.finished_at,
  updatedAt: e.updated_at,
});

const loadGrades = async (evaluationId) => {
  const { rows } = await query('SELECT criterion_id, score FROM grades WHERE evaluation_id = $1', [evaluationId]);
  return Object.fromEntries(rows.map((r) => [r.criterion_id, r.score]));
};

// Loads an evaluation the caller may touch (experts: only their own; admins: any).
async function getAccessible(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1 || id > 2147483647) { res.status(400).json({ error: 'Identifiant invalide' }); return null; }
  const { rows } = await query(`${SELECT_EVAL} WHERE e.id = $1`, [id]);
  const ev = rows[0];
  if (!ev || (req.user.role !== 'admin' && ev.expert_id !== req.user.id)) {
    res.status(404).json({ error: 'Visite introuvable' });
    return null;
  }
  return ev;
}

const requireDraft = (ev, res) => {
  if (ev.status !== 'draft') {
    res.status(409).json({ error: 'Cette visite est terminée et verrouillée' });
    return false;
  }
  return true;
};

// ---- Start (or resume) a visit ------------------------------------------------
router.post('/', wrap(async (req, res) => {
  const { establishmentId } = req.body || {};
  if (typeof establishmentId !== 'string') return res.status(400).json({ error: 'establishmentId requis' });
  const est = await query('SELECT 1 FROM establishments WHERE id = $1', [establishmentId]);
  if (!est.rowCount) return res.status(404).json({ error: 'Établissement introuvable' });

  const open = await query(
    `SELECT id FROM evaluations WHERE establishment_id = $1 AND expert_id = $2 AND status = 'draft'
     ORDER BY updated_at DESC LIMIT 1`,
    [establishmentId, req.user.id],
  );
  let id = open.rows[0]?.id;
  let created = false;
  if (!id) {
    // two simultaneous starts: the unique index lets only one insert win, the other reads it
    const ins = await query(
      `INSERT INTO evaluations (establishment_id, expert_id) VALUES ($1, $2)
       ON CONFLICT (expert_id, establishment_id) WHERE status = 'draft' DO NOTHING RETURNING id`,
      [establishmentId, req.user.id],
    );
    if (ins.rows[0]) {
      id = ins.rows[0].id;
      created = true;
    } else {
      id = (await query(
        `SELECT id FROM evaluations WHERE establishment_id = $1 AND expert_id = $2 AND status = 'draft'`,
        [establishmentId, req.user.id],
      )).rows[0].id;
    }
  }
  const { rows } = await query(`${SELECT_EVAL} WHERE e.id = $1`, [id]);
  res.status(created ? 201 : 200).json({ evaluation: shape(rows[0]), grades: await loadGrades(id) });
}));

// ---- List ---------------------------------------------------------------------
router.get('/', wrap(async (req, res) => {
  const where = [];
  const vals = [];
  if (req.user.role !== 'admin') { vals.push(req.user.id); where.push(`e.expert_id = $${vals.length}`); }
  if (typeof req.query.establishment === 'string') { vals.push(req.query.establishment); where.push(`e.establishment_id = $${vals.length}`); }
  if (['draft', 'finished'].includes(req.query.status)) { vals.push(req.query.status); where.push(`e.status = $${vals.length}`); }
  const { rows } = await query(
    `${SELECT_EVAL} ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY e.updated_at DESC LIMIT 500`,
    vals,
  );
  res.json({ evaluations: rows.map(shape) });
}));

// ---- Admin CSV export (must stay above /:id) -----------------------------------
const csvCell = (v) => {
  let s = v === null || v === undefined ? '' : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`; // stop spreadsheets from running formulas
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

router.get('/export.csv', requireAdmin, wrap(async (_req, res) => {
  const { rows } = await query(`${SELECT_EVAL} ORDER BY e.id`);
  const head = ['id', 'etablissement', 'code_etablissement', 'expert', 'statut', 'score', 'niveau', 'commentaire', 'debut', 'fin'];
  const lines = [head.join(';')].concat(rows.map((e) => [
    e.id, e.establishment_name, e.establishment_id, e.expert_name, e.status, e.final_score,
    e.accreditation_level, e.comment, e.started_at?.toISOString(), e.finished_at?.toISOString(),
  ].map(csvCell).join(';')));
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="evaluations.csv"');
  res.send('﻿' + lines.join('\n'));
}));

// ---- One visit + its grades ------------------------------------------------------
router.get('/:id', wrap(async (req, res) => {
  const ev = await getAccessible(req, res);
  if (!ev) return;
  res.json({ evaluation: shape(ev), grades: await loadGrades(ev.id) });
}));

// ---- Save one grade --------------------------------------------------------------
router.put('/:id/grades/:criterionId', wrap(async (req, res) => {
  const ev = await getAccessible(req, res);
  if (!ev || !requireDraft(ev, res)) return;
  const { criterionId } = req.params;
  const score = req.body?.score;
  if (!CRITERION_IDS.has(criterionId)) return res.status(400).json({ error: 'Critère inconnu' });
  if (typeof score !== 'number' || !Number.isFinite(score) || score < 0 || score > 100) {
    return res.status(400).json({ error: 'Note invalide (0 à 100)' });
  }
  await query(
    `INSERT INTO grades (evaluation_id, criterion_id, score) VALUES ($1, $2, $3)
     ON CONFLICT (evaluation_id, criterion_id) DO UPDATE SET score = EXCLUDED.score, updated_at = now()`,
    [ev.id, criterionId, score],
  );
  await query('UPDATE evaluations SET updated_at = now() WHERE id = $1', [ev.id]);
  res.json({ ok: true });
}));

// ---- Comment ---------------------------------------------------------------------
router.patch('/:id', wrap(async (req, res) => {
  const ev = await getAccessible(req, res);
  if (!ev || !requireDraft(ev, res)) return;
  const { comment } = req.body || {};
  if (typeof comment !== 'string' || comment.length > 5000) {
    return res.status(400).json({ error: 'Commentaire invalide (5000 caractères max)' });
  }
  await query('UPDATE evaluations SET comment = $1, updated_at = now() WHERE id = $2', [comment, ev.id]);
  res.json({ ok: true });
}));

// ---- Finish: server computes the score, then locks the visit --------------------------
router.post('/:id/finish', wrap(async (req, res) => {
  const ev = await getAccessible(req, res);
  if (!ev || !requireDraft(ev, res)) return;
  const score = computeScore(await loadGrades(ev.id));
  await query(
    `UPDATE evaluations SET status = 'finished', final_score = $1, accreditation_level = $2,
       finished_at = now(), updated_at = now() WHERE id = $3`,
    [score, accreditationLevel(score), ev.id],
  );
  const { rows } = await query(`${SELECT_EVAL} WHERE e.id = $1`, [ev.id]);
  res.json({ evaluation: shape(rows[0]), grades: await loadGrades(ev.id) });
}));

// ---- Clear all grades of a draft -------------------------------------------------------
router.post('/:id/reset', wrap(async (req, res) => {
  const ev = await getAccessible(req, res);
  if (!ev || !requireDraft(ev, res)) return;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM grades WHERE evaluation_id = $1', [ev.id]);
    await client.query('UPDATE evaluations SET updated_at = now() WHERE id = $1', [ev.id]);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
  res.json({ ok: true });
}));

// ---- Admin: unlock a finished visit ----------------------------------------------------
router.post('/:id/reopen', requireAdmin, wrap(async (req, res) => {
  const ev = await getAccessible(req, res);
  if (!ev) return;
  try {
    await query(
      `UPDATE evaluations SET status = 'draft', final_score = NULL, accreditation_level = NULL,
         finished_at = NULL, updated_at = now() WHERE id = $1`,
      [ev.id],
    );
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Cet expert a déjà une visite en cours pour cet établissement' });
    throw err;
  }
  res.json({ ok: true });
}));

// ---- Admin: delete a visit (mistakes, test data) -------------------------------------
router.delete('/:id', requireAdmin, wrap(async (req, res) => {
  const ev = await getAccessible(req, res);
  if (!ev) return;
  await query('DELETE FROM evaluations WHERE id = $1', [ev.id]);
  res.json({ ok: true });
}));

export default router;
