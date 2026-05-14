import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useEventContext } from '../context/EventContext';

export default function InsightsScreen() {
  const { events, upcomingEvents } = useEventContext();

  const dailyCounts = upcomingEvents.reduce((counts, event) => {
    counts[event.occurrenceDate] = (counts[event.occurrenceDate] || 0) + 1;
    return counts;
  }, {});

  const busiestDay = Object.keys(dailyCounts).reduce((best, day) => {
    if (!best || dailyCounts[day] > dailyCounts[best]) {
      return day;
    }
    return best;
  }, null);

  const recurrenceCounts = events.reduce((counts, event) => {
    counts[event.recurrence || 'none'] = (counts[event.recurrence || 'none'] || 0) + 1;
    return counts;
  }, {});

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Insights</Text>

      <ScrollView>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total saved events</Text>
          <Text style={styles.cardValue}>{events.length}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Upcoming events checked</Text>
          <Text style={styles.cardValue}>{upcomingEvents.length}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Busiest day in next 30 days</Text>
          <Text style={styles.cardValue}>{busiestDay || 'No upcoming events'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recurrence breakdown</Text>
          {['none', 'daily', 'weekly', 'monthly', 'yearly'].map((type) => (
            <View key={type} style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>{type}</Text>
              <Text style={styles.breakdownValue}>{recurrenceCounts[type] || 0}</Text>
            </View>
          ))}
        </View>
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
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2f6cff',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  breakdownLabel: {
    color: '#444',
  },
  breakdownValue: {
    fontWeight: '600',
  },
});
