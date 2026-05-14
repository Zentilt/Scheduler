import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function EventList({ events, onPress }) {
  return (
    <View style={styles.list}>
      {events.map((event) => (
        <TouchableOpacity key={event.id} style={styles.item} onPress={() => onPress(event)}>
          <View>
            <Text style={styles.title}>{event.title}</Text>
            <Text style={styles.subtitle}>{event.date} {event.time ? `• ${event.time}` : ''}</Text>
          </View>
          <Text style={styles.recurrence}>{event.recurrence || 'none'}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    marginBottom: 8,
  },
  item: {
    padding: 14,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 4,
    color: '#666',
  },
  recurrence: {
    color: '#4f6cff',
    fontWeight: '700',
  },
});
