import { useState } from 'react';
import AppHeader from '../components/AppHeader';
import DomainNav from '../components/DomainNav';
import { DOMAINS, GRADING, getGradeFromScore, computeDomainScore, computeScore } from '../data/referentiel';

const Icon = ({ name, style, className }) => (
  <span className={`material-symbols-outlined ${className || ''}`} style={style}>{name}</span>
);

/* ─── Grade zone display config ──────────────────────────────── */
const GRADE_ZONES = {
  A: { label: 'Entièrement satisfait',   range: '75–100', bg: 'var(--sage)',         color: '#5a9455' },
  B: { label: 'Partiellement satisfait', range: '50–74',  bg: 'var(--powder-blue)', color: '#3a7ab5' },
  C: { label: 'Insuffisant',             range: '25–49',  bg: 'var(--warm-gold)',   color: '#b58a20' },
  D: { label: 'Non satisfait',           range: '0–24',   bg: 'var(--dusty-rose)',  color: '#ba1a1a' },
};

/* ─── Rich Criterion info hover component ────────────────────────────── */
function CriterionInfoHover({ criterion }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', margin: '4px 0 24px' }}>
      <button
        type="button"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 18px',
          background: 'var(--surface-container)',
          border: '1px solid var(--outline-variant)',
          borderRadius: '999px',
          cursor: 'pointer',
          color: 'var(--primary)',
          fontSize: '12px',
          fontFamily: 'var(--font-primary)',
          fontWeight: 700,
          letterSpacing: '0.04em',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 8px rgba(111,89,85,0.08)',
        }}
      >
        <Icon name="verified_user" style={{ fontSize: '18px', color: 'var(--primary)', fontVariationSettings: "'FILL' 1" }} />
        <span>Exigences & Éléments de Preuve (Ministère de la Santé)</span>
        <Icon name="info" style={{ fontSize: '16px', color: 'var(--outline)', fontVariationSettings: "'FILL' 1" }} />
      </button>

      {isOpen && (
        <div
          role="tooltip"
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 12px)',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '420px',
            maxWidth: '90vw',
            background: 'var(--inverse-surface)',
            color: 'var(--surface)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 12px 36px rgba(0,0,0,0.35)',
            zIndex: 300,
            textAlign: 'left',
            fontFamily: 'var(--font-body)',
            pointerEvents: 'none',
            lineHeight: 1.5,
            border: '1px solid var(--outline-variant)',
          }}
        >
          {criterion.directive && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              fontFamily: 'var(--font-primary)', fontSize: '12px', fontWeight: 700,
              color: 'var(--warm-gold)', letterSpacing: '0.05em',
              marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '8px'
            }}>
              <Icon name="policy" style={{ fontSize: '16px', color: 'var(--warm-gold)' }} />
              {criterion.directive}
            </div>
          )}

          {criterion.details && (
            <div style={{ fontSize: '13px', color: 'var(--surface-variant)', marginBottom: '14px', lineHeight: 1.6 }}>
              {criterion.details}
            </div>
          )}

          {criterion.evidence && (
            <div style={{
              background: 'rgba(255,255,255,0.07)',
              borderRadius: '8px',
              padding: '12px 14px',
              borderLeft: '4px solid var(--sage)'
            }}>
              <div style={{
                fontFamily: 'var(--font-primary)', fontSize: '11px', fontWeight: 700,
                color: 'var(--sage)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px',
                textTransform: 'uppercase', letterSpacing: '0.08em'
              }}>
                <Icon name="folder_open" style={{ fontSize: '16px', color: 'var(--sage)' }} />
                Éléments de preuve attendus :
              </div>
              <div style={{ fontSize: '12px', color: 'var(--surface)', lineHeight: 1.5 }}>
                {criterion.evidence}
              </div>
            </div>
          )}

          {/* Arrow */}
          <div style={{
            position: 'absolute',
            top: '100%', left: '50%',
            transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '8px solid var(--inverse-surface)',
          }} />
        </div>
      )}
    </div>
  );
}

