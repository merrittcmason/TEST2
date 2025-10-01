import './BottomNav.css';

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      <button
        className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
        onClick={() => onNavigate('home')}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span>Home</span>
      </button>

      <button
        className={`nav-item ${currentPage === 'calendar' ? 'active' : ''}`}
        onClick={() => onNavigate('calendar')}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span>Calendar</span>
      </button>

      <button
        className={`nav-item ${currentPage === 'settings' ? 'active' : ''}`}
        onClick={() => onNavigate('settings')}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v6m0 6v6m5.2-14.4l-4.3 4.3m0 6.2l4.3 4.3M23 12h-6m-6 0H1m20.4-5.2l-4.3 4.3m-6.2 0L6.6 6.8M23 17.8l-4.3-4.3m-6.2 0L8.2 17.8" />
        </svg>
        <span>Settings</span>
      </button>
    </nav>
  );
}
