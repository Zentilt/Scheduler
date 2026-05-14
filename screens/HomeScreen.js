import React from 'react';
import { Button, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useEventContext } from '../context/EventContext';
import EventList from '../components/EventList';

export default function HomeScreen({ navigation }) {
  const { selectedDate, setSelectedDate, getEventsForDate, upcomingEvents } = useEventContext();
  const events = getEventsForDate(selectedDate);
  const nextEvent = upcomingEvents.find((event) => event.occurrenceDate >= selectedDate);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scheduler</Text>
        <Text style={styles.subtitle}>Selected date: {selectedDate}</Text>
      </View>

      <View style={styles.buttonRow}>
        <Button title="Calendar" onPress={() => navigation.navigate('Calendar')} />
        <Button title="Insights" onPress={() => navigation.navigate('Insights')} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today&apos;s events</Text>
        {events.length === 0 ? (
          <Text style={styles.emptyText}>No events for this date.</Text>
        ) : (
          <EventList
            events={events}
            onPress={(event) => navigation.navigate('EventForm', { eventId: event.id, date: selectedDate })}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Next event</Text>
        {nextEvent ? (
          <View style={styles.card}>
            <Text style={styles.eventTitle}>{nextEvent.title}</Text>
            <Text style={styles.eventSubtitle}>{nextEvent.occurrenceDate}</Text>
            <Text>{nextEvent.description || 'No details added.'}</Text>
          </View>
        ) : (
          <Text style={styles.emptyText}>No upcoming events in the next 30 days.</Text>
        )}
      </View>

      <Button
        title="Add Event"
        onPress={() => navigation.navigate('EventForm', { date: selectedDate })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9fb',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  emptyText: {
    color: '#777',
  },
  card: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  eventSubtitle: {
    color: '#666',
    marginBottom: 6,
  },
});
