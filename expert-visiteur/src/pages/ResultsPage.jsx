import AppHeader from '../components/AppHeader';
import DomainNav from '../components/DomainNav';
import { DOMAINS, ESTABLISHMENTS, computeScore, computeDomainScore, getAccreditationLevel, GRADING } from '../data/referentiel';
import { generatePDF } from '../utils/generatePDF';

const Icon = ({ name, style, className }) => (
  <span className={`material-symbols-outlined ${className || ''}`} style={style}>{name}</span>
);

function RadarChart({ domainScores, size = 360 }) {
  const cx = size / 2, cy = size / 2;
  const n = DOMAINS.length;
  const maxR = size * 0.38;
  const rings = [0.25, 0.5, 0.75, 1.0];

  const getPoint = (idx, r) => {
    const angle = (idx * 2 * Math.PI / n) - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const dataPoints = DOMAINS.map((d, i) => {
    const ds = domainScores[d.id] || { percent: 0 };
    const r = maxR * (ds.percent / 100);
    return getPoint(i, r);
  });

  const polyPoints = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', maxWidth: '100%', margin: '0 auto' }}>
      {/* Concentric rings */}
      {rings.map((r, i) => (
        <circle key={i} cx={cx} cy={cy} r={maxR * r} fill="none" stroke="var(--outline-variant)" strokeWidth="0.5" strokeDasharray="4 4" />
      ))}
      {/* Axis lines */}
      {DOMAINS.map((_, i) => {
        const p = getPoint(i, maxR);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="var(--outline-variant)" strokeWidth="1" />;
      })}
      {/* Data polygon */}
      <polygon points={polyPoints} fill="rgba(243,214,208,0.4)" stroke="var(--primary)" strokeWidth="2" />
      {/* Labels */}
      {DOMAINS.map((d, i) => {
        const p = getPoint(i, maxR * 1.18);
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            style={{ fill: 'var(--on-surface-variant)', fontSize: '9px', fontFamily: 'var(--font-primary)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {d.id}
          </text>
        );
      })}
      {/* Data dots */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill="var(--primary)" opacity={0.8} />
      ))}
    </svg>
  );
}

