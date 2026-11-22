import { useState, useEffect, useRef, useCallback } from 'react';
import './index.css';
import { loadFromStorage, saveToStorage } from './data/referentiel';
import { api, getToken, clearToken } from './api';
import LoginPage from './pages/LoginPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import VisitConfigPage from './pages/VisitConfigPage';
import DashboardPage from './pages/DashboardPage';
import EvaluationPage from './pages/EvaluationPage';
import ResultsPage from './pages/ResultsPage';
import AdminPage from './pages/AdminPage';

const DEFAULT_STATE = {
  user: null,
  establishment: null,
  establishments: [],
  evaluation: null, // { id, status } of the visit on the server
  comment: '',
  grades: {},
  scores: {},
  currentDomain: 0,
  currentCriterion: 0,
};

// The browser copy is only a cache; without a token it is stale and ignored.
function bootState() {
  const saved = loadFromStorage();
  if (!getToken() || !saved?.user) return DEFAULT_STATE;
  return { ...DEFAULT_STATE, ...saved };
}

function bootPage(state) {
  if (!state.user) return 'login';
  if (state.user.mustChangePassword) return 'password';
  if (!state.establishment || !state.evaluation) return 'config';
  return 'dashboard';
}

const SAVE_LABELS = {
  saving: { icon: 'sync', text: 'Enregistrement…' },
  saved: { icon: 'cloud_done', text: 'Enregistré' },
  error: { icon: 'cloud_off', text: 'Non enregistré — nouvelle tentative…' },
};

