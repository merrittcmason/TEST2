import { useEffect, useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { DatabaseService } from '../services/database.service';
import { OpenAIService } from '../services/openai.service';
import type { Event, ParsedEvent } from '../types/database.types';
import './CalendarPage.css';

interface CalendarPageProps {
  selectedDate?: Date;
}

export function CalendarPage({ selectedDate }: CalendarPageProps) {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [naturalText, setNaturalText] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsedEvents, setParsedEvents] = useState<ParsedEvent[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (user) {
      loadEvents();
    }
  }, [user, currentMonth]);

  const loadEvents = async () => {
    if (!user) return;

    try {
      const start = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
      const end = format(endOfMonth(currentMonth), 'yyyy-MM-dd');
      const eventsData = await DatabaseService.getEvents(user.id, start, end);
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const handleParseText = async () => {
    if (!naturalText.trim() || !user) return;

    setLoading(true);
    try {
      const tokenUsage = await DatabaseService.getTokenUsage(user.id);
      const result = await OpenAIService.parseNaturalLanguage(naturalText);

      OpenAIService.checkTokenLimit(
        result.tokensUsed,
        tokenUsage?.tokens_used || 0,
        tokenUsage?.tokens_limit || 5000
      );

      setParsedEvents(result.events);
      setShowConfirmation(true);
    } catch (error: any) {
      alert(error.message || 'Failed to parse text');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmEvents = async () => {
    if (!user || parsedEvents.length === 0) return;

    setLoading(true);
    try {
      const eventsToCreate = parsedEvents.map(event => ({
        ...event,
        event_time: event.event_time || null,
        event_tag: event.event_tag || '',
      }));

      await DatabaseService.createEvents(user.id, eventsToCreate);

      const result = await OpenAIService.parseNaturalLanguage(naturalText);
      await DatabaseService.updateTokenUsage(user.id, result.tokensUsed);

      setNaturalText('');
      setParsedEvents([]);
      setShowConfirmation(false);
      await loadEvents();
    } catch (error: any) {
      alert(error.message || 'Failed to create events');
    } finally {
      setLoading(false);
    }
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventsForDay = (date: Date) => {
    return events.filter((event) => isSameDay(new Date(event.event_date), date));
  };

  if (showConfirmation) {
    return (
      <div className="calendar-page">
        <div className="confirmation-page">
          <h2>Confirm Events</h2>
          <div className="parsed-events">
            {parsedEvents.map((event, index) => (
              <div key={index} className="parsed-event-row card">
                <input
                  type="text"
                  className="input-field"
                  value={event.event_name}
                  onChange={(e) => {
                    const updated = [...parsedEvents];
                    updated[index].event_name = e.target.value;
                    setParsedEvents(updated);
                  }}
                  placeholder="Event name"
                />
                <input
                  type="date"
                  className="input-field"
                  value={event.event_date}
                  onChange={(e) => {
                    const updated = [...parsedEvents];
                    updated[index].event_date = e.target.value;
                    setParsedEvents(updated);
                  }}
                />
                <input
                  type="time"
                  className="input-field"
                  value={event.event_time || ''}
                  onChange={(e) => {
                    const updated = [...parsedEvents];
                    updated[index].event_time = e.target.value;
                    updated[index].is_all_day = !e.target.value;
                    setParsedEvents(updated);
                  }}
                />
                <button
                  className="btn btn-danger"
                  onClick={() => setParsedEvents(parsedEvents.filter((_, i) => i !== index))}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          <div className="confirmation-actions">
            <button className="btn btn-secondary" onClick={() => setShowConfirmation(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleConfirmEvents} disabled={loading}>
              {loading ? 'Publishing...' : 'Confirm & Publish'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}>
          ←
        </button>
        <h2>{format(currentMonth, 'MMMM yyyy')}</h2>
        <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}>
          →
        </button>
      </div>

      <div className="calendar-grid">
        <div className="weekday-header">Sun</div>
        <div className="weekday-header">Mon</div>
        <div className="weekday-header">Tue</div>
        <div className="weekday-header">Wed</div>
        <div className="weekday-header">Thu</div>
        <div className="weekday-header">Fri</div>
        <div className="weekday-header">Sat</div>

        {calendarDays.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={index}
              className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`}
            >
              <div className="day-number">{format(day, 'd')}</div>
              {dayEvents.slice(0, 2).map((event) => (
                <div key={event.id} className="event-badge">
                  {event.event_name}
                </div>
              ))}
              {dayEvents.length > 2 && (
                <div className="event-more">+{dayEvents.length - 2} more</div>
              )}
            </div>
          );
        })}
      </div>

      <div className="event-input-section card">
        <h3>Add Event</h3>
        <textarea
          className="input-field"
          value={naturalText}
          onChange={(e) => setNaturalText(e.target.value)}
          placeholder="I have a meeting on October 3rd at 8:30 am"
          rows={3}
        />
        <button className="btn btn-primary" onClick={handleParseText} disabled={loading || !naturalText.trim()}>
          {loading ? 'Parsing...' : 'Parse & Add Event'}
        </button>
      </div>
    </div>
  );
}
