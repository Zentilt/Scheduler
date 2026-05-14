import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { EventProvider } from './context/EventContext';
import HomeScreen from './screens/HomeScreen';
import CalendarScreen from './screens/CalendarScreen';
import InsightsScreen from './screens/InsightsScreen';
import EventFormScreen from './screens/EventFormScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <EventProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Calendar" component={CalendarScreen} />
          <Stack.Screen name="Insights" component={InsightsScreen} />
          <Stack.Screen
            name="EventForm"
            component={EventFormScreen}
            options={{ title: 'Add / Edit Event' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </EventProvider>
  );
}
