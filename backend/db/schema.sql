-- Safe to run many times (everything is IF NOT EXISTS).

CREATE TABLE IF NOT EXISTS users (
  id                    SERIAL PRIMARY KEY,
  login                 TEXT NOT NULL,
  full_name             TEXT NOT NULL,
  password_hash         TEXT NOT NULL,
  role                  TEXT NOT NULL DEFAULT 'expert' CHECK (role IN ('admin', 'expert')),
  active                BOOLEAN NOT NULL DEFAULT TRUE,
  must_change_password  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS users_login_lower_idx ON users (lower(login));

CREATE TABLE IF NOT EXISTS establishments (
  id        TEXT PRIMARY KEY,
  name      TEXT NOT NULL,
  city      TEXT,
  wilaya    TEXT,
  type      TEXT,
  beds      INTEGER,
  services  INTEGER,
  code      TEXT
);

CREATE TABLE IF NOT EXISTS evaluations (
  id                   SERIAL PRIMARY KEY,
  establishment_id     TEXT NOT NULL REFERENCES establishments(id),
  expert_id            INTEGER NOT NULL REFERENCES users(id),
  status               TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'finished')),
  final_score          NUMERIC(5,1),
  accreditation_level  TEXT,
  comment              TEXT NOT NULL DEFAULT '',
  started_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at          TIMESTAMPTZ,
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS evaluations_expert_idx ON evaluations (expert_id);
CREATE INDEX IF NOT EXISTS evaluations_est_idx ON evaluations (establishment_id);

CREATE TABLE IF NOT EXISTS grades (
  evaluation_id  INTEGER NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
  criterion_id   TEXT NOT NULL,
  score          NUMERIC(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (evaluation_id, criterion_id)
);
