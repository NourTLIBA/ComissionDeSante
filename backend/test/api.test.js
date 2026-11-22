// Light edge-case checks. Works against any running API (local or deployed):
//   API_URL=https://xxx.onrender.com ADMIN_LOGIN=admin ADMIN_PASSWORD=... npm test
// It creates its own throwaway expert + hospital and deletes what it can afterwards.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { computeScore, accreditationLevel } from '../src/scoring.js';
import { DOMAINS } from '../src/referentiel.js';

const API = `${(process.env.API_URL || 'http://localhost:3000').replace(/\/$/, '')}/api`;
const ADMIN_LOGIN = process.env.ADMIN_LOGIN || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const CRITERIA = DOMAINS.flatMap((d) => d.criteria.map((c) => c.id));

const call = async (method, path, body, token, raw) => {
  const res = await fetch(API + path, {
    method,
    headers: { ...(raw === undefined && body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: raw !== undefined ? raw : body !== undefined ? JSON.stringify(body) : undefined,
  });
  let json = null;
  try { json = await res.json(); } catch { /* empty */ }
  return { status: res.status, json };
};

const tag = randomBytes(3).toString('hex').toUpperCase();
const HOSPITAL = `ZZ-TEST-${tag}`;
const created = { evaluations: [], users: [] };
let admin;
let expert;
let other;

async function newExpert(name) {
  const login = `zz-test-${name}-${tag}`;
  const password = `pw-${randomBytes(6).toString('hex')}`;
  const r = await call('POST', '/users', { login, name: `Test ${name}`, password }, admin);
  assert.equal(r.status, 201, JSON.stringify(r.json));
  created.users.push(r.json.user.id);
  const l = await call('POST', '/auth/login', { login, password });
  assert.equal(l.status, 200);
  return l.json.token;
}

async function startVisit(token = expert) {
  const r = await call('POST', '/evaluations', { establishmentId: HOSPITAL }, token);
  assert.ok([200, 201].includes(r.status), JSON.stringify(r.json));
  if (r.status === 201) created.evaluations.push(r.json.evaluation.id);
  return r.json.evaluation.id;
}

before(async () => {
  assert.ok(ADMIN_PASSWORD, 'set ADMIN_PASSWORD (the current admin password)');
  const l = await call('POST', '/auth/login', { login: ADMIN_LOGIN, password: ADMIN_PASSWORD });
  assert.equal(l.status, 200, `admin login failed: ${JSON.stringify(l.json)}`);
  assert.equal(l.json.user.mustChangePassword, false, 'log in once on the site and change the temporary admin password first');
  admin = l.json.token;
  const h = await call('POST', '/establishments', { id: HOSPITAL, name: 'Hôpital de test' }, admin);
  assert.equal(h.status, 201, JSON.stringify(h.json));
  expert = await newExpert('a');
  other = await newExpert('b');
});

after(async () => {
  for (const id of created.evaluations) await call('DELETE', `/evaluations/${id}`, undefined, admin);
  await call('DELETE', `/establishments/${HOSPITAL}`, undefined, admin);
  for (const id of created.users) await call('PATCH', `/users/${id}`, { active: false }, admin);
});

// ---- scoring (no network) ---------------------------------------------------------------
test('weights add up to 100 and all-A / all-D give 100 / 0', () => {
  assert.equal(CRITERIA.length, 44);
  assert.equal(computeScore(Object.fromEntries(CRITERIA.map((c) => [c, 100]))), 100);
  assert.equal(computeScore(Object.fromEntries(CRITERIA.map((c) => [c, 0]))), 0);
  assert.equal(computeScore({}), 0);
});

test('accreditation level boundaries, including the 89–90 gap', () => {
  const cases = [[100, 'Excellence'], [90, 'Excellence'], [89.9, 'Accrédité'], [89.5, 'Accrédité'], [75, 'Accrédité'],
    [74.9, 'Sous réserve'], [50, 'Sous réserve'], [49.9, 'Non accrédité'], [0, 'Non accrédité']];
  for (const [score, level] of cases) assert.equal(accreditationLevel(score), level, `score ${score}`);
});

// ---- access rules ---------------------------------------------------------------------------
test('no token, garbage token and expert-on-admin routes are refused', async () => {
  assert.equal((await call('GET', '/evaluations')).status, 401);
  assert.equal((await call('GET', '/evaluations', undefined, 'garbage')).status, 401);
  assert.equal((await call('GET', '/users', undefined, expert)).status, 403);
  assert.equal((await call('GET', '/evaluations/export.csv', undefined, expert)).status, 403);
});

test('bad requests never crash the server', async () => {
  assert.equal((await call('POST', '/auth/login', undefined, undefined, '{not json')).status, 400);
  assert.equal((await call('POST', '/auth/login', {})).status, 400);
  assert.equal((await call('POST', '/auth/login', { login: { $ne: 1 }, password: [] })).status, 400);
  assert.equal((await call('POST', '/evaluations', { establishmentId: 5 }, expert)).status, 400);
  assert.equal((await call('POST', '/evaluations', { establishmentId: 'NOPE' }, expert)).status, 404);
  assert.equal((await call('GET', '/evaluations/abc', undefined, expert)).status, 400);
  assert.equal((await call('GET', '/evaluations/99999999999', undefined, expert)).status, 400);
  assert.equal((await call('GET', '/evaluations/999999', undefined, expert)).status, 404);
  assert.equal((await call('GET', '/nope', undefined, expert)).status, 404);
  assert.equal((await call('POST', '/auth/login', { login: 'a'.repeat(200_000), password: 'x' })).status, 413);
  assert.equal((await call('GET', '/health')).status, 200); // still alive
});

// ---- grading edge cases ---------------------------------------------------------------------
test('grade values: bad ones refused, boundary ones accepted', async () => {
  const id = await startVisit();
  const put = (score) => call('PUT', `/evaluations/${id}/grades/D1C1`, { score }, expert);
  for (const bad of [-1, -0.01, 100.01, 101, 'x', '50', null, true, [], {}]) {
    assert.equal((await put(bad)).status, 400, `score ${JSON.stringify(bad)} should be refused`);
  }
  assert.equal((await call('PUT', `/evaluations/${id}/grades/D1C1`, undefined, expert)).status, 400);
  assert.equal((await call('PUT', `/evaluations/${id}/grades/NOPE`, { score: 50 }, expert)).status, 400);
  assert.equal((await call('PUT', `/evaluations/${id}/grades/D1C1`, undefined, expert, '{"score":NaN}')).status, 400);
  for (const good of [0, 100, 0.01, 33.333, 99.999, 50]) {
    assert.equal((await put(good)).status, 200, `score ${good} should be accepted`);
  }
  const got = await call('GET', `/evaluations/${id}`, undefined, expert);
  assert.equal(got.json.grades.D1C1, 50); // last write wins
});

test('comment limits', async () => {
  const id = await startVisit();
  assert.equal((await call('PATCH', `/evaluations/${id}`, { comment: 'é'.repeat(5000) }, expert)).status, 200);
  assert.equal((await call('PATCH', `/evaluations/${id}`, { comment: 'x'.repeat(5001) }, expert)).status, 400);
  assert.equal((await call('PATCH', `/evaluations/${id}`, { comment: 42 }, expert)).status, 400);
});

test('another expert cannot see or change my visit', async () => {
  const id = await startVisit();
  assert.equal((await call('GET', `/evaluations/${id}`, undefined, other)).status, 404);
  assert.equal((await call('PUT', `/evaluations/${id}/grades/D1C1`, { score: 10 }, other)).status, 404);
  assert.equal((await call('POST', `/evaluations/${id}/finish`, undefined, other)).status, 404);
});

test('concurrency: parallel starts give one visit, parallel writes do not fail', async () => {
  const ids = await Promise.all(Array.from({ length: 6 }, () => startVisit(other)));
  assert.equal(new Set(ids).size, 1, `got ${[...new Set(ids)]}`);
  const id = ids[0];
  const writes = await Promise.all(Array.from({ length: 10 }, (_, i) => call('PUT', `/evaluations/${id}/grades/D1C2`, { score: i * 10 }, other)));
  assert.ok(writes.every((w) => w.status === 200));
  const got = await call('GET', `/evaluations/${id}`, undefined, other);
  assert.equal(Object.keys(got.json.grades).length, 1);
});

test('full visit: all A = 100 / Excellence, then lock, reopen and reset rules', async () => {
  const id = await startVisit();
  await Promise.all(CRITERIA.map((c) => call('PUT', `/evaluations/${id}/grades/${c}`, { score: 100 }, expert)));
  const fin = await call('POST', `/evaluations/${id}/finish`, undefined, expert);
  assert.equal(fin.status, 200);
  assert.equal(fin.json.evaluation.finalScore, 100);
  assert.equal(fin.json.evaluation.accreditationLevel, 'Excellence');
  assert.equal(Object.keys(fin.json.grades).length, 44);

  // locked
  assert.equal((await call('POST', `/evaluations/${id}/finish`, undefined, expert)).status, 409);
  assert.equal((await call('PUT', `/evaluations/${id}/grades/D1C1`, { score: 0 }, expert)).status, 409);
  assert.equal((await call('PATCH', `/evaluations/${id}`, { comment: 'x' }, expert)).status, 409);
  assert.equal((await call('POST', `/evaluations/${id}/reset`, undefined, expert)).status, 409);
  assert.equal((await call('POST', `/evaluations/${id}/reopen`, undefined, expert)).status, 403);

  // ranking shows the closed score
  const rank = await call('GET', '/rankings', undefined, expert);
  assert.equal(rank.json.scores[HOSPITAL], 100);

  // a new draft for the same hospital is allowed, then reopening the old one must be a clean 409
  const second = await startVisit();
  assert.notEqual(second, id);
  assert.equal((await call('POST', `/evaluations/${id}/reopen`, undefined, admin)).status, 409);

  // empty visit closes at 0
  const empty = await call('POST', `/evaluations/${second}/finish`, undefined, expert);
  assert.equal(empty.json.evaluation.finalScore, 0);
  assert.equal(empty.json.evaluation.accreditationLevel, 'Non accrédité');

  // admin can reopen once no draft is open
  assert.equal((await call('POST', `/evaluations/${id}/reopen`, undefined, admin)).status, 200);
  const reopened = await call('GET', `/evaluations/${id}`, undefined, expert);
  assert.equal(reopened.json.evaluation.status, 'draft');
  assert.equal(reopened.json.evaluation.finalScore, null);
  assert.equal((await call('POST', `/evaluations/${id}/reset`, undefined, expert)).status, 200);
  assert.deepEqual((await call('GET', `/evaluations/${id}`, undefined, expert)).json.grades, {});
});

test('a disabled account is cut off at once', async () => {
  const token = await newExpert('c');
  assert.equal((await call('GET', '/auth/me', undefined, token)).status, 200);
  const users = (await call('GET', '/users', undefined, admin)).json.users;
  const me = users.find((u) => u.login === `zz-test-c-${tag}`);
  assert.equal((await call('PATCH', `/users/${me.id}`, { active: false }, admin)).status, 200);
  assert.equal((await call('GET', '/auth/me', undefined, token)).status, 401);
});
