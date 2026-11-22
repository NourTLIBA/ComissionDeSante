import { useState } from 'react';
import AppHeader from '../components/AppHeader';
import DomainNav from '../components/DomainNav';
import { DOMAINS, computeScore, computeDomainScore } from '../data/referentiel';

const Icon = ({ name, style, className }) => (
  <span className={`material-symbols-outlined ${className || ''}`} style={style}>{name}</span>
);

/* ── Info tooltip for domains ──────────────────────────────── */
function DomainInfoTooltip({ domain }) {
  const [visible, setVisible] = useState(false);
  const obligatoryCount = domain.criteria.filter(c => c.type === 'Obligatoire').length;

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      tabIndex={0}
      onClick={e => e.stopPropagation()}
      aria-label={`Informations sur le domaine ${domain.id}`}
    >
      <Icon
        name="info"
        style={{
          fontSize: '16px',
          color: 'var(--outline)',
          cursor: 'help',
          fontVariationSettings: "'FILL' 1",
        }}
      />
      {visible && (
        <div
          role="tooltip"
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--inverse-surface)',
            color: 'var(--surface)',
            fontSize: '11px',
            lineHeight: 1.5,
            padding: '14px',
            borderRadius: '12px',
            width: '320px',
            maxHeight: '340px',
            overflowY: 'auto',
            textAlign: 'left',
            fontFamily: 'var(--font-body)',
            pointerEvents: 'none',
            zIndex: 250,
            whiteSpace: 'normal',
            border: '1px solid var(--outline-variant)',
          }}
        >
          <div style={{ fontWeight: 700, fontFamily: 'var(--font-primary)', color: 'var(--warm-gold)', fontSize: '12px', marginBottom: '2px' }}>
            {domain.id} — {domain.label} ({domain.weight} pts)
          </div>
          <div style={{ fontSize: '10px', color: 'var(--surface-variant)', marginBottom: '10px' }}>
            {domain.criteria.length} critères ({obligatoryCount} obligatoires)
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {domain.criteria.map(c => (
              <div key={c.id} style={{ borderLeft: '2px solid rgba(255,255,255,0.25)', padding: '2px 8px' }}>
                <div style={{ fontWeight: 700, color: 'var(--sage)', fontSize: '11px' }}>
                  Critère {c.num}: {c.label} ({c.type})
                </div>
                {c.directive && (
                  <div style={{ fontSize: '10px', color: 'var(--powder-blue)', marginTop: '1px' }}>
                    {c.directive}
                  </div>
                )}
                {c.evidence && (
                  <div style={{ fontSize: '10px', color: 'var(--surface)', marginTop: '3px', opacity: 0.9 }}>
                    Preuves : {c.evidence.slice(0, 110)}…
                  </div>
                )}
              </div>
            ))}
          </div>
          <span style={{
            position: 'absolute',
            top: '100%', left: '50%',
            transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid var(--inverse-surface)',
          }} />
        </div>
      )}
    </span>
  );
}

function CircleProgress({ percent, size = 48, strokeWidth = 4, color = 'var(--secondary)' }) {
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', display: 'block' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--surface-variant)" strokeWidth={strokeWidth} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
    </svg>
  );
}

