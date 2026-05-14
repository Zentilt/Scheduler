import React from 'react';
import { Button, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useEventContext } from '../context/EventContext';
import EventList from '../components/EventList';

export default function CalendarScreen({ navigation }) {
  const { selectedDate, setSelectedDate, getEventsForDate, getMarkedDates } = useEventContext();
  const events = getEventsForDate(selectedDate);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Calendar</Text>
      <Calendar
        current={selectedDate}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          ...getMarkedDates(),
          [selectedDate]: { selected: true, selectedColor: '#4f6cff' },
        }}
        style={styles.calendar}
      />

      <View style={styles.infoRow}>
        <Text style={styles.subtitle}>Events on {selectedDate}</Text>
        <Button
          title="Add Event"
          onPress={() => navigation.navigate('EventForm', { date: selectedDate })}
        />
      </View>

      <ScrollView style={styles.eventList}>
        {events.length === 0 ? (
          <Text style={styles.emptyText}>No events for this day.</Text>
        ) : (
          <EventList
            events={events}
            onPress={(event) => navigation.navigate('EventForm', { eventId: event.id, date: selectedDate })}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9fb',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
  },
  calendar: {
    borderRadius: 12,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  eventList: {
    flex: 1,
  },
  emptyText: {
    color: '#777',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
});
