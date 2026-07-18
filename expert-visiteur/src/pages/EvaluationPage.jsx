import { useState } from 'react';
import AppHeader from '../components/AppHeader';
import DomainNav from '../components/DomainNav';
import { DOMAINS, GRADING, computeDomainScore, computeScore } from '../data/referentiel';

const Icon = ({ name, style, className }) => (
  <span className={`material-symbols-outlined ${className || ''}`} style={style}>{name}</span>
);

const GRADE_CONFIG = {
  A: { letter: 'A', pct: '100%', bg: 'var(--sage)', desc: 'Entièrement satisfait' },
  B: { letter: 'B', pct: '50%', bg: 'var(--powder-blue)', desc: 'Partiellement satisfait' },
  C: { letter: 'C', pct: '25%', bg: 'var(--warm-gold)', desc: 'Insuffisant' },
  D: { letter: 'D', pct: '0%', bg: 'var(--dusty-rose)', desc: 'Non satisfait' },
};

export default function EvaluationPage({ appState, setAppState, handleLogout, navigate, onDomainSelect, onFinish, handleGrade, handleReset }) {
  const { grades, currentDomain, currentCriterion } = appState;
  const domain = DOMAINS[currentDomain];
  const criterion = domain?.criteria[currentCriterion];
  const currentGrade = criterion ? grades[criterion.id] : null;
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

  const handleGradeSelect = (g) => {
    handleGrade(criterion.id, g);
  };

  const jumpToCriterion = (idx) => {
    setAppState(s => ({ ...s, currentCriterion: idx }));
  };

  if (!domain || !criterion) return null;

  const progressPct = Math.round(((currentCriterion + 1) / totalCriteria) * 100);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      <AppHeader appState={appState} handleLogout={handleLogout} navigate={navigate} activePage="evaluation" />
      <DomainNav appState={appState} onDomainSelect={onDomainSelect} activeDomainId={domain.id} />

      <main style={{ paddingTop: '140px', paddingBottom: '140px', maxWidth: '1280px', margin: '0 auto', padding: '140px 24px 160px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>

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
            <h2 className="font-headline-md" style={{ marginBottom: '24px', maxWidth: '480px', lineHeight: 1.4 }}>
              Critère {criterion.num} — {criterion.label}
            </h2>

            {/* Definition */}
            <p className="font-body-lg" style={{ color: 'var(--on-surface-variant)', marginBottom: '32px', maxWidth: '520px', lineHeight: 1.7 }}>
              {criterion.definition}
            </p>

            {/* Weight */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
              <span className="font-label-caps" style={{ color: 'var(--on-surface-variant)' }}>Poids du critère :</span>
              <span className="font-headline-md" style={{ color: 'var(--primary)' }}>{criterion.weight} pt{criterion.weight > 1 ? 's' : ''}</span>
            </div>

            {/* Grade buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', width: '100%', maxWidth: '480px' }}>
              {Object.entries(GRADE_CONFIG).map(([g, cfg]) => (
                <button
                  key={g}
                  onClick={() => handleGradeSelect(g)}
                  className={`grade-${g} ${currentGrade === g ? 'selected' : ''}`}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                    padding: '16px 8px', borderRadius: '16px', border: 'none', cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{
                    width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '50%', background: cfg.bg, fontFamily: 'var(--font-primary)',
                    fontWeight: 700, fontSize: '20px', color: 'var(--on-surface)',
                  }}>{g}</span>
                  <span className="font-label-caps" style={{ fontSize: '10px' }}>{cfg.pct}</span>
                  <span style={{ fontFamily: 'var(--font-annotation)', fontSize: '10px', color: 'var(--on-surface-variant)', lineHeight: 1.2 }}>
                    {cfg.desc}
                  </span>
                </button>
              ))}
            </div>
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
              {domain.criteria.filter(c => grades[c.id]).length} critères complétés sur {totalCriteria}
            </span>
          </div>
          {/* Deck thumbnails */}
          <div style={{ display: 'flex', gap: '8px', height: '36px' }}>
            {domain.criteria.map((c, idx) => {
              const g = grades[c.id];
              const isCurrent = idx === currentCriterion;
              const bgMap = { A: 'var(--sage)', B: 'var(--powder-blue)', C: 'var(--warm-gold)', D: 'var(--dusty-rose)' };
              return (
                <button
                  key={c.id}
                  onClick={() => jumpToCriterion(idx)}
                  style={{
                    flex: 1, borderRadius: '6px', border: isCurrent ? '2px solid var(--primary)' : '1px solid var(--outline-variant)',
                    background: g ? bgMap[g] : isCurrent ? 'white' : 'var(--surface-container-low)',
                    cursor: 'pointer', fontSize: '10px', fontWeight: 700,
                    color: isCurrent ? 'var(--primary)' : 'var(--on-surface-variant)',
                    transform: isCurrent ? 'scale(1.1)' : 'none',
                    transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    minWidth: 0,
                  }}
                  title={c.label}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
          {/* Mobile nav */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <button
              onClick={goPrev}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--on-surface-variant)' }}
            >
              <Icon name="arrow_back" style={{ fontSize: '20px' }} />
              <span className="font-label-caps" style={{ fontSize: '9px' }}>PRÉC.</span>
            </button>
            <button
              onClick={goNext}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--primary)' }}
            >
              <Icon name="arrow_forward" style={{ fontSize: '20px' }} />
              <span className="font-label-caps" style={{ fontSize: '9px' }}>SUIV.</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
