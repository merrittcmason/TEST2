import { SubscriptionCard } from '../components/SubscriptionCard';
import { WeekAtAGlance } from '../components/WeekAtAGlance';
import './HomePage.css';

interface HomePageProps {
  onNavigateToCalendar: (date?: Date) => void;
}

export function HomePage({ onNavigateToCalendar }: HomePageProps) {
  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Calendar Pilot</h1>
      </header>

      <div className="home-content">
        <SubscriptionCard />
        <WeekAtAGlance onDateClick={(date) => onNavigateToCalendar(date)} />
      </div>
    </div>
  );
}
