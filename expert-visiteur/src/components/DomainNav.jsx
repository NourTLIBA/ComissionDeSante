import { DOMAINS, computeDomainScore } from '../data/referentiel';

const Icon = ({ name, style }) => (
  <span className="material-symbols-outlined" style={style}>{name}</span>
);

export default function DomainNav({ appState, onDomainSelect, activeDomainId }) {
  const { grades } = appState;

  return (
    <div style={{
      position: 'fixed', top: '64px', left: 0, right: 0, zIndex: 40,
      background: 'var(--surface-container-low)',
      borderBottom: '1px solid var(--outline-variant)',
      boxShadow: '0 2px 8px rgba(111,89,85,0.06)',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <nav style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '12px 0', overflowX: 'auto',
        }}
          className="no-scrollbar"
        >
          {DOMAINS.map((domain, idx) => {
            const ds = computeDomainScore(domain.id, grades);
            const isActive = domain.id === activeDomainId;
            const isCompleted = domain.criteria.every(c => grades[c.id]);

            return (
              <button
                key={domain.id}
                onClick={() => onDomainSelect(idx)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 16px',
                  background: isActive ? 'var(--primary-container)' : 'transparent',
                  color: isActive ? 'var(--on-primary-container)' : 'var(--on-surface-variant)',
                  border: 'none', borderRadius: '8px',
                  cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap',
                  fontWeight: isActive ? 700 : 400,
                  transition: 'all 0.15s',
                  position: 'relative',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--surface-container-highest)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon name={domain.icon} style={{ fontSize: '18px', color: isActive ? 'var(--on-primary-container)' : 'var(--on-surface-variant)' }} />
                <span style={{ fontFamily: 'var(--font-primary)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  {domain.shortLabel}
                </span>
                {isCompleted && (
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#5a9455', display: 'inline-block', marginLeft: '2px' }} />
                )}
                {ds.percent > 0 && !isCompleted && (
                  <span style={{ fontFamily: 'var(--font-primary)', fontSize: '9px', fontWeight: 700, opacity: 0.6 }}>
                    {ds.percent}%
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
