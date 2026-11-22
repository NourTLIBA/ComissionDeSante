import { useState, useEffect, useCallback } from 'react';
import AppHeader from '../components/AppHeader';
import { api, downloadEvaluationsCsv } from '../api';

const Icon = ({ name, style }) => (
  <span className="material-symbols-outlined" style={style}>{name}</span>
);

const card = {
  background: 'var(--surface-container-lowest)',
  border: '1px solid var(--outline-variant)',
  borderRadius: '12px',
  padding: '24px',
};
const th = {
  textAlign: 'left', padding: '10px 12px', fontFamily: 'var(--font-primary)', fontSize: '11px',
  letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--on-surface-variant)',
  borderBottom: '1px solid var(--outline-variant)', whiteSpace: 'nowrap',
};
const td = { padding: '10px 12px', fontFamily: 'var(--font-body)', fontSize: '14px', borderBottom: '1px solid var(--outline-variant)' };
const input = {
  padding: '10px 12px', border: '1px solid var(--outline-variant)', borderRadius: '6px',
  background: 'transparent', color: 'var(--on-surface)', fontFamily: 'var(--font-body)', fontSize: '14px', minWidth: 0,
};
const smallBtn = {
  background: 'none', border: '1px solid var(--outline-variant)', borderRadius: '6px', cursor: 'pointer',
  padding: '4px 10px', color: 'var(--on-surface-variant)', fontFamily: 'var(--font-annotation)', fontSize: '12px',
};
const primaryBtn = {
  padding: '10px 20px', background: 'var(--primary)', color: 'var(--on-primary)', border: 'none',
  borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-primary)', fontSize: '12px',
  fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
  display: 'flex', alignItems: 'center', gap: '8px',
};

const fmtDate = (d) => (d ? new Date(d).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : '—');

