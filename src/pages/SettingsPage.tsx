import { useAuth } from '../contexts/AuthContext';
import './SettingsPage.css';

export function SettingsPage() {
  const { profile, user } = useAuth();

  return (
    <div className="settings-page">
      <h1>Settings</h1>

      <div className="settings-section card">
        <h2>Account Information</h2>
        <div className="info-row">
          <span className="label">Name:</span>
          <span className="value">{profile?.display_name || 'Not set'}</span>
        </div>
        <div className="info-row">
          <span className="label">Email:</span>
          <span className="value">{user?.email || 'Not set'}</span>
        </div>
        <div className="info-row">
          <span className="label">Plan:</span>
          <span className="value">{profile?.subscription_tier || 'free'}</span>
        </div>
      </div>

      <div className="settings-section card">
        <h2>App Info</h2>
        <div className="info-row">
          <span className="label">Version:</span>
          <span className="value">1.0.0</span>
        </div>
        <div className="info-row">
          <span className="label">Build:</span>
          <span className="value">MVP</span>
        </div>
      </div>
    </div>
  );
}
