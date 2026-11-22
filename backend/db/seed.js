import bcrypt from 'bcryptjs';
import { pool } from '../src/db.js';
import { ESTABLISHMENTS } from '../src/referentiel.js';

// Hospitals: insert new ones, leave admin edits to existing rows alone.
for (const e of ESTABLISHMENTS) {
  await pool.query(
    `INSERT INTO establishments (id, name, city, wilaya, type, beds, services, code)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (id) DO NOTHING`,
    [e.id, e.name, e.city, e.wilaya, e.type, e.beds, e.services, e.code],
  );
}
console.log(`Hospitals ready (${ESTABLISHMENTS.length})`);

// First admin: only created when no admin exists yet.
const { rowCount } = await pool.query("SELECT 1 FROM users WHERE role = 'admin'");
if (!rowCount) {
  const login = process.env.ADMIN_LOGIN || 'admin';
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password.length < 8) {
    console.error('ADMIN_PASSWORD (8+ characters) is required to create the first admin');
    process.exit(1);
  }
  await pool.query(
    `INSERT INTO users (login, full_name, password_hash, role, must_change_password)
     VALUES ($1, $2, $3, 'admin', TRUE)`,
    [login, 'Administrateur', await bcrypt.hash(password, 12)],
  );
  console.log(`First admin created: ${login} (must change password at first login)`);
}
await pool.end();