export default function DashboardPage({ appState, setAppState, handleLogout, navigate, onDomainSelect, onFinish, handleReset, handleComment }) {
  const [isCommentModalOpen, setCommentModalOpen] = useState(false);
  const [commentText, setCommentText] = useState(appState.comment || "");

  const { grades, establishment } = appState;
  const totalScore = computeScore(grades);
  const totalCriteria = DOMAINS.reduce((a, d) => a + d.criteria.length, 0);
  const gradedCount = Object.keys(grades).length;
  const globalPercent = Math.round((gradedCount / totalCriteria) * 100);

  const handleGoResults = () => {
    onFinish(totalScore);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-container-low)' }}>
      <AppHeader appState={appState} handleLogout={handleLogout} navigate={navigate} activePage="dashboard" />
      <DomainNav appState={appState} onDomainSelect={onDomainSelect} activeDomainId={null} />

      <main className="page-container" style={{ paddingTop: '130px', paddingBottom: '80px', position: 'relative' }}>
        {/* Score dial */}
        <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '64px', textAlign: 'center' }}>
          <div style={{ position: 'relative', width: '256px', height: '256px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Big circular progress */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--surface-container-highest)" strokeWidth="8"/>
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--primary)" strokeWidth="8"
                strokeDasharray={`${251.2 * (totalScore / 100)} 251.2`}
                style={{ transition: 'stroke-dasharray 0.8s ease' }}/>
            </svg>

            {/* Center content */}
            <div style={{ zIndex: 10, textAlign: 'center' }}>
              <div className="font-headline-lg" style={{ fontSize: '48px', color: 'var(--primary)', lineHeight: 1 }}>
                {totalScore.toFixed(1)}
              </div>
              <div className="font-label-caps" style={{ color: 'var(--outline)', marginTop: '4px' }}>sur 100</div>
            </div>

            {/* Annotation bubble */}
            <div style={{
              position: 'absolute', bottom: '-12px', right: '-24px',
              fontFamily: 'var(--font-annotation)', fontSize: '13px', color: 'var(--primary)',
              display: 'flex', alignItems: 'center', gap: '4px',
              background: 'var(--surface-container-low)', padding: '4px 8px', borderRadius: '4px',
              border: '1px solid var(--outline-variant)',
            }}>
              {gradedCount}/{totalCriteria} critères notés
            </div>
          </div>

          <h1 className="font-headline-md" style={{ marginTop: '48px', color: 'var(--on-surface)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Tableau de Bord — {establishment?.name || 'Établissement'}
          </h1>
          <p className="font-body-md" style={{ color: 'var(--on-surface-variant)', maxWidth: '480px', margin: '8px auto 0' }}>
            Vue d'ensemble de la conformité institutionnelle pour l'accréditation Algérienne 2024.
          </p>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {gradedCount > 0 && (
              <button
                onClick={handleGoResults}
                style={{
                  background: 'var(--secondary)',
                  color: 'var(--on-secondary)',
                  border: 'none', borderRadius: '8px',
                  padding: '12px 24px', cursor: 'pointer',
                  fontFamily: 'var(--font-primary)', fontSize: '12px', fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}
              >
                <Icon name="leaderboard" style={{ fontSize: '18px' }} />
                Voir les résultats
              </button>
            )}
            <button
              onClick={handleReset}
              style={{
                background: 'transparent',
                color: 'var(--error)',
                border: '1px solid var(--error)',
                borderRadius: '8px', padding: '12px 24px', cursor: 'pointer',
                fontFamily: 'var(--font-primary)', fontSize: '12px', fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--error-container)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <Icon name="restart_alt" style={{ fontSize: '18px' }} />
              Réinitialiser
            </button>
          </div>
        </section>

        {/* Domain cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {DOMAINS.map((domain, idx) => {
            const ds = computeDomainScore(domain.id, grades);
            const domainGraded = domain.criteria.filter(c => grades[c.id] != null).length;
            return (
              <button
                key={domain.id}
                onClick={() => onDomainSelect(idx)}
                className="card-lift pencil-border"
                style={{
                  background: 'var(--surface-container-low)',
                  borderRadius: '8px',
                  padding: '24px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  border: '1px solid var(--outline-variant)',
                  width: '100%',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                  {/* Domain icon */}
                  <div style={{
                    width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid var(--outline-variant)', background: 'white', borderRadius: '4px',
                    transform: 'rotate(45deg)',
                  }}>
                    <Icon name={domain.icon} style={{ color: 'var(--primary)', transform: 'rotate(-45deg)', fontSize: '22px' }} />
                  </div>
                  {/* Circle progress */}
                  <div style={{ position: 'relative', width: '48px', height: '48px' }}>
                    <CircleProgress percent={ds.percent} size={48} strokeWidth={3} />
                    <span style={{
                      position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-primary)', fontSize: '10px', fontWeight: 700, color: 'var(--on-surface)',
                    }}>
                      {ds.percent}%
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <span className="font-label-caps" style={{ color: 'var(--outline)', display: 'block', marginBottom: '4px', fontSize: '10px' }}>
                    {domain.id} — {domain.id === 'D1' ? 'GOUVERNANCE' : domain.id === 'D2' ? 'DROITS PATIENTS' : domain.id === 'D3' ? 'QUALITÉ SOINS' : domain.id === 'D4' ? 'RH & FORMATION' : domain.id === 'D5' ? 'INFRASTRUCTURES' : domain.id === 'D6' ? 'SYST. INFO.' : 'PERFORMANCE'}
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: '18px', fontWeight: 500, color: 'var(--primary)', lineHeight: 1.3, display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {domain.label}
                    <DomainInfoTooltip domain={domain} />
                  </h3>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <span className="font-body-md" style={{ fontSize: '14px', color: 'var(--on-surface-variant)' }}>
                    {ds.earned.toFixed(1)} / {ds.max} pts
                  </span>
                  <span style={{ fontFamily: 'var(--font-annotation)', fontSize: '12px', color: 'var(--on-surface-variant)' }}>
                    {domainGraded}/{domain.criteria.length} notés
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{ marginTop: '12px', height: '3px', background: 'var(--surface-variant)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'var(--secondary)', width: `${ds.percent}%`, transition: 'width 0.6s ease', borderRadius: '999px' }} />
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {/* Floating action button */}
      <button
        className="tooltip-container"
        onClick={() => setCommentModalOpen(true)}
        style={{
          position: 'fixed', bottom: '32px', right: '32px',
          width: '64px', height: '64px',
          background: 'var(--primary)', color: 'var(--on-primary)',
          border: 'none', borderRadius: '50%', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.2s, box-shadow 0.2s',
          zIndex: 40,
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        <Icon name="add_comment" style={{ fontSize: '28px' }} />
        <span className="tooltip">Ajouter Commentaire</span>
      </button>

      {/* Comment Modal */}
      {isCommentModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px'
        }}>
          <div className="sketch-border" style={{
            background: 'var(--surface-container-lowest)',
            borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '500px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
            position: 'relative'
          }}>
            <button 
              onClick={() => setCommentModalOpen(false)}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--on-surface-variant)'
              }}
            >
              <Icon name="close" />
            </button>
            
            <h3 className="font-headline-md" style={{ color: 'var(--on-surface)', marginBottom: '8px' }}>
              Ajouter un Commentaire
            </h3>
            <p className="font-body-md" style={{ color: 'var(--on-surface-variant)', marginBottom: '24px' }}>
              Ces notes seront associées à votre évaluation globale pour l'établissement.
            </p>

            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Ex: L'équipe de direction semble particulièrement engagée dans la démarche qualité, mais des efforts restent à faire sur l'hygiène."
              className="pencil-border"
              style={{
                width: '100%', height: '160px', padding: '16px',
                background: 'transparent',
                fontFamily: 'var(--font-annotation)', fontSize: '14px',
                color: 'var(--on-surface)',
                outline: 'none', resize: 'vertical',
                borderRadius: '8px'
              }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--outline-variant)'}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => setCommentModalOpen(false)}
                style={{
                  padding: '12px 24px', background: 'transparent',
                  border: 'none', color: 'var(--on-surface-variant)',
                  cursor: 'pointer', fontFamily: 'var(--font-primary)',
                  fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em',
                  textTransform: 'uppercase'
                }}
              >
                Annuler
              </button>
              <button
                onClick={async () => {
                  if (await handleComment(commentText)) setCommentModalOpen(false);
                }}
                style={{
                  padding: '12px 24px', background: 'var(--primary)',
                  border: 'none', color: 'var(--on-primary)', borderRadius: '8px',
                  cursor: 'pointer', fontFamily: 'var(--font-primary)',
                  fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em',
                  textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                <Icon name="save" style={{ fontSize: '18px' }} />
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
