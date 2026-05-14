# Scheduler
Cross-platform mobile scheduler built with Expo and React Native.

## Features
- Add, edit, and remove scheduled events
- Recurrence options: none, daily, weekly, monthly, yearly
- Calendar view with selected date navigation
- Local persistence using AsyncStorage
- Insights screen for upcoming and recurrence summaries
- Android and iOS support via Expo

## Getting Started
1. Install dependencies:

```bash
npm install
```

2. Start the Expo project locally:

```bash
npm run start-local
```

3. Open the app on a device or emulator using the Expo CLI instructions.

## Store Readiness
- Uses Expo SDK 50 for Android API level 34+ compatibility.
- `app.json` includes `android.package` and `ios.bundleIdentifier` for store builds.
- `npm start` runs `expo start --localhost` for local environment development.

## Project Structure
- `App.js` — main navigation and context provider
- `context/EventContext.js` — event state, persistence, and recurrence logic
- `screens/HomeScreen.js` — schedule overview and quick actions
- `screens/CalendarScreen.js` — date selection and daily event list
- `screens/InsightsScreen.js` — recurrence and event analytics
- `screens/EventFormScreen.js` — add/edit event form
- `components/EventList.js` — reusable event list UI
