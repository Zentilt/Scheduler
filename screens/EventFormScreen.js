import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useEventContext } from '../context/EventContext';

const recurrenceOptions = [
  { key: 'none', label: 'None' },
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'yearly', label: 'Yearly' },
];

export default function EventFormScreen({ route, navigation }) {
  const { eventId, date } = route.params || {};
  const { events, addEvent, updateEvent, removeEvent } = useEventContext();

  const editingEvent = events.find((item) => item.id === eventId);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState(date || new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState('09:00');
  const [recurrence, setRecurrence] = useState('none');

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setDescription(editingEvent.description || '');
      setEventDate(editingEvent.date);
      setTime(editingEvent.time || '09:00');
      setRecurrence(editingEvent.recurrence || 'none');
    }
  }, [editingEvent]);

  const handleSave = () => {
    const eventPayload = {
      title: title.trim() || 'Untitled event',
      description: description.trim(),
      date: eventDate,
      time: time.trim(),
      recurrence,
      exceptions: editingEvent?.exceptions || [],
    };

    if (editingEvent) {
      updateEvent(editingEvent.id, eventPayload);
    } else {
      addEvent(eventPayload);
    }

    navigation.goBack();
  };

  const handleDelete = () => {
    if (editingEvent) {
      removeEvent(editingEvent.id);
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Event title"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Optional details"
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={eventDate}
          onChangeText={setEventDate}
          keyboardType="numbers-and-punctuation"
        />

        <Text style={styles.label}>Time</Text>
        <TextInput
          style={styles.input}
          placeholder="HH:MM"
          value={time}
          onChangeText={setTime}
          keyboardType="numbers-and-punctuation"
        />

        <Text style={styles.label}>Recurrence</Text>
        <View style={styles.recurrenceRow}>
          {recurrenceOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.recurrenceButton,
                recurrence === option.key && styles.recurrenceButtonActive,
              ]}
              onPress={() => setRecurrence(option.key)}
            >
              <Text
                style={recurrence === option.key ? styles.recurrenceLabelActive : styles.recurrenceLabel}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.actionButtons}>
          <View style={styles.buttonWrapper}>
            <Button title="Save event" onPress={handleSave} />
          </View>
          {editingEvent && (
            <View style={styles.buttonWrapper}>
              <Button title="Delete event" color="#d9534f" onPress={handleDelete} />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9fb',
  },
  form: {
    padding: 16,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ececec',
  },
  recurrenceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  recurrenceButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d4d4d8',
    marginRight: 8,
    marginBottom: 8,
  },
  recurrenceButtonActive: {
    backgroundColor: '#4f6cff',
    borderColor: '#4f6cff',
  },
  recurrenceLabel: {
    color: '#333',
  },
  recurrenceLabelActive: {
    color: '#ffffff',
  },
  actionButtons: {
    flexDirection: 'column',
  },
  buttonWrapper: {
    marginBottom: 12,
  },
});
