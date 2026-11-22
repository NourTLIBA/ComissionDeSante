import { useState } from 'react';
import coatOfArms from '../assets/coat_of_arms.svg';
import { api } from '../api';

const fieldStyle = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid var(--outline-variant)',
  padding: '12px 4px',
  fontFamily: 'var(--font-body)',
  fontSize: '16px',
  color: 'var(--on-surface)',
  outline: 'none',
};

const labelStyle = { display: 'block', color: 'var(--primary)', marginBottom: '6px' };

// Shown right after login when the account still has a temporary password.
export default function ChangePasswordPage({ user, onDone, onLogout }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (next.length < 8) { setError('Le nouveau mot de passe doit contenir au moins 8 caractères.'); return; }
    if (next !== confirm) { setError('Les deux mots de passe ne sont pas identiques.'); return; }
    if (next === current) { setError('Le nouveau mot de passe doit être différent de l’ancien.'); return; }
    setError('');
    setLoading(true);
    try {
      const { user: updated } = await api('/auth/change-password', {
        method: 'POST',
        body: { currentPassword: current, newPassword: next },
      });
      onDone(updated);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '24px', background: 'var(--surface-container-low)',
    }}>
      <img src={coatOfArms} alt="Armoiries de la République Algérienne" width="64" height="64" style={{ marginBottom: '24px' }} />
      <div className="sketch-border" style={{
        width: '100%', maxWidth: '440px', background: 'var(--surface-container-lowest)',
        borderRadius: '12px', padding: '40px',
      }}>
        <h1 className="font-headline-lg" style={{ color: 'var(--primary)', textAlign: 'center', marginBottom: '8px' }}>
          Nouveau mot de passe
        </h1>
        <p className="font-annotation" style={{ color: 'var(--on-surface-variant)', textAlign: 'center', marginBottom: '28px' }}>
          {user?.name}, votre mot de passe est temporaire. Choisissez-en un nouveau pour continuer.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div>
            <label className="font-label-caps" style={labelStyle}>Mot de passe actuel</label>
            <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" style={fieldStyle} />
          </div>
          <div>
            <label className="font-label-caps" style={labelStyle}>Nouveau mot de passe</label>
            <input type="password" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" style={fieldStyle} />
          </div>
          <div>
            <label className="font-label-caps" style={labelStyle}>Confirmer</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" style={fieldStyle} />
          </div>

          {error && (
            <div style={{ color: 'var(--error)', fontFamily: 'var(--font-annotation)', fontSize: '14px', padding: '8px 12px', background: 'var(--error-container)', borderRadius: '6px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '16px', border: 'none', borderRadius: '8px',
              background: loading ? 'var(--outline)' : 'var(--primary)', color: 'var(--on-primary)',
              fontFamily: 'var(--font-primary)', fontSize: '12px', fontWeight: 700,
              letterSpacing: '0.15em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            Enregistrer et continuer
          </button>
          <button
            type="button"
            onClick={onLogout}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)', fontFamily: 'var(--font-annotation)', fontSize: '13px', textDecoration: 'underline' }}
          >
            Se déconnecter
          </button>
        </form>
      </div>
    </div>
  );
}