function UsersTab({ me }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ login: '', name: '', password: '', role: 'expert' });

  const load = useCallback(() => {
    api('/users').then((r) => setUsers(r.users)).catch((e) => setError(e.message));
  }, []);
  useEffect(load, [load]);

  const act = async (fn) => {
    setError('');
    try { await fn(); load(); } catch (e) { setError(e.message); }
  };

  const create = (e) => {
    e.preventDefault();
    act(async () => {
      await api('/users', { method: 'POST', body: form });
      setForm({ login: '', name: '', password: '', role: 'expert' });
    });
  };

  const resetPassword = (u) => {
    const password = window.prompt(`Nouveau mot de passe temporaire pour ${u.login} (8 caractères minimum) :`);
    if (password) act(() => api(`/users/${u.id}`, { method: 'PATCH', body: { password } }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <form onSubmit={create} style={{ ...card, display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 140px' }}>
          <label className="font-label-caps" style={{ display: 'block', marginBottom: '4px' }}>Identifiant</label>
          <input required style={{ ...input, width: '100%' }} placeholder="EV-2026-0001" value={form.login} onChange={(e) => setForm({ ...form, login: e.target.value })} />
        </div>
        <div style={{ flex: '2 1 200px' }}>
          <label className="font-label-caps" style={{ display: 'block', marginBottom: '4px' }}>Nom complet</label>
          <input required style={{ ...input, width: '100%' }} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div style={{ flex: '1 1 160px' }}>
          <label className="font-label-caps" style={{ display: 'block', marginBottom: '4px' }}>Mot de passe temporaire</label>
          <input required minLength={8} type="text" autoComplete="off" style={{ ...input, width: '100%' }} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <div>
          <label className="font-label-caps" style={{ display: 'block', marginBottom: '4px' }}>Rôle</label>
          <select style={input} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="expert">Expert</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>
        <button type="submit" style={primaryBtn}><Icon name="person_add" style={{ fontSize: '18px' }} />Créer</button>
      </form>

      {error && (
        <div style={{ color: 'var(--error)', background: 'var(--error-container)', padding: '8px 12px', borderRadius: '6px', fontFamily: 'var(--font-annotation)' }}>{error}</div>
      )}

      <div style={{ ...card, padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr><th style={th}>Identifiant</th><th style={th}>Nom</th><th style={th}>Rôle</th><th style={th}>Statut</th><th style={th}></th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ opacity: u.active ? 1 : 0.55 }}>
                <td style={td}>{u.login}</td>
                <td style={td}>{u.name}{u.mustChangePassword ? <span className="font-annotation" style={{ marginLeft: '8px', color: 'var(--outline)' }}>(mot de passe temporaire)</span> : null}</td>
                <td style={td}>{u.role === 'admin' ? 'Administrateur' : 'Expert'}</td>
                <td style={td}>{u.active ? 'Actif' : 'Désactivé'}</td>
                <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <button style={smallBtn} onClick={() => resetPassword(u)}>Mot de passe</button>{' '}
                  {u.id !== me.id && (
                    <>
                      <button style={smallBtn} onClick={() => act(() => api(`/users/${u.id}`, { method: 'PATCH', body: { role: u.role === 'admin' ? 'expert' : 'admin' } }))}>
                        {u.role === 'admin' ? 'Rendre expert' : 'Rendre admin'}
                      </button>{' '}
                      <button style={smallBtn} onClick={() => act(() => api(`/users/${u.id}`, { method: 'PATCH', body: { active: !u.active } }))}>
                        {u.active ? 'Désactiver' : 'Réactiver'}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function VisitsTab() {
  const [visits, setVisits] = useState([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(() => {
    api(`/evaluations${status ? `?status=${status}` : ''}`)
      .then((r) => setVisits(r.evaluations))
      .catch((e) => setError(e.message));
  }, [status]);
  useEffect(load, [load]);

  const reopen = async (v) => {
    if (!window.confirm(`Rouvrir la visite de ${v.establishmentName} ? Le score officiel sera effacé jusqu'à une nouvelle clôture.`)) return;
    try { await api(`/evaluations/${v.id}/reopen`, { method: 'POST' }); load(); } catch (e) { setError(e.message); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <select style={input} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Toutes les visites</option>
          <option value="draft">En cours</option>
          <option value="finished">Clôturées</option>
        </select>
        <button style={primaryBtn} onClick={() => downloadEvaluationsCsv().catch((e) => setError(e.message))}>
          <Icon name="download" style={{ fontSize: '18px' }} />Exporter CSV
        </button>
      </div>
      {error && (
        <div style={{ color: 'var(--error)', background: 'var(--error-container)', padding: '8px 12px', borderRadius: '6px', fontFamily: 'var(--font-annotation)' }}>{error}</div>
      )}
      <div style={{ ...card, padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr><th style={th}>Établissement</th><th style={th}>Expert</th><th style={th}>Statut</th><th style={th}>Score</th><th style={th}>Niveau</th><th style={th}>Mise à jour</th><th style={th}></th></tr>
          </thead>
          <tbody>
            {visits.length === 0 && (
              <tr><td style={{ ...td, color: 'var(--on-surface-variant)' }} colSpan={7}>Aucune visite.</td></tr>
            )}
            {visits.map((v) => (
              <tr key={v.id}>
                <td style={td}>{v.establishmentName}</td>
                <td style={td}>{v.expertName}</td>
                <td style={td}>{v.status === 'finished' ? 'Clôturée' : 'En cours'}</td>
                <td style={td}>{v.finalScore ?? '—'}</td>
                <td style={td}>{v.accreditationLevel ?? '—'}</td>
                <td style={td}>{fmtDate(v.updatedAt)}</td>
                <td style={{ ...td, textAlign: 'right' }}>
                  {v.status === 'finished' && <button style={smallBtn} onClick={() => reopen(v)}>Rouvrir</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminPage({ appState, handleLogout, navigate }) {
  const [tab, setTab] = useState('users');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-container-low)' }}>
      <AppHeader appState={appState} handleLogout={handleLogout} navigate={navigate} activePage="admin" />
      <main className="page-container" style={{ paddingTop: '88px', paddingBottom: '80px' }}>
        <h1 className="font-headline-lg" style={{ color: 'var(--primary)', marginBottom: '20px' }}>Administration</h1>
        <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', borderBottom: '1px solid var(--outline-variant)' }}>
          {[['users', 'Comptes'], ['visits', 'Visites']].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="font-label-caps"
              style={{
                background: 'none', border: 'none', cursor: 'pointer', paddingBottom: '8px',
                color: tab === id ? 'var(--primary)' : 'var(--on-surface-variant)',
                borderBottom: tab === id ? '2px solid var(--primary)' : '2px solid transparent',
              }}
            >
              {label}
            </button>
          ))}
        </div>
        {tab === 'users' ? <UsersTab me={appState.user} /> : <VisitsTab />}
      </main>
    </div>
  );
}
