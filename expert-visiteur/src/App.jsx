import { useState, useEffect } from 'react';
import './index.css';
import { loadFromStorage, saveToStorage, computeScore, DOMAINS } from './data/referentiel';
import LoginPage from './pages/LoginPage';
import VisitConfigPage from './pages/VisitConfigPage';
import DashboardPage from './pages/DashboardPage';
import EvaluationPage from './pages/EvaluationPage';
import ResultsPage from './pages/ResultsPage';

const DEFAULT_STATE = {
  user: null,
  establishment: null,
  grades: {},
  scores: {},
  currentDomain: 0,
  currentCriterion: 0,
};

export default function App() {
  const [appState, setAppState] = useState(() => {
    const saved = loadFromStorage();
    return saved || DEFAULT_STATE;
  });

  const [page, setPage] = useState(() => {
    const saved = loadFromStorage();
    if (!saved || !saved.user) return 'login';
    if (!saved.establishment) return 'config';
    return 'dashboard';
  });

  useEffect(() => {
    saveToStorage(appState);
  }, [appState]);

  const navigate = (p) => setPage(p);

  const handleLogin = (user) => {
    setAppState(s => ({ ...s, user }));
    setPage('config');
  };

  const handleSelectEstablishment = (est) => {
    setAppState(s => ({ ...s, establishment: est, grades: {}, currentDomain: 0, currentCriterion: 0 }));
    setPage('dashboard');
  };

  const handleGrade = (criterionId, grade) => {
    setAppState(s => ({ ...s, grades: { ...s.grades, [criterionId]: grade } }));
  };

  const handleDomainSelect = (domainIdx) => {
    setAppState(s => ({ ...s, currentDomain: domainIdx, currentCriterion: 0 }));
    setPage('evaluation');
  };

  const handleFinish = (finalScore) => {
    setAppState(s => ({
      ...s,
      scores: s.establishment ? { ...s.scores, [s.establishment.id]: finalScore } : s.scores,
    }));
    setPage('results');
  };

  const handleReset = () => {
    setAppState(s => {
      return { ...s, grades: {}, scores: {}, currentDomain: 0, currentCriterion: 0 };
    });
    setPage('dashboard');
  };

  const handleLogout = () => {
    setAppState(DEFAULT_STATE);
    setPage('login');
  };

  const commonProps = {
    appState,
    setAppState,
    navigate,
    handleGrade,
    handleReset,
    handleLogout,
  };

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Source+Sans+3:wght@400;600&family=Be+Vietnam+Pro:ital,wght@0,400;1,400&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        rel="stylesheet"
      />

      {page === 'login' && <LoginPage onLogin={handleLogin} />}
      {page === 'config' && (
        <VisitConfigPage {...commonProps} onSelectEstablishment={handleSelectEstablishment} />
      )}
      {page === 'dashboard' && (
        <DashboardPage {...commonProps} onDomainSelect={handleDomainSelect} onFinish={handleFinish} />
      )}
      {page === 'evaluation' && (
        <EvaluationPage {...commonProps} onDomainSelect={handleDomainSelect} onFinish={handleFinish} />
      )}
      {page === 'results' && (
        <ResultsPage {...commonProps} />
      )}
    </>
  );
}