/* ─── Deck Thumbnail with Hover Tooltip ─────────────────────────── */
function DeckTile({ criterion, idx, isCurrent, letter, tileBg, onClick }) {
  const [hover, setHover] = useState(false);

  return (
    <div style={{ position: 'relative', flex: 1, display: 'flex' }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          width: '100%', borderRadius: '6px', border: isCurrent ? '2px solid var(--primary)' : '1px solid var(--outline-variant)',
          background: tileBg,
          cursor: 'pointer', fontSize: '10px', fontWeight: 700,
          color: isCurrent ? 'var(--primary)' : 'var(--on-surface-variant)',
          transform: isCurrent ? 'scale(1.1)' : 'none',
          transition: 'all 0.15s',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          minWidth: 0,
        }}
      >
        {letter ?? (idx + 1)}
      </button>

      {hover && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '260px',
            background: 'var(--inverse-surface)',
            color: 'var(--surface)',
            padding: '10px 12px',
            borderRadius: '8px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
            zIndex: 300,
            pointerEvents: 'none',
            fontSize: '11px',
            textAlign: 'left',
            lineHeight: 1.4,
            border: '1px solid var(--outline-variant)',
          }}
        >
          <div style={{ fontWeight: 700, color: 'var(--warm-gold)', marginBottom: '2px' }}>
            Critère {criterion.num} — {criterion.label} ({criterion.weight} pts)
          </div>
          {criterion.directive && (
            <div style={{ fontSize: '10px', color: 'var(--powder-blue)', fontStyle: 'italic', marginBottom: '4px' }}>
              {criterion.directive}
            </div>
          )}
          {criterion.evidence && (
            <div style={{ fontSize: '10px', color: 'var(--sage)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Icon name="folder_open" style={{ fontSize: '12px', color: 'var(--sage)' }} />
              <span>{criterion.evidence.slice(0, 90)}...</span>
            </div>
          )}
          {/* Arrow */}
          <div style={{
            position: 'absolute',
            top: '100%', left: '50%',
            transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '5px solid var(--inverse-surface)',
          }} />
        </div>
      )}
    </div>
  );
}

