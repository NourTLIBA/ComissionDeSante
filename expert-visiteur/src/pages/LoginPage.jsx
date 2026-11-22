import { useState } from 'react';
import coatOfArms from '../assets/coat_of_arms.svg';
import { api, setToken } from '../api';

const Icon = ({ name, style, className }) => (
  <span className={`material-symbols-outlined ${className || ''}`} style={style}>{name}</span>
);

export default function LoginPage({ onLogin }) {
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [waking, setWaking] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id.trim()) { setError('Veuillez saisir votre identifiant.'); return; }
    if (!pass) { setError('Veuillez saisir votre mot de passe.'); return; }
    setError('');
    setLoading(true);
    // The free server sleeps when idle; the first call can take up to a minute.
    const wakeTimer = setTimeout(() => setWaking(true), 4000);
    try {
      const { token, user } = await api('/auth/login', { method: 'POST', body: { login: id.trim(), password: pass } });
      setToken(token);
      onLogin(user);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    } finally {
      clearTimeout(wakeTimer);
      setWaking(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'var(--surface-container-low)',
    }}>
      {/* ── Government identity hero ── */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        marginBottom: '48px', textAlign: 'center', gap: '20px',
      }}>
        {/* Coat of arms */}
        <div style={{
          width: '96px', height: '96px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: '50%',
          background: 'var(--surface-container-highest)',
          border: '1px solid var(--outline-variant)',
        }}>
          <img
            src={coatOfArms}
            alt="Armoiries de la République Algérienne"
            width="64"
            height="64"
            style={{ objectFit: 'contain' }}
          />
        </div>
        <div style={{ lineHeight: 1.6 }}>
          <div style={{
            fontFamily: 'var(--font-primary)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--on-surface-variant)',
          }}>
            République Algérienne Démocratique et Populaire
          </div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            letterSpacing: '0.06em',
            color: 'var(--outline)',
            marginTop: '4px',
          }}>
            Ministère de la Santé · Instance Nationale d’Évaluation
          </div>
        </div>
        <div style={{ width: '128px', height: '1px', background: 'var(--outline-variant)' }} />
      </div>

      <div style={{ position: 'relative', width: '100%', maxWidth: '440px' }}>
        {/* Card */}
        <div className="sketch-border" style={{
          background: 'var(--surface-container-lowest)',
          borderRadius: '12px',
          padding: '40px',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 className="font-headline-lg" style={{ color: 'var(--primary)', marginBottom: '8px' }}>
              Expert Visiteur
            </h1>
            <p className="font-label-caps" style={{ color: 'var(--on-surface-variant)', opacity: 0.7 }}>
              Portail d'Accréditation Médicale
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* ID field */}
            <div className="group" style={{ position: 'relative' }}>
              <label className="font-label-caps" style={{ display: 'block', color: 'var(--primary)', marginBottom: '6px' }}>
                Identifiant Évaluateur
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  value={id}
                  onChange={e => setId(e.target.value)}
                  placeholder="EV-2024-0000"
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid var(--outline-variant)',
                    padding: '12px 4px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '16px',
                    color: 'var(--on-surface)',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--outline-variant)'}
                />
              </div>
            </div>

            {/* Password field */}
            <div style={{ position: 'relative' }}>
              <label className="font-label-caps" style={{ display: 'block', color: 'var(--primary)', marginBottom: '6px' }}>
                Mot de Passe
              </label>
              <input
                type="password"
                value={pass}
                onChange={e => setPass(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid var(--outline-variant)',
                  padding: '12px 4px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '16px',
                  color: 'var(--on-surface)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--outline-variant)'}
              />
            </div>

            <p className="font-annotation" style={{ color: 'var(--on-surface-variant)' }}>
              Compte oublié ou bloqué ? Contactez l'administrateur de la plateforme.
            </p>

            {waking && (
              <div className="font-annotation" style={{ color: 'var(--on-surface-variant)', fontSize: '13px', textAlign: 'center' }}>
                Le serveur se réveille, cela peut prendre jusqu'à une minute…
              </div>
            )}

            {error && (
              <div style={{ color: 'var(--error)', fontFamily: 'var(--font-annotation)', fontSize: '14px', padding: '8px 12px', background: 'var(--error-container)', borderRadius: '6px' }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <div style={{ position: 'relative', paddingTop: '8px' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: loading ? 'var(--outline)' : 'var(--primary)',
                  color: 'var(--on-primary)',
                  border: 'none',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-primary)',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background 0.2s, transform 0.1s',
                }}
              >
                {loading ? (
                  <Icon name="progress_activity" style={{ animation: 'rotate-sunburst 1s linear infinite', fontSize: '20px' }} />
                ) : (
                  'Se connecter'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <p className="font-annotation" style={{ marginTop: '48px', textAlign: 'center', color: 'var(--on-surface-variant)' }}>
        Session sécurisée · Accréditation V2024
      </p>
    </div>
  );
}
