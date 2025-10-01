import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DatabaseService } from '../services/database.service';
import type { TokenUsage, UploadQuota } from '../types/database.types';
import './SubscriptionCard.css';

export function SubscriptionCard() {
  const { user, profile } = useAuth();
  const [tokenUsage, setTokenUsage] = useState<TokenUsage | null>(null);
  const [uploadQuota, setUploadQuota] = useState<UploadQuota | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      const [tokens, uploads] = await Promise.all([
        DatabaseService.getTokenUsage(user.id),
        DatabaseService.getUploadQuota(user.id),
      ]);

      setTokenUsage(tokens);
      setUploadQuota(uploads);
    } catch (error) {
      console.error('Error loading subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="subscription-card card">
        <div className="loading-spinner" />
      </div>
    );
  }

  const tokensUsed = tokenUsage?.tokens_used || 0;
  const tokensLimit = tokenUsage?.tokens_limit || 5000;
  const tokensRemaining = tokensLimit - tokensUsed;
  const tokensPercentage = (tokensUsed / tokensLimit) * 100;

  const uploadsRemaining = (uploadQuota?.uploads_limit || 1) - (uploadQuota?.uploads_used || 0);

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'free':
        return 'Free Plan';
      case 'student':
        return 'Student Pack';
      case 'pro':
        return 'Pro Plan';
      default:
        return 'Free Plan';
    }
  };

  return (
    <div className="subscription-card card">
      <div className="card-header">
        <div>
          <h3>{profile?.display_name || 'User'}</h3>
          <p className="tier-label">{getTierLabel(profile?.subscription_tier || 'free')}</p>
        </div>
      </div>

      <div className="usage-section">
        <div className="usage-item">
          <div className="usage-header">
            <span className="usage-label">AI Tokens</span>
            <span className="usage-value">
              {tokensUsed.toLocaleString()} / {tokensLimit.toLocaleString()}
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${tokensPercentage}%` }}
            />
          </div>
          <p className="usage-subtext">{tokensRemaining.toLocaleString()} tokens remaining</p>
        </div>

        <div className="usage-item">
          <div className="usage-header">
            <span className="usage-label">File Uploads</span>
            <span className="usage-value">{uploadsRemaining} remaining</span>
          </div>
          <div className="upload-indicator">
            {Array.from({ length: uploadQuota?.uploads_limit || 1 }).map((_, i) => (
              <div
                key={i}
                className={`upload-dot ${i < uploadsRemaining ? 'available' : 'used'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
