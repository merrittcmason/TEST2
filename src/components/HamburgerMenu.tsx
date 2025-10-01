import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './HamburgerMenu.css';

interface HamburgerMenuProps {
  onNavigate: (page: string) => void;
  onToggleTheme: () => void;
  currentTheme: 'dark' | 'light';
}

export function HamburgerMenu({ onNavigate, onToggleTheme, currentTheme }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut } = useAuth();

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <button className="hamburger-btn" onClick={() => setIsOpen(!isOpen)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="menu-overlay" onClick={() => setIsOpen(false)} />
          <nav className="hamburger-menu">
            <div className="menu-header">
              <h3>Menu</h3>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <ul className="menu-list">
              <li>
                <button className="menu-item" onClick={() => handleNavigate('settings')}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v6m0 6v6m5.2-14.4l-4.3 4.3m0 6.2l4.3 4.3M23 12h-6m-6 0H1m20.4-5.2l-4.3 4.3m-6.2 0L6.6 6.8M23 17.8l-4.3-4.3m-6.2 0L8.2 17.8" />
                  </svg>
                  Settings
                </button>
              </li>

              <li>
                <button className="menu-item" onClick={onToggleTheme}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {currentTheme === 'dark' ? (
                      <>
                        <circle cx="12" cy="12" r="5" />
                        <line x1="12" y1="1" x2="12" y2="3" />
                        <line x1="12" y1="21" x2="12" y2="23" />
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                        <line x1="1" y1="12" x2="3" y2="12" />
                        <line x1="21" y1="12" x2="23" y2="12" />
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                      </>
                    ) : (
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    )}
                  </svg>
                  Theme: {currentTheme === 'dark' ? 'Light' : 'Dark'}
                </button>
              </li>

              <li>
                <button className="menu-item" onClick={() => handleNavigate('account')}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Account
                </button>
              </li>

              <li>
                <button className="menu-item" onClick={() => handleNavigate('subscription')}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  Subscription
                </button>
              </li>

              <li>
                <button className="menu-item" onClick={() => handleNavigate('export')}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Export
                </button>
              </li>

              <li className="menu-divider"></li>

              <li>
                <button className="menu-item sign-out" onClick={handleSignOut}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Sign Out
                </button>
              </li>
            </ul>
          </nav>
        </>
      )}
    </>
  );
}