function RankingList({ scores, currentId }) {
  const ranked = ESTABLISHMENTS
    .map(e => ({ ...e, score: scores[e.id] ?? null }))
    .filter(e => e.score !== null)
    .sort((a, b) => b.score - a.score);

  if (ranked.length === 0) return (
    <div className="font-annotation" style={{ color: 'var(--on-surface-variant)', padding: '16px', fontStyle: 'italic', textAlign: 'center' }}>
      Aucune évaluation complétée pour les autres établissements.
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {ranked.map((e, i) => {
        const level = getAccreditationLevel(e.score);
        const isCurrent = e.id === currentId;
        return (
          <div key={e.id} style={{
            display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px',
            background: isCurrent ? 'var(--primary-container)' : 'var(--surface-container-low)',
            borderRadius: '8px', border: isCurrent ? '1px solid var(--primary)' : '1px solid transparent',
            transition: 'all 0.2s',
          }}>
            <span style={{
              width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: i === 0 ? '#D4AF37' : i === 1 ? '#b0b0b0' : i === 2 ? '#cd7f32' : 'var(--surface-container-highest)',
              color: i < 3 ? 'white' : 'var(--on-surface-variant)',
              fontFamily: 'var(--font-primary)', fontWeight: 700, fontSize: '14px', flexShrink: 0,
            }}>
              {i + 1}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="font-body-md" style={{ fontWeight: 600, color: isCurrent ? 'var(--primary)' : 'var(--on-surface)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {e.name}
              </div>
              <div className="font-annotation" style={{ color: 'var(--on-surface-variant)', fontSize: '12px' }}>
                {e.city} · {e.type}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div className="font-headline-md" style={{ fontSize: '20px', color: 'var(--primary)' }}>{e.score.toFixed(1)}</div>
              <div style={{
                fontFamily: 'var(--font-primary)', fontSize: '10px', fontWeight: 700,
                color: level.textColor, background: level.color, padding: '2px 8px', borderRadius: '999px',
              }}>
                {level.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ResultsPage({ appState, setAppState, handleLogout, navigate, handleReset }) {
  const { grades, establishment, scores } = appState;
  const totalScore = computeScore(grades);
  const level = getAccreditationLevel(totalScore);
  const allScores = establishment ? { ...scores, [establishment.id]: totalScore } : scores;

  const domainScores = {};
  DOMAINS.forEach(d => {
    domainScores[d.id] = computeDomainScore(d.id, grades);
  });

  // Find lowest domain
  let lowestDomain = null, lowestPct = 101;
  DOMAINS.forEach(d => {
    const ds = domainScores[d.id];
    if (ds.percent < lowestPct) { lowestPct = ds.percent; lowestDomain = d; }
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-container-low)' }}>
      <AppHeader appState={appState} handleLogout={handleLogout} navigate={navigate} activePage="results" />
      <DomainNav appState={appState} onDomainSelect={(idx) => { setAppState(s => ({ ...s, currentDomain: idx, currentCriterion: 0 })); navigate('evaluation'); }} activeDomainId={null} />

      <main className="page-container" style={{ paddingTop: '140px', paddingBottom: '80px' }}>
        {/* Score hero */}
        <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '64px', textAlign: 'center' }}>
          <div style={{ position: 'relative', width: '256px', height: '256px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Sunburst background */}
            <div className="sunburst-animate" style={{ position: 'absolute', inset: 0, opacity: 0.15 }}>
              <svg width="100%" height="100%" viewBox="0 0 100 100">
                <path d="M50 0 L52 48 L100 50 L52 52 L50 100 L48 52 L0 50 L48 48 Z" fill="var(--primary)"/>
                <path d="M15 15 L48 48 M85 15 L52 50 M85 85 L50 52 M15 85 L48 50" stroke="var(--primary)" strokeWidth="0.3"/>
              </svg>
            </div>
            {/* Score circle */}
            <div style={{
              position: 'relative', zIndex: 10, width: '192px', height: '192px', borderRadius: '50%',
              border: '2px solid var(--primary)', background: 'white', boxShadow: 'inset 0 2px 16px rgba(111,89,85,0.06)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <span className="font-headline-lg">{totalScore.toFixed(1)} / 100</span>
              <span className="font-label-caps" style={{ color: 'var(--secondary)', marginTop: '4px' }}>{level.label}</span>
              <div style={{
                position: 'absolute', bottom: '-16px',
                background: 'var(--secondary)', color: 'white',
                padding: '4px 16px', borderRadius: '999px',
                fontFamily: 'var(--font-primary)', fontSize: '10px', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase', boxShadow: '0 2px 8px rgba(83,98,83,0.3)',
              }}>
                Score Global
              </div>
            </div>
          </div>

          <div style={{ marginTop: '48px', maxWidth: '560px' }}>
            <h1 className="font-headline-md" style={{ marginBottom: '8px' }}>
              Performance Globale — {establishment?.name}
            </h1>
            <p className="font-body-md" style={{ color: 'var(--on-surface-variant)' }}>
              Analyse consolidée des sept domaines d'évaluation pour l'accréditation Algérienne 2024.
            </p>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => generatePDF(appState)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 24px', background: 'var(--primary)',
                border: 'none', color: 'var(--on-primary)',
                borderRadius: '8px', cursor: 'pointer',
                fontFamily: 'var(--font-primary)', fontSize: '12px', fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase', transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <Icon name="picture_as_pdf" style={{ fontSize: '18px' }} />
              Exporter le rapport PDF
            </button>
            <button
              onClick={handleReset}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 24px', background: 'transparent',
                border: '1px solid var(--error)', color: 'var(--error)',
                borderRadius: '8px', cursor: 'pointer',
                fontFamily: 'var(--font-primary)', fontSize: '12px', fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase', transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--error-container)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <Icon name="restart_alt" style={{ fontSize: '18px' }} />
              Réinitialiser les scores
            </button>
            <button
              onClick={() => navigate('dashboard')}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 24px', background: 'var(--surface-container-highest)',
                border: 'none', color: 'var(--on-surface)',
                borderRadius: '8px', cursor: 'pointer',
                fontFamily: 'var(--font-primary)', fontSize: '12px', fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
              }}
            >
              <Icon name="dashboard" style={{ fontSize: '18px' }} />
              Tableau de bord
            </button>
          </div>
        </section>

        {/* Main content grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'start' }}>
          {/* Radar chart */}
          <div className="sketch-border" style={{ background: 'white', padding: '32px', borderRadius: '8px' }}>
            <h3 className="font-label-caps" style={{ color: 'var(--primary)', marginBottom: '24px' }}>Répartition par Domaines</h3>
            <RadarChart domainScores={domainScores} size={340} />

            {/* Domain scores legend */}
            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {DOMAINS.map(d => {
                const ds = domainScores[d.id];
                return (
                  <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon name={d.icon} style={{ fontSize: '16px', color: 'var(--primary)', width: '20px' }} />
                    <span className="font-annotation" style={{ flex: 1, color: 'var(--on-surface-variant)', fontSize: '12px' }}>{d.shortLabel}</span>
                    <div style={{ width: '80px', height: '4px', background: 'var(--surface-variant)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: ds.percent < 50 ? 'var(--error)' : 'var(--secondary)', width: `${ds.percent}%`, transition: 'width 0.6s' }} />
                    </div>
                    <span className="font-label-caps" style={{ fontSize: '10px', color: 'var(--on-surface-variant)', width: '40px', textAlign: 'right' }}>
                      {ds.earned.toFixed(0)}/{ds.max}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Accreditation status card */}
            <div className="sketch-border" style={{ background: 'var(--surface)', padding: '24px', borderRadius: '8px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, padding: '16px', opacity: 0.08 }}>
                <Icon name="verified" style={{ fontSize: '72px' }} />
              </div>
              <h4 className="font-label-caps" style={{ color: 'var(--primary)', marginBottom: '16px' }}>Statut d'Accréditation</h4>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '28px', fontFamily: 'var(--font-primary)', fontWeight: 500, color: level.textColor }}>{level.label}</span>
                <span className="font-body-md" style={{ color: 'var(--on-surface-variant)', fontSize: '14px' }}>({level.min}–{level.max} pts)</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                {[{ l: 'Excellence', r: '≥ 90 pts' }, { l: 'Accrédité', r: '75–89 pts' }, { l: 'Sous réserve', r: '50–74 pts' }, { l: 'Non accrédité', r: '< 50 pts' }].map(item => (
                  <div key={item.l} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 0', borderBottom: '1px solid var(--outline-variant)',
                    fontFamily: 'var(--font-primary)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em',
                    color: item.l === level.label ? 'var(--primary)' : 'var(--on-surface-variant)',
                    opacity: item.l === level.label ? 1 : 0.5,
                  }}>
                    <span>{item.l}</span>
                    <span>{item.r}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Warning card if critical domain */}
            {lowestDomain && lowestPct < 50 && (
              <div style={{
                background: 'var(--error-container)', color: 'var(--on-error-container)',
                padding: '24px', borderRadius: '8px',
                border: '1px solid rgba(186,26,26,0.2)',
                display: 'flex', gap: '16px', alignItems: 'flex-start',
              }}>
                <Icon name="warning" style={{ color: 'var(--error)', flexShrink: 0 }} />
                <div>
                  <h5 style={{ fontFamily: 'var(--font-primary)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Seuil Critique</h5>
                  <p className="font-body-md" style={{ fontSize: '14px' }}>
                    Le domaine <strong>"{lowestDomain.label}"</strong> est en dessous du seuil critique ({lowestPct}%). Une vigilance particulière est requise.
                  </p>
                </div>
              </div>
            )}

            {/* Ranking */}
            <div style={{ background: 'var(--surface-container-lowest)', borderRadius: '8px', padding: '24px', border: '1px solid var(--outline-variant)' }}>
              <h4 className="font-label-caps" style={{ color: 'var(--primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon name="leaderboard" style={{ fontSize: '18px' }} />
                Classement des Établissements
              </h4>
              <RankingList scores={allScores} currentId={establishment?.id} />
              {Object.keys(allScores).length === 0 && (
                <div className="font-annotation" style={{ color: 'var(--on-surface-variant)', fontStyle: 'italic' }}>
                  Aucun autre établissement évalué encore.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
