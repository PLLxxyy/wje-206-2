import { useState, useCallback } from 'react';
import HomePage from './pages/HomePage';
import AddSleepPage from './pages/AddSleepPage';
import WeeklyPage from './pages/WeeklyPage';
import MonthlyPage from './pages/MonthlyPage';
import SettingsPage from './pages/SettingsPage';

type Page = 'home' | 'weekly' | 'monthly' | 'settings';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [showAdd, setShowAdd] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSaved = useCallback(() => {
    setShowAdd(false);
    setRefreshKey(k => k + 1);
  }, []);

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <HomePage key={refreshKey} />;
      case 'weekly':
        return <WeeklyPage key={refreshKey} />;
      case 'monthly':
        return <MonthlyPage key={refreshKey} />;
      case 'settings':
        return <SettingsPage key={refreshKey} />;
    }
  };

  return (
    <>
      <div className="header">
        <h1>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4fc3f7" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
          睡眠质量追踪
        </h1>
      </div>

      <div className="page">
        {renderPage()}
      </div>

      <button className="fab" onClick={() => setShowAdd(true)} title="记录睡眠">
        +
      </button>

      <nav className="nav">
        <button className={`nav-item ${page === 'home' ? 'active' : ''}`} onClick={() => setPage('home')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          首页
        </button>
        <button className={`nav-item ${page === 'weekly' ? 'active' : ''}`} onClick={() => setPage('weekly')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          周统计
        </button>
        <button className={`nav-item ${page === 'monthly' ? 'active' : ''}`} onClick={() => setPage('monthly')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          月度
        </button>
        <button className={`nav-item ${page === 'settings' ? 'active' : ''}`} onClick={() => setPage('settings')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          设置
        </button>
      </nav>

      {showAdd && (
        <AddSleepPage onClose={() => setShowAdd(false)} onSaved={handleSaved} />
      )}
    </>
  );
}