export default function App() {
  const [appState, setAppState] = useState(bootState);
  const [page, setPage] = useState(() => bootPage(bootState()));
  const [notice, setNotice] = useState(null);
  const [saveStatus, setSaveStatus] = useState('idle');

  const stateRef = useRef(appState);
  stateRef.current = appState;
  const noticeTimer = useRef(null);
  const timers = useRef({}); // criterionId -> debounce timer
  const pending = useRef({}); // criterionId -> { evalId, score } waiting for the timer
  const failed = useRef({}); // criterionId -> { evalId, score } the server did not get
  const inflight = useRef(new Set());
  const selecting = useRef(false);

  useEffect(() => {
    saveToStorage(appState);
  }, [appState]);

  const notify = useCallback((message) => {
    setNotice(message);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 6000);
  }, []);

  const refreshStatus = useCallback(() => {
    setSaveStatus(
      Object.keys(pending.current).length || inflight.current.size ? 'saving'
        : Object.keys(failed.current).length ? 'error' : 'saved',
    );
  }, []);

  const send = useCallback((criterionId, job) => {
    const p = api(`/evaluations/${job.evalId}/grades/${criterionId}`, { method: 'PUT', body: { score: job.score } })
      .then(() => { delete failed.current[criterionId]; })
      .catch((err) => {
        if (err.status === 409 || err.status === 404) {
          delete failed.current[criterionId];
          notify(err.message);
        } else {
          failed.current[criterionId] = job;
        }
      })
      .finally(() => { inflight.current.delete(p); refreshStatus(); });
    inflight.current.add(p);
    return p;
  }, [notify, refreshStatus]);

  // Sends everything waiting (and retries failures). True when the server has it all.
  const flushAll = useCallback(async () => {
    Object.keys(pending.current).forEach((cid) => {
      clearTimeout(timers.current[cid]);
      const job = pending.current[cid];
      delete pending.current[cid];
      send(cid, job);
    });
    Object.entries(failed.current).forEach(([cid, job]) => send(cid, job));
    await Promise.all([...inflight.current]);
    refreshStatus();
    return Object.keys(failed.current).length === 0;
  }, [send, refreshStatus]);

  // Forgets unsent grades (used by reset and logout).
  const dropUnsaved = useCallback(async () => {
    Object.values(timers.current).forEach(clearTimeout);
    pending.current = {};
    failed.current = {};
    await Promise.all([...inflight.current]);
    setSaveStatus('idle');
  }, []);

  const loadEstablishments = useCallback(() => {
    api('/establishments')
      .then(({ establishments }) => setAppState((s) => ({ ...s, establishments })))
      .catch(() => { /* the cached list is used */ });
  }, []);

  const handleLogout = useCallback(async () => {
    await dropUnsaved();
    clearToken();
    setAppState(DEFAULT_STATE);
    setPage('login');
  }, [dropUnsaved]);

  // On load: check the session, refresh the visit from the server (server wins over the browser copy).
  useEffect(() => {
    if (!getToken()) return;
    api('/auth/me')
      .then(({ user }) => {
        setAppState((s) => ({ ...s, user }));
        if (user.mustChangePassword) { setPage('password'); return null; }
        setPage((p) => (p === 'login' ? 'config' : p)); // valid token but the browser copy was cleared
        loadEstablishments();
        const ev = stateRef.current.evaluation;
        return ev ? api(`/evaluations/${ev.id}`) : null;
      })
      .then((res) => {
        if (!res) return;
        setAppState((s) => ({
          ...s,
          evaluation: { id: res.evaluation.id, status: res.evaluation.status },
          comment: res.evaluation.comment,
          grades: res.grades,
        }));
      })
      .catch((err) => {
        if (err.status === 404) {
          setAppState((s) => ({ ...s, establishment: null, evaluation: null, grades: {} }));
          setPage('config');
        }
        // 401 is handled by the auth-expired listener; network errors keep the cached copy
      });
  }, [loadEstablishments]);

  useEffect(() => {
    const onExpired = () => { handleLogout(); notify('Session expirée. Veuillez vous reconnecter.'); };
    const onOnline = () => { flushAll(); };
    const onUnload = (e) => {
      if (Object.keys(pending.current).length || Object.keys(failed.current).length || inflight.current.size) {
        e.preventDefault();
      }
    };
    window.addEventListener('auth-expired', onExpired);
    window.addEventListener('online', onOnline);
    window.addEventListener('beforeunload', onUnload);
    return () => {
      window.removeEventListener('auth-expired', onExpired);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('beforeunload', onUnload);
    };
  }, [handleLogout, notify, flushAll]);

  // Failed saves are retried every few seconds.
  useEffect(() => {
    if (saveStatus !== 'error') return undefined;
    const t = setTimeout(() => { flushAll(); }, 5000);
    return () => clearTimeout(t);
  }, [saveStatus, flushAll]);

  const navigate = (p) => setPage(p);

  const handleLogin = (user) => {
    setAppState({ ...DEFAULT_STATE, user });
    setPage(user.mustChangePassword ? 'password' : 'config');
    if (!user.mustChangePassword) loadEstablishments();
  };

  const handlePasswordChanged = (user) => {
    setAppState((s) => ({ ...s, user }));
    setPage('config');
    loadEstablishments();
  };

  const handleSelectEstablishment = async (est) => {
    if (selecting.current) return;
    selecting.current = true;
    try {
      await flushAll();
      const { evaluation, grades } = await api('/evaluations', { method: 'POST', body: { establishmentId: est.id } });
      setAppState((s) => ({
        ...s,
        establishment: est,
        evaluation: { id: evaluation.id, status: evaluation.status },
        comment: evaluation.comment,
        grades,
        currentDomain: 0,
        currentCriterion: 0,
      }));
      setSaveStatus('idle');
      setPage('dashboard');
    } catch (err) {
      notify(err.message);
    } finally {
      selecting.current = false;
    }
  };

  const handleGrade = (criterionId, grade) => {
    const ev = stateRef.current.evaluation;
    if (!ev) return;
    if (ev.status !== 'draft') {
      notify('Visite clôturée : modification impossible. Utilisez « Réinitialiser » pour commencer une nouvelle visite.');
      return;
    }
    setAppState((s) => ({ ...s, grades: { ...s.grades, [criterionId]: grade } }));
    delete failed.current[criterionId];
    pending.current[criterionId] = { evalId: ev.id, score: grade };
    clearTimeout(timers.current[criterionId]);
    timers.current[criterionId] = setTimeout(() => {
      const job = pending.current[criterionId];
      if (!job) return;
      delete pending.current[criterionId];
      send(criterionId, job);
      refreshStatus();
    }, 400);
    setSaveStatus('saving');
  };

  const handleDomainSelect = (domainIdx) => {
    setAppState((s) => ({ ...s, currentDomain: domainIdx, currentCriterion: 0 }));
    setPage('evaluation');
  };

  // "See results": saves what is pending and shows the results. The visit stays open until it is closed.
  const handleFinish = async () => {
    if (!(await flushAll())) {
      notify("Certaines notes ne sont pas encore enregistrées sur le serveur. Elles seront renvoyées automatiquement.");
    }
    try {
      const { scores } = await api('/rankings');
      setAppState((s) => ({ ...s, scores }));
    } catch { /* ranking just stays as it was */ }
    setPage('results');
  };

  // Locks the visit: the server computes the official score.
  const handleCloseVisit = async () => {
    const ev = stateRef.current.evaluation;
    if (!ev || ev.status !== 'draft') return;
    if (!(await flushAll())) {
      notify('Impossible de clôturer : des notes ne sont pas enregistrées. Vérifiez votre connexion.');
      return;
    }
    try {
      const r = await api(`/evaluations/${ev.id}/finish`, { method: 'POST' });
      const { scores } = await api('/rankings');
      setAppState((s) => ({ ...s, evaluation: { id: r.evaluation.id, status: r.evaluation.status }, grades: r.grades, scores }));
      notify(`Visite clôturée — score officiel : ${r.evaluation.finalScore} / 100`);
    } catch (err) {
      notify(err.message);
    }
  };

  const handleComment = async (text) => {
    const ev = stateRef.current.evaluation;
    if (!ev) return false;
    try {
      await api(`/evaluations/${ev.id}`, { method: 'PATCH', body: { comment: text } });
      setAppState((s) => ({ ...s, comment: text }));
      notify('Commentaire enregistré');
      return true;
    } catch (err) {
      notify(err.message);
      return false;
    }
  };

  // Draft: wipes its grades. Closed visit: starts a new draft (the old visit is kept).
  const handleReset = async () => {
    const { evaluation: ev, establishment } = stateRef.current;
    const ask = ev?.status === 'draft'
      ? 'Effacer toutes les notes de cette visite ?'
      : 'Commencer une nouvelle visite ? La visite clôturée reste conservée.';
    if (!window.confirm(ask)) return;
    await dropUnsaved();
    try {
      let evaluation = ev;
      if (ev?.status === 'draft') {
        await api(`/evaluations/${ev.id}/reset`, { method: 'POST' });
      } else if (establishment) {
        const res = await api('/evaluations', { method: 'POST', body: { establishmentId: establishment.id } });
        evaluation = { id: res.evaluation.id, status: res.evaluation.status };
      }
      setAppState((s) => ({ ...s, evaluation, comment: '', grades: {}, scores: {}, currentDomain: 0, currentCriterion: 0 }));
      setPage('dashboard');
    } catch (err) {
      notify(err.message);
    }
  };

  const commonProps = {
    appState,
    setAppState,
    navigate,
    handleGrade,
    handleReset,
    handleLogout,
    handleComment,
    handleCloseVisit,
  };

  const showSaveStatus = ['dashboard', 'evaluation'].includes(page) && SAVE_LABELS[saveStatus];

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
      {page === 'password' && (
        <ChangePasswordPage user={appState.user} onDone={handlePasswordChanged} onLogout={handleLogout} />
      )}
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
      {page === 'admin' && appState.user?.role === 'admin' && (
        <AdminPage {...commonProps} />
      )}

      {showSaveStatus && (
        <button
          onClick={() => flushAll()}
          title="Cliquez pour renvoyer maintenant"
          style={{
            position: 'fixed', left: '16px', bottom: '16px', zIndex: 60,
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', borderRadius: '999px', cursor: 'pointer',
            background: 'var(--surface-container-lowest)',
            border: '1px solid var(--outline-variant)',
            color: saveStatus === 'error' ? 'var(--error)' : 'var(--on-surface-variant)',
            fontFamily: 'var(--font-annotation)', fontSize: '12px',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{SAVE_LABELS[saveStatus].icon}</span>
          {SAVE_LABELS[saveStatus].text}
        </button>
      )}

      {notice && (
        <div
          role="status"
          onClick={() => setNotice(null)}
          style={{
            position: 'fixed', left: '50%', bottom: '24px', transform: 'translateX(-50%)', zIndex: 100,
            maxWidth: 'min(520px, calc(100vw - 32px))', padding: '12px 20px', borderRadius: '8px',
            background: 'var(--on-surface)', color: 'var(--surface)', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontSize: '14px', boxShadow: '0 6px 24px rgba(0,0,0,0.25)',
          }}
        >
          {notice}
        </div>
      )}
    </>
  );
}
