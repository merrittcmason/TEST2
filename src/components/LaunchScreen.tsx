import { useEffect, useState } from 'react';
import './LaunchScreen.css';

interface LaunchScreenProps {
  onComplete: () => void;
  userName?: string;
}

export function LaunchScreen({ onComplete, userName }: LaunchScreenProps) {
  const [progress, setProgress] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (userName) {
            setShowWelcome(true);
            setTimeout(() => onComplete(), 2000);
          } else {
            onComplete();
          }
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete, userName]);

  return (
    <div className="launch-screen">
      {showWelcome && userName ? (
        <div className="welcome-message fade-in">
          <h1>Welcome back, {userName}!</h1>
        </div>
      ) : (
        <>
          <h1 className="app-title">Calendar Pilot</h1>
          <div className="loading-bar">
            <div className="loading-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </>
      )}
    </div>
  );
}
