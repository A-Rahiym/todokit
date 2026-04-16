# TodoKit

TodoKit is a multi-tool mobile app built with Expo and React Native. It combines three everyday utilities in one place:

- Unit Converter
- Calculator
- Task/Checklist Manager

The app is organized with tab navigation and a modern, animated UI.

## Features

- Convert values across common categories (length, temperature, weight, currency)
- Perform quick arithmetic calculations
- Create, edit, search, and delete tasks
- Mark tasks as completed with a one-tap checkbox toggle
- Filter tasks by All, Active, or Completed
- Persistent local data storage with AsyncStorage
- Haptic feedback and subtle motion interactions

## Tech Stack

- Expo + React Native
- Expo Router (file-based navigation)
- TypeScript
- Zustand (state management)
- React Native Reanimated
- Expo Linear Gradient

## How To Run

1. Install dependencies:

```bash
npm install
```

1. Start development server:

```bash
npm run start
```

1. Run on your preferred target:

```bash
npm run android
# or
npm run ios
# or
npm run web
```

## Project Structure (Summary)

- app/: Route screens and navigation layout
  - app/(tabs)/: Main tab screens (Home, Converter, Calculator, Tasks)
- components/: Shared UI building blocks
- features/: Feature-specific UI parts
  - features/converter/
  - features/calculator/
  - features/notes/ (task/checklist UI)
- store/: Zustand stores and persisted app state
- utils/: Core logic (conversions, calculator helpers, theme constants)

## Useful Scripts

- npm run start: Start Expo dev server
- npm run android: Open Android target
- npm run ios: Open iOS target
- npm run web: Run web target
- npm run lint: Run lint checks
- npm run reset-project: Reset app scaffolding

## Notes

- This project uses file-based routing via Expo Router.
- Recommended Node and package manager versions should match your Expo SDK tooling.
- Task completion and filters persist locally with AsyncStorage, with in-memory fallback when storage is unavailable.