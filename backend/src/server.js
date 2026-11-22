import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './config.js';
import { query } from './db.js';
import { requireAuth, wrap } from './auth.js';
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import establishmentsRoutes from './routes/establishments.routes.js';
import evaluationsRoutes from './routes/evaluations.routes.js';

const app = express();
app.set('trust proxy', 1); // behind Render / Caddy / Nginx: real client IP for rate limits
app.use(helmet());
app.use(cors({
  origin(origin, cb) {
    // no Origin header = curl / health checks; otherwise it must be listed in CORS_ORIGIN
    if (!origin || config.corsOrigins.includes(origin)) return cb(null, true);
    cb(null, false);
  },
  maxAge: 86400,
}));
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', wrap(async (_req, res) => {
  await query('SELECT 1');
  res.json({ status: 'ok' });
}));

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/establishments', establishmentsRoutes);
app.use('/api/evaluations', evaluationsRoutes);

// Latest finished visit score per hospital -> { "CHU-ORAN": 78.5, ... }
app.get('/api/rankings', requireAuth, wrap(async (_req, res) => {
  const { rows } = await query(
    `SELECT DISTINCT ON (establishment_id) establishment_id, final_score
     FROM evaluations WHERE status = 'finished'
     ORDER BY establishment_id, finished_at DESC`,
  );
  res.json({ scores: Object.fromEntries(rows.map((r) => [r.establishment_id, r.final_score])) });
}));

app.use('/api', (_req, res) => res.status(404).json({ error: 'Route inconnue' }));

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'JSON invalide' });
  console.error(err);
  res.status(500).json({ error: 'Erreur serveur' });
});

app.listen(config.port, () => console.log(`API listening on :${config.port}`));
