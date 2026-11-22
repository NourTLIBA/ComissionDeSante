import coatOfArms from '../assets/coat_of_arms.svg';

const Icon = ({ name, style, className }) => (
  <span className={`material-symbols-outlined ${className || ''}`} style={style}>{name}</span>
);

export default function AppHeader({ appState, handleLogout, navigate, activePage }) {
  const { user, establishment } = appState;

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'var(--background)',
    }}>
      {/* ── App nav bar ─────────────────────────────────────────── */}
      <div style={{
        maxWidth: '1280px', margin: '0 auto', padding: '0 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px',
        borderBottom: '1px solid var(--outline-variant)',
      }}>
        {/* Brand + gov identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Coat of arms */}
          <button
            onClick={() => navigate(establishment ? 'dashboard' : 'config')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <img
              src={coatOfArms}
              alt="Armoiries de la République Algérienne"
              width="30"
              height="30"
              style={{ objectFit: 'contain', flexShrink: 0, opacity: 0.85 }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.25 }}>
              <span className="font-headline-lg" style={{ color: 'var(--primary)', fontSize: '16px', letterSpacing: '0.12em', whiteSpace: 'nowrap' }}>
                Expert Visiteur
              </span>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '9px',
                letterSpacing: '0.06em',
                color: 'var(--outline)',
                whiteSpace: 'nowrap',
              }}>
                Ministère de la Santé · Instance Nationale d'Évaluation
              </span>
            </div>
          </button>

          <div style={{ width: '1px', height: '28px', background: 'var(--outline-variant)', marginLeft: '4px' }} />

          <nav style={{ display: 'flex', gap: '24px' }}>
            {[
              { id: 'config',     label: 'Visite',    page: 'config' },
              { id: 'dashboard',  label: 'Domaines',  page: 'dashboard' },
              { id: 'evaluation', label: 'Critères',  page: 'evaluation' },
              { id: 'results',    label: 'Résultats', page: 'results' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => establishment ? navigate(item.page) : null}
                className={`font-label-caps nav-link ${activePage === item.id ? 'active' : ''}`}
                style={{
                  background: 'none', border: 'none', cursor: establishment ? 'pointer' : 'default',
                  color: activePage === item.id ? 'var(--primary)' : 'var(--on-surface-variant)',
                  borderBottom: activePage === item.id ? '2px solid var(--primary)' : '2px solid transparent',
                  paddingBottom: '4px',
                  opacity: (!establishment && item.id !== 'config') ? 0.4 : 1,
                  transition: 'color 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {establishment && (
            <div style={{
              background: 'var(--primary-container)', color: 'var(--on-primary-container)',
              padding: '4px 12px', borderRadius: '999px',
              fontFamily: 'var(--font-primary)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em',
              maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              display: 'none',
            }}
              id="est-badge"
            >
              {establishment.name}
            </div>
          )}
          {user?.role === 'admin' && (
            <button
              onClick={() => navigate('admin')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: activePage === 'admin' ? 'var(--primary)' : 'var(--on-surface-variant)' }}
              title="Administration"
            >
              <Icon name="admin_panel_settings" style={{ fontSize: '24px' }} />
            </button>
          )}
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)', display: 'flex', alignItems: 'center', gap: '4px' }}
            title={user ? `Connecté : ${user.name}` : ''}
          >
            <Icon name="account_circle" style={{ fontSize: '24px' }} />
          </button>
          <button
            onClick={handleLogout}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)' }}
            title="Se déconnecter"
          >
            <Icon name="logout" style={{ fontSize: '22px' }} />
          </button>
        </div>
      </div>

      {/* Inline responsive styles */}
      <style>{`
        .nav-link { display: none !important; }
        @media (min-width: 768px) { .nav-link { display: block !important; } }
        #est-badge { display: none !important; }
        @media (min-width: 900px) { #est-badge { display: block !important; } }
      `}</style>
    </header>
  );
}
