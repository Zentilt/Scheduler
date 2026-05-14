import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EVENTS_KEY = '@scheduler_events';
const EventContext = createContext(null);

const todayString = () => new Date().toISOString().slice(0, 10);

const parseDate = (value) => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

const getDayDifference = (from, to) => {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((to.getTime() - from.getTime()) / msPerDay);
};

const occursOnDate = (event, dateString) => {
  if (!event) return false;
  const eventDate = parseDate(event.date);
  const date = parseDate(dateString);

  if (event.exceptions?.includes(dateString)) {
    return false;
  }

  if (event.date === dateString) {
    return true;
  }

  if (!event.recurrence || event.recurrence === 'none') {
    return false;
  }

  if (date < eventDate) {
    return false;
  }

  const diff = getDayDifference(eventDate, date);

  switch (event.recurrence) {
    case 'daily':
      return diff >= 0;
    case 'weekly':
      return date.getUTCDay() === eventDate.getUTCDay() && diff % 7 === 0;
    case 'monthly':
      return date.getUTCDate() === eventDate.getUTCDate() && diff >= 0;
    case 'yearly':
      return date.getUTCDate() === eventDate.getUTCDate() && date.getUTCMonth() === eventDate.getUTCMonth();
    default:
      return false;
  }
};

const sortEvents = (events) => [...events].sort((a, b) => (a.date > b.date ? 1 : a.date < b.date ? -1 : 0));

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(todayString());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const json = await AsyncStorage.getItem(EVENTS_KEY);
        if (json) {
          setEvents(JSON.parse(json));
        }
      } catch (error) {
        console.warn('Failed to load events', error);
      } finally {
        setLoaded(true);
      }
    };

    loadEvents();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const saveEvents = async () => {
      try {
        await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(events));
      } catch (error) {
        console.warn('Failed to save events', error);
      }
    };
    saveEvents();
  }, [events, loaded]);

  const addEvent = (event) => {
    setEvents((current) => sortEvents([...current, { ...event, id: `${Date.now()}` }]));
  };

  const updateEvent = (id, updates) => {
    setEvents((current) => sortEvents(current.map((event) => (event.id === id ? { ...event, ...updates } : event))));
  };

  const removeEvent = (id) => {
    setEvents((current) => current.filter((event) => event.id !== id));
  };

  const addException = (id, exceptionDate) => {
    setEvents((current) =>
      current.map((event) =>
        event.id === id
          ? {
              ...event,
              exceptions: Array.from(new Set([...(event.exceptions || []), exceptionDate])),
            }
          : event,
      ),
    );
  };

  const getEventsForDate = (dateString) => {
    return events.filter((event) => occursOnDate(event, dateString));
  };

  const getUpcomingEvents = () => {
    const today = todayString();
    const next30Days = Array.from({ length: 30 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() + index);
      return date.toISOString().slice(0, 10);
    });

    return next30Days
      .flatMap((date) => getEventsForDate(date).map((event) => ({ ...event, occurrenceDate: date })))
      .sort((a, b) => (a.occurrenceDate > b.occurrenceDate ? 1 : a.occurrenceDate < b.occurrenceDate ? -1 : 0));
  };

  const getMarkedDates = () => {
    const marked = {};
    events.forEach((event) => {
      if (!event.date) return;
      marked[event.date] = { marked: true, dotColor: '#2f95dc' };
      if (event.recurrence && event.recurrence !== 'none') {
        for (let i = 1; i <= 45; i += 1) {
          const future = new Date();
          future.setDate(future.getDate() + i);
          const futureKey = future.toISOString().slice(0, 10);
          if (occursOnDate(event, futureKey)) {
            marked[futureKey] = { marked: true, dotColor: '#2f95dc' };
          }
        }
      }
    });
    return marked;
  };

  const upcomingEvents = getUpcomingEvents();

  return (
    <EventContext.Provider
      value={{
        events,
        selectedDate,
        setSelectedDate,
        addEvent,
        updateEvent,
        removeEvent,
        addException,
        getEventsForDate,
        getMarkedDates,
        upcomingEvents,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within EventProvider');
  }
  return context;
};
