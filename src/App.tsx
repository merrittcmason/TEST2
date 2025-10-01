import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LaunchScreen } from './components/LaunchScreen';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { HomePage } from './pages/HomePage';
import { CalendarPage } from './pages/CalendarPage';
import { SettingsPage } from './pages/SettingsPage';
import { HamburgerMenu } from './components/HamburgerMenu';
import { BottomNav } from './components/BottomNav';
import './styles/globals.css';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [showLaunch, setShowLaunch] = useState(true);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [currentPage, setCurrentPage] = useState('home');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  useEffect(() => {
    if (profile?.theme_preference) {
      setTheme(profile.theme_preference);
    }
  }, [profile]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSelectedDate(undefined);
  };

  const handleNavigateToCalendar = (date?: Date) => {
    setSelectedDate(date);
    setCurrentPage('calendar');
  };

  if (loading) {
    return <div className="loading-spinner" style={{ margin: '50vh auto' }} />;
  }

  if (showLaunch) {
    return (
      <LaunchScreen
        onComplete={() => setShowLaunch(false)}
        userName={user ? profile?.display_name : undefined}
      />
    );
  }

  if (!user) {
    return authView === 'login' ? (
      <LoginPage onSwitchToSignup={() => setAuthView('signup')} />
    ) : (
      <SignupPage onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  return (
    <>
      <HamburgerMenu
        onNavigate={handleNavigate}
        onToggleTheme={handleToggleTheme}
        currentTheme={theme}
      />

      {currentPage === 'home' && <HomePage onNavigateToCalendar={handleNavigateToCalendar} />}
      {currentPage === 'calendar' && <CalendarPage selectedDate={selectedDate} />}
      {currentPage === 'settings' && <SettingsPage />}
      {currentPage === 'account' && <SettingsPage />}
      {currentPage === 'subscription' && (
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
          <h2>Subscription Management</h2>
          <p>Coming soon...</p>
        </div>
      )}
      {currentPage === 'export' && (
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
          <h2>Export Events</h2>
          <p>Coming soon...</p>
        </div>
      )}

      <BottomNav currentPage={currentPage} onNavigate={handleNavigate} />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
