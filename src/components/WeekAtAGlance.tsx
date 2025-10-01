import { useEffect, useState, useRef } from 'react';
import { format, addDays, subDays, startOfDay, isSameDay } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { DatabaseService } from '../services/database.service';
import type { Event } from '../types/database.types';
import './WeekAtAGlance.css';

interface WeekAtAGlanceProps {
  onDateClick: (date: Date) => void;
}

export function WeekAtAGlance({ onDateClick }: WeekAtAGlanceProps) {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const today = startOfDay(new Date());
  const startDate = subDays(today, 3);
  const endDate = addDays(today, 14);

  const days: Date[] = [];
  for (let i = 0; i <= 17; i++) {
    days.push(addDays(startDate, i));
  }

  useEffect(() => {
    if (user) {
      loadEvents();
    }

    if (scrollRef.current) {
      const todayIndex = 3;
      const dayWidth = 80;
      scrollRef.current.scrollLeft = todayIndex * dayWidth - 40;
    }
  }, [user]);

  const loadEvents = async () => {
    if (!user) return;

    try {
      const startDateStr = format(startDate, 'yyyy-MM-dd');
      const endDateStr = format(endDate, 'yyyy-MM-dd');
      const eventsData = await DatabaseService.getEvents(user.id, startDateStr, endDateStr);
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const getEventsForDay = (date: Date) => {
    return events.filter((event) => isSameDay(new Date(event.event_date), date));
  };

  const isToday = (date: Date) => isSameDay(date, today);

  return (
    <div className="week-at-a-glance">
      <h2>Week at a Glance</h2>
      <div className="week-scroll" ref={scrollRef}>
        <div className="days-container">
          {days.map((date, index) => {
            const dayEvents = getEventsForDay(date);
            const isCurrentDay = isToday(date);

            return (
              <button
                key={index}
                className={`day-card ${isCurrentDay ? 'today' : ''}`}
                onClick={() => onDateClick(date)}
              >
                <div className="day-label">{format(date, 'EEE')}</div>
                <div className={`day-number ${isCurrentDay ? 'today-number' : ''}`}>
                  {format(date, 'd')}
                </div>
                {dayEvents.length > 0 && (
                  <div className="event-indicators">
                    {dayEvents.slice(0, 3).map((_, i) => (
                      <div key={i} className="event-dot" />
                    ))}
                    {dayEvents.length > 3 && <span className="event-more">+{dayEvents.length - 3}</span>}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
