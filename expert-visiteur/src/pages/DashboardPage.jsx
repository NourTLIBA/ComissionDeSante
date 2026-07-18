import { useState } from 'react';
import AppHeader from '../components/AppHeader';
import DomainNav from '../components/DomainNav';
import { DOMAINS, computeScore, computeDomainScore } from '../data/referentiel';

const Icon = ({ name, style, className }) => (
  <span className={`material-symbols-outlined ${className || ''}`} style={style}>{name}</span>
);

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

export default function DashboardPage({ appState, setAppState, handleLogout, navigate, onDomainSelect, onFinish, handleReset }) {
  const [isCommentModalOpen, setCommentModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

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

      <main className="page-container" style={{ paddingTop: '140px', paddingBottom: '80px', position: 'relative' }}>
        {/* Marginalia annotation */}
        <div style={{ position: 'absolute', right: '8px', top: '160px', opacity: 0.2, pointerEvents: 'none', display: 'none' }} className="xl-show">
          <div style={{ fontFamily: 'var(--font-annotation)', fontSize: '12px', transform: 'rotate(6deg)', color: 'var(--primary)', maxWidth: '120px' }}>
            Points critiques à surveiller !
          </div>
        </div>

        {/* Central sunburst dial */}
        <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '64px', textAlign: 'center' }}>
          <div style={{ position: 'relative', width: '256px', height: '256px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Animated sunburst background */}
            <svg className="sunburst-animate" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12, color: 'var(--primary)' }} viewBox="0 0 100 100">
              <path d="M50 0 L52 48 L100 50 L52 52 L50 100 L48 52 L0 50 L48 48 Z" fill="currentColor"/>
              <path d="M15 15 L48 48 M85 15 L52 50 M85 85 L50 52 M15 85 L48 50" stroke="currentColor" strokeWidth="0.3" opacity="0.5"/>
            </svg>

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
              <Icon name="edit" style={{ fontSize: '14px' }} />
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
            const domainGraded = domain.criteria.filter(c => grades[c.id]).length;
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
                  <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: '18px', fontWeight: 500, color: 'var(--primary)', lineHeight: 1.3 }}>
                    {domain.label}
                  </h3>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <span className="font-body-md" style={{ fontSize: '14px', color: 'var(--on-surface-variant)' }}>
                    {ds.earned.toFixed(1)} / {ds.max} pts
                  </span>
                  <span style={{ fontFamily: 'var(--font-annotation)', fontSize: '12px', color: 'var(--on-surface-variant)', fontStyle: 'italic' }}>
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
          boxShadow: '0 4px 16px rgba(111,89,85,0.35)',
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
                onClick={() => {
                  alert("Commentaire sauvegardé (simulation)");
                  setCommentModalOpen(false);
                  setCommentText("");
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