/* ─── Grade Slider — continuous 0-100, auto-assigns letter ──────── */
function GradeSlider({ currentScore, onScoreChange, criterionWeight }) {
  const hasValue = currentScore !== null && currentScore !== undefined;
  const displayVal = hasValue ? currentScore : 0;
  const gradeLetter = hasValue ? getGradeFromScore(currentScore) : null;
  const zone = gradeLetter ? GRADE_ZONES[gradeLetter] : null;

  const earnedPts = hasValue ? (criterionWeight * currentScore / 100).toFixed(2) : '—';

  const handleChange = (e) => onScoreChange(Number(e.target.value));

  const ticks = [
    { at: 0,  label: '0', grade: 'D' },
    { at: 25, label: '25', grade: 'C' },
    { at: 50, label: '50', grade: 'B' },
    { at: 75, label: '75', grade: 'A' },
    { at: 100,label: '100', grade: 'A' },
  ];

  const trackColor = zone
    ? `linear-gradient(to right, ${zone.color}aa 0%, ${zone.color} ${displayVal}%, var(--surface-variant) ${displayVal}%, var(--surface-variant) 100%)`
    : `linear-gradient(to right, var(--surface-variant) 0%, var(--surface-variant) 100%)`;

  return (
    <div style={{ width: '100%', maxWidth: '480px' }}>
      {/* Big value + grade badge row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{
          fontFamily: 'var(--font-primary)',
          fontSize: '56px',
          fontWeight: 700,
          lineHeight: 1,
          color: zone ? zone.color : 'var(--outline-variant)',
          transition: 'color 0.2s',
          minWidth: '80px',
          textAlign: 'center',
        }}>
          {hasValue ? displayVal : '—'}
        </div>
        {gradeLetter && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
          }}>
            <span style={{
              width: '52px', height: '52px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '50%',
              background: zone.bg,
              border: `2px solid ${zone.color}`,
              fontFamily: 'var(--font-primary)', fontWeight: 700, fontSize: '24px',
              color: zone.color,
              boxShadow: `0 0 0 4px ${zone.color}22`,
              transition: 'all 0.2s',
            }}>
              {gradeLetter}
            </span>
            <span style={{
              fontFamily: 'var(--font-annotation)', fontSize: '10px',
              color: zone.color, fontStyle: 'italic',
            }}>
              {zone.range}%
            </span>
          </div>
        )}
      </div>

      {/* Slider track */}
      <div style={{ position: 'relative' }}>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={displayVal}
          onChange={handleChange}
          aria-label="Score du critère (0 à 100)"
          aria-valuenow={displayVal}
          aria-valuetext={gradeLetter ? `${displayVal}% — cote ${gradeLetter}` : 'Non noté'}
          style={{
            width: '100%',
            height: '8px',
            appearance: 'none',
            WebkitAppearance: 'none',
            borderRadius: '999px',
            background: trackColor,
            outline: 'none',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
        />

        {/* Zone boundary ticks */}
        <div style={{ position: 'relative', marginTop: '6px', height: '20px' }}>
          {ticks.map(t => (
            <div key={t.at} style={{
              position: 'absolute',
              left: `${t.at}%`,
              transform: 'translateX(-50%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
              <div style={{ width: '1px', height: '6px', background: 'var(--outline-variant)', marginBottom: '2px' }} />
              <span style={{
                fontFamily: 'var(--font-primary)', fontSize: '9px', fontWeight: 700,
                letterSpacing: '0.06em',
                color: (hasValue && displayVal >= t.at && (t.at === 75 ? true : displayVal < (ticks[ticks.indexOf(t)+1]?.at ?? 101)))
                  ? (zone?.color ?? 'var(--outline)')
                  : 'var(--outline-variant)',
              }}>{t.label}</span>
            </div>
          ))}
        </div>

        {/* Zone labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', padding: '0 2px' }}>
          {(['D','C','B','A']).map(g => (
            <span key={g} style={{
              fontFamily: 'var(--font-annotation)', fontSize: '10px',
              color: gradeLetter === g ? GRADE_ZONES[g].color : 'var(--outline-variant)',
              fontStyle: 'italic',
              fontWeight: gradeLetter === g ? 700 : 400,
              transition: 'color 0.2s',
              flex: 1,
              textAlign: g === 'D' ? 'left' : g === 'A' ? 'right' : 'center',
            }}>
              {g}
            </span>
          ))}
        </div>
      </div>

      {/* Result pill */}
      {hasValue && zone && (
        <div style={{
          marginTop: '20px',
          padding: '12px 16px',
          background: zone.bg + '55',
          borderRadius: '8px',
          border: `1px solid ${zone.color}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'all 0.2s',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-primary)', fontWeight: 700, fontSize: '13px', color: zone.color }}>
              Cote {gradeLetter} — {zone.label}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--on-surface-variant)', marginTop: '2px' }}>
              {displayVal}% du poids → <strong>{earnedPts} pt{criterionWeight > 1 ? 's' : ''}</strong> sur {criterionWeight}
            </div>
          </div>
        </div>
      )}

      {!hasValue && (
        <div style={{
          marginTop: '20px', padding: '12px 16px',
          background: 'var(--surface-container-highest)',
          borderRadius: '8px', border: '1px dashed var(--outline-variant)',
          textAlign: 'center',
          fontFamily: 'var(--font-annotation)', fontSize: '13px',
          color: 'var(--outline)', fontStyle: 'italic',
        }}>
          Déplacez le curseur pour noter ce critère
        </div>
      )}

      {/* Slider thumb styles */}
      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 24px; height: 24px;
          border-radius: 50%;
          background: ${zone ? zone.color : 'var(--primary)'};
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.28);
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        input[type='range']::-webkit-slider-thumb:hover { transform: scale(1.18); }
        input[type='range']::-moz-range-thumb {
          width: 24px; height: 24px;
          border-radius: 50%;
          background: ${zone ? zone.color : 'var(--primary)'};
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.28);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

/* ─── Main EvaluationPage ──────────────────────────────────── */
export default function EvaluationPage({ appState, setAppState, handleLogout, navigate, onDomainSelect, onFinish, handleGrade, handleReset }) {
  const { grades, currentDomain, currentCriterion } = appState;
  const domain = DOMAINS[currentDomain];
  const criterion = domain?.criteria[currentCriterion];
  // currentScore is a number 0-100 (or null if unset)
  const currentScore = criterion ? (grades[criterion.id] ?? null) : null;
  const domainScore = domain ? computeDomainScore(domain.id, grades) : null;
  const totalCriteria = domain?.criteria.length || 0;

  const goNext = () => {
    if (currentCriterion < totalCriteria - 1) {
      setAppState(s => ({ ...s, currentCriterion: s.currentCriterion + 1 }));
    } else if (currentDomain < DOMAINS.length - 1) {
      setAppState(s => ({ ...s, currentDomain: s.currentDomain + 1, currentCriterion: 0 }));
    } else {
      onFinish(computeScore(grades));
    }
  };

  const goPrev = () => {
    if (currentCriterion > 0) {
      setAppState(s => ({ ...s, currentCriterion: s.currentCriterion - 1 }));
    } else if (currentDomain > 0) {
      const prevDomain = DOMAINS[currentDomain - 1];
      setAppState(s => ({ ...s, currentDomain: s.currentDomain - 1, currentCriterion: prevDomain.criteria.length - 1 }));
    }
  };

  const handleGradeSelect = (score) => {
    handleGrade(criterion.id, score);
  };

  const jumpToCriterion = (idx) => {
    setAppState(s => ({ ...s, currentCriterion: idx }));
  };

  if (!domain || !criterion) return null;

  const progressPct = Math.round(((currentCriterion + 1) / totalCriteria) * 100);
  const isCriterionGraded = (id) => grades[id] !== null && grades[id] !== undefined;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      <AppHeader appState={appState} handleLogout={handleLogout} navigate={navigate} activePage="evaluation" />
      <DomainNav appState={appState} onDomainSelect={onDomainSelect} activeDomainId={domain.id} />

      <main style={{ padding: '130px 24px 160px', maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>

        {/* Progress summary */}
        <div style={{ width: '100%', maxWidth: '672px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', padding: '0 8px' }}>
          <div>
            <span className="font-label-caps" style={{ color: 'var(--primary)', display: 'block', marginBottom: '4px' }}>
              PROGRÈS — {domain.id}
            </span>
            <div className="font-headline-md">
              Critère {currentCriterion + 1} / {totalCriteria}
            </div>
            <p className="font-annotation" style={{ color: 'var(--on-surface-variant)', fontStyle: 'italic' }}>
              "{domain.label}"
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="font-label-caps" style={{ color: 'var(--outline)', marginBottom: '8px' }}>
              Score domaine : {domainScore?.earned.toFixed(1)}/{domainScore?.max} pts
            </div>
            <div style={{ width: '128px', height: '4px', background: 'var(--surface-variant)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'var(--primary)', width: `${progressPct}%`, transition: 'width 0.4s ease' }} />
            </div>
          </div>
        </div>

        {/* Nav arrows (desktop) */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '672px' }}>
          {/* Prev arrow */}
          <button
            onClick={goPrev}
            disabled={currentDomain === 0 && currentCriterion === 0}
            style={{
              position: 'absolute', left: '-80px', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', opacity: (currentDomain === 0 && currentCriterion === 0) ? 0.3 : 0.5,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = (currentDomain === 0 && currentCriterion === 0) ? '0.3' : '0.5'}
          >
            <svg width="60" height="40" fill="none" viewBox="0 0 80 40">
              <path className="sketch-arrow-path" d="M70 20H10M10 20L25 10M10 20L25 30" stroke="var(--outline)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-annotation" style={{ color: 'var(--on-surface-variant)', transform: 'rotate(-3deg)', display: 'block' }}>Précédent</span>
          </button>

          {/* Main flashcard */}
          <div className="sketch-border" style={{
            background: 'var(--surface-container-low)',
            borderRadius: '32px',
            padding: '48px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
            position: 'relative', overflow: 'hidden',
            boxShadow: '0 4px 32px rgba(111,89,85,0.08)',
          }}>
            {/* Sunburst decoration */}
            <div style={{ position: 'absolute', top: '24px', right: '24px', opacity: 0.15 }}>
              <Icon name="wb_sunny" style={{ fontSize: '56px' }} />
            </div>

            {/* Domain emblem */}
            <div style={{
              width: '80px', height: '80px', marginBottom: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '50%', border: '1px solid var(--outline-variant)', background: 'rgba(255,255,255,0.6)',
            }}>
              <Icon name={domain.icon} style={{ fontSize: '40px', color: 'var(--primary)' }} />
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <span className="font-label-caps" style={{
                padding: '4px 16px', border: '1px solid var(--primary)', color: 'var(--primary)',
                borderRadius: '999px', fontSize: '10px',
              }}>
                {domain.id} · {domain.shortLabel}
              </span>
              <span className="font-label-caps" style={{
                padding: '4px 12px', borderRadius: '999px', fontSize: '10px',
                background: criterion.type === 'Obligatoire' ? 'var(--error-container)' : 'var(--secondary-container)',
                color: criterion.type === 'Obligatoire' ? 'var(--on-error-container)' : 'var(--on-secondary-container)',
              }}>
                {criterion.type}
              </span>
            </div>

            {/* Criterion title */}
            <h2 className="font-headline-md" style={{ marginBottom: '16px', maxWidth: '480px', lineHeight: 1.4, textAlign: 'center' }}>
              Critère {criterion.num} — {criterion.label}
            </h2>

            {/* Definition */}
            <p className="font-body-lg" style={{ color: 'var(--on-surface-variant)', marginBottom: '16px', maxWidth: '520px', lineHeight: 1.7 }}>
              {criterion.definition}
            </p>

            {/* ── Official Information Hover Badge & Popover ── */}
            <CriterionInfoHover criterion={criterion} />

            {/* Weight */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
              <span className="font-label-caps" style={{ color: 'var(--on-surface-variant)' }}>Poids du critère :</span>
              <span className="font-headline-md" style={{ color: 'var(--primary)' }}>{criterion.weight} pt{criterion.weight > 1 ? 's' : ''}</span>
            </div>

            {/* ── Grade Slider (continuous 0-100) ── */}
            <GradeSlider
              currentScore={currentScore}
              onScoreChange={handleGradeSelect}
              criterionWeight={criterion.weight}
            />
          </div>

          {/* Next arrow */}
          <button
            onClick={goNext}
            style={{
              position: 'absolute', right: '-80px', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}
          >
            <svg width="60" height="40" fill="none" viewBox="0 0 80 40">
              <path className="sketch-arrow-path" d="M10 20H70M70 20L55 10M70 20L55 30" stroke="var(--outline)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-annotation" style={{ color: 'var(--on-surface-variant)', transform: 'rotate(3deg)', display: 'block' }}>Suivant</span>
          </button>
        </div>

        {/* Context actions */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={handleReset}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', background: 'transparent', border: '1px solid var(--error)',
              color: 'var(--error)', borderRadius: '8px', cursor: 'pointer',
              fontFamily: 'var(--font-primary)', fontSize: '12px', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--error-container)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Icon name="restart_alt" style={{ fontSize: '18px' }} />
            Réinitialiser
          </button>
          <button
            onClick={() => navigate('dashboard')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', background: 'var(--surface-container-highest)', border: 'none',
              color: 'var(--on-surface)', borderRadius: '8px', cursor: 'pointer',
              fontFamily: 'var(--font-primary)', fontSize: '12px', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
            }}
          >
            <Icon name="dashboard" style={{ fontSize: '18px' }} />
            Tableau de bord
          </button>
        </div>
      </main>

      {/* Criteria deck footer */}
      <footer style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        background: 'var(--surface-container-highest)',
        borderTop: '1px solid var(--outline-variant)',
        boxShadow: '0 -4px 16px rgba(111,89,85,0.08)',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span className="font-label-caps" style={{ color: 'var(--on-surface-variant)', fontSize: '10px' }}>
              Domaine {currentDomain + 1}/7 — {domain.shortLabel}
            </span>
            <span className="font-annotation" style={{ color: 'var(--on-surface-variant)', fontStyle: 'italic' }}>
              {domain.criteria.filter(c => isCriterionGraded(c.id)).length} critères complétés sur {totalCriteria}
            </span>
          </div>
          {/* Deck thumbnails */}
          <div style={{ display: 'flex', gap: '8px', height: '36px' }}>
            {domain.criteria.map((c, idx) => {
              const g = grades[c.id];
              const isCurrent = idx === currentCriterion;
              const bgColors = { A: 'var(--sage)', B: 'var(--powder-blue)', C: 'var(--warm-gold)', D: 'var(--dusty-rose)' };
              const letter = isCriterionGraded(c.id)
                ? (typeof g === 'number' ? getGradeFromScore(g) : g)
                : null;
              const tileBg = letter ? bgColors[letter] : (isCurrent ? 'white' : 'var(--surface-container-low)');
              return (
                <DeckTile
                  key={c.id}
                  criterion={c}
                  idx={idx}
                  isCurrent={isCurrent}
                  letter={letter}
                  tileBg={tileBg}
                  onClick={() => jumpToCriterion(idx)}
                />
              );
            })}
          </div>
        </div>
      </footer>
    </div>
  );
}
