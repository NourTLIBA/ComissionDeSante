import { useState } from 'react';
import { ESTABLISHMENTS } from '../data/referentiel';
import AppHeader from '../components/AppHeader';

const Icon = ({ name, style, className }) => (
  <span className={`material-symbols-outlined ${className || ''}`} style={style}>{name}</span>
);

export default function VisitConfigPage({ appState, onSelectEstablishment, handleLogout, navigate }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = ESTABLISHMENTS.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.city.toLowerCase().includes(search.toLowerCase()) ||
    e.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirm = () => {
    if (selected) onSelectEstablishment(selected);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-container-low)' }}>
      <AppHeader appState={appState} handleLogout={handleLogout} navigate={navigate} activePage="config" />

      <main className="page-container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
        {/* Header section */}
        <section style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '12px',
            background: 'var(--surface-container-low)', padding: '8px 24px',
            borderRadius: '999px', border: '1px solid var(--outline-variant)', marginBottom: '24px',
          }}>
            <Icon name="verified" style={{ color: '#D4AF37', fontVariationSettings: "'FILL' 1" }} />
            <span className="font-label-caps" style={{ color: 'var(--primary)' }}>
              Expert visiteur certifié — Autorité nationale d'accréditation
            </span>
          </div>
          <h2 className="font-headline-lg" style={{ color: 'var(--on-surface)', marginBottom: '16px', letterSpacing: '0.05em' }}>
            Initialisation de la Visite
          </h2>
          <p className="font-body-lg" style={{ color: 'var(--on-surface-variant)', maxWidth: '560px', margin: '0 auto' }}>
            Sélectionnez l'établissement de santé pour charger les données de cadrage.
          </p>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'start' }}>
          {/* Search & List panel */}
          <div style={{ background: 'var(--surface-container-low)', borderRadius: '12px', padding: '32px', border: '1px solid var(--outline-variant)' }}>
            <label className="font-label-caps" style={{ display: 'block', color: 'var(--on-primary-fixed-variant)', marginBottom: '12px' }}>
              Rechercher un établissement
            </label>
            <div style={{ position: 'relative', marginBottom: '24px' }}>
              <Icon name="search" style={{ position: 'absolute', left: 0, top: '12px', color: 'var(--outline)' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Nom, Wilaya, Code..."
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '2px solid var(--outline)',
                  padding: '12px 4px 12px 32px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '16px',
                  outline: 'none',
                  color: 'var(--on-surface)',
                }}
                onFocus={e => e.target.parentElement.querySelector('span').style.color = 'var(--primary)'}
                onBlur={e => e.target.parentElement.querySelector('span').style.color = 'var(--outline)'}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '360px', overflowY: 'auto' }} className="no-scrollbar">
              {filtered.map(est => (
                <button
                  key={est.id}
                  onClick={() => setSelected(est)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 16px',
                    background: selected?.id === est.id ? 'var(--primary-container)' : 'transparent',
                    border: selected?.id === est.id ? '1px solid var(--primary)' : '1px solid transparent',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (selected?.id !== est.id) e.currentTarget.style.background = 'var(--surface-variant)'; }}
                  onMouseLeave={e => { if (selected?.id !== est.id) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div>
                    <div className="font-body-md" style={{ fontWeight: 600, color: 'var(--on-surface)' }}>{est.name}</div>
                    <div className="font-annotation" style={{ color: 'var(--on-surface-variant)' }}>
                      {est.city}, {est.wilaya} · {est.type}
                    </div>
                  </div>
                  <Icon name="arrow_forward" style={{ color: 'var(--primary)', opacity: selected?.id === est.id ? 1 : 0, transition: 'opacity 0.15s' }} />
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="font-annotation" style={{ color: 'var(--on-surface-variant)', padding: '16px', textAlign: 'center' }}>
                  Aucun établissement trouvé
                </div>
              )}
            </div>
          </div>

          {/* Selected establishment card */}
          <div>
            {selected ? (
              <div className="sketch-border" style={{
                background: 'var(--surface-container-lowest)',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 24px rgba(111,89,85,0.08)',
                position: 'relative',
              }}>
                {/* Art deco corner accent */}
                <div style={{ position: 'absolute', top: 0, right: 0, width: '96px', height: '96px', pointerEvents: 'none', overflow: 'hidden', opacity: 0.2 }}>
                  <div style={{ width: '80px', height: '80px', border: '2px solid #D4AF37', transform: 'rotate(45deg) translate(40px, -40px)' }} />
                  <div style={{ width: '64px', height: '64px', border: '2px solid #D4AF37', transform: 'rotate(45deg) translate(36px, -52px)' }} />
                </div>

                {/* Card header */}
                <div style={{ padding: '32px 32px 24px', borderBottom: '1px solid var(--outline-variant)', background: 'var(--surface-container-low)' }}>
                  <div>
                    <span className="font-label-caps" style={{ color: 'var(--secondary)', letterSpacing: '0.15em' }}>Fiche de Visite</span>
                    <h3 className="font-headline-md" style={{ color: 'var(--on-surface)', marginTop: '8px', lineHeight: 1.3 }}>{selected.name}</h3>
                    <div className="font-body-md" style={{ color: 'var(--on-surface-variant)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                      <Icon name="location_on" style={{ fontSize: '18px' }} />
                      {selected.city}, {selected.wilaya} — {selected.code}
                    </div>
                  </div>
                </div>

                {/* Stats grid */}
                <div style={{ padding: '24px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <StatBox label="Type" value={selected.type} />
                  <StatBox label="Lits & Places" value={selected.beds} />
                  <StatBox label="Services" value={selected.services} />
                  <StatBox label="Wilaya" value={selected.wilaya} />
                </div>

                {/* Confirm button */}
                <div style={{ padding: '24px 32px', background: 'var(--surface-container-high)', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={handleConfirm}
                    style={{
                      background: 'var(--primary)',
                      color: 'var(--on-primary)',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '16px 32px',
                      fontFamily: 'var(--font-primary)',
                      fontSize: '12px',
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    Confirmer et Commencer
                    <Icon name="arrow_forward" style={{ fontSize: '20px' }} />
                  </button>
                </div>
              </div>
            ) : (
              <div style={{
                background: 'var(--primary-container)', borderRadius: '12px', padding: '32px',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}>
                  <Icon name="local_hospital" style={{ fontSize: '100px', color: 'var(--on-primary-container)' }} />
                </div>
                <h4 className="font-label-caps" style={{ color: 'var(--on-primary-container)', marginBottom: '8px' }}>Instructions</h4>
                <p className="font-annotation" style={{ color: 'var(--on-primary-container)' }}>
                  Sélectionnez un établissement dans la liste pour charger sa fiche de visite et démarrer la procédure d'évaluation.
                </p>
                <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {['10 établissements disponibles', '44 critères, 7 domaines', '100 points au total'].map(t => (
                    <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Icon name="check_circle" style={{ fontSize: '16px', color: 'var(--primary)', fontVariationSettings: "'FILL' 1" }} />
                      <span className="font-annotation" style={{ color: 'var(--on-primary-container)' }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Motivational quote */}
            <div style={{ marginTop: '24px', padding: '20px 32px', border: '1px solid var(--outline-variant)', borderRadius: '8px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '12px', height: '12px', borderTop: '1px solid var(--outline)', borderLeft: '1px solid var(--outline)' }} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', borderBottom: '1px solid var(--outline)', borderRight: '1px solid var(--outline)' }} />
              <p className="font-annotation" style={{ color: 'var(--outline)', textAlign: 'center', fontStyle: 'italic' }}>
                "L'accréditation est un chemin vers l'excellence, guidé par la rigueur de l'observation et la bienveillance de l'échange."
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div style={{
      background: 'var(--surface-container-low)',
      borderRadius: '8px',
      padding: '16px',
      textAlign: 'center',
    }}>
      <div className="font-headline-md" style={{ color: 'var(--primary)' }}>{value}</div>
      <div className="font-label-caps" style={{ color: 'var(--on-surface-variant)', fontSize: '10px', marginTop: '4px' }}>{label}</div>
    </div>
  );
}
