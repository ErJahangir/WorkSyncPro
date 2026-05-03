# WorkSync Pro

WorkSync Pro is a React Native mobile app for managing team work in one place. It combines task tracking, team collaboration, onboarding, authentication, and lightweight productivity analytics in a single cross-platform experience.

## Overview

The app is designed around day-to-day team coordination:

- onboard new users with a polished intro flow
- authenticate with Supabase
- create, browse, filter, and update tasks
- view task details, comments, and attachments
- manage team members and invitations
- monitor productivity from dashboard and analytics views
- persist app state locally for a smoother mobile experience

## Core Features

### Authentication and onboarding
- splash screen and first-run onboarding flow
- sign up, sign in, forgot password, and session restore
- persisted auth state with Redux Persist and AsyncStorage

### Task management
- task list with search, filters, status tabs, and pagination
- create, edit, and inspect task details
- task comments and file attachment support
- task priority and status tracking
- pull-to-refresh and loading skeletons

### Team collaboration
- team member directory
- member profile screens
- invite flow for adding teammates
- notification badge support in navigation

### Dashboard and analytics
- dashboard summary cards for tasks and team size
- recent task activity
- completion rate and productivity widgets
- analytics charts for progress, weekly activity, and task priority breakdown

## Tech Stack

- React Native `0.74`
- TypeScript
- React Navigation
- Redux Toolkit
- Redux Persist
- Supabase Auth, Database, Storage, and Realtime
- AsyncStorage
- React Hook Form + Yup
- React Native SVG and custom chart UI

## Project Structure

```text
src/
  components/     reusable UI and task-specific components
  constants/      app constants, storage keys, onboarding data
  hooks/          app hooks for state and shared behavior
  navigation/     auth flow, tabs, stacks, root navigation
  screens/        auth, dashboard, tasks, team, analytics, profile
  services/       Supabase client and notification wiring
  store/          Redux store and feature slices
  theme/          app theming and provider
  types/          shared TypeScript models
  utils/          helpers for dates, validation, storage, and toast
```

## Getting Started

### 1. Install dependencies

```bash
yarn install
```

### 2. Start Metro

```bash
yarn start
```

### 3. Run the app

For Android:

```bash
yarn android
```

For iOS:

```bash
yarn ios
```

## Available Scripts

- `yarn start` starts Metro with cache reset
- `yarn android` runs the Android app
- `yarn ios` runs the iOS app
- `yarn lint` runs ESLint
- `yarn test` runs Jest
- `yarn type-check` runs TypeScript checks
- `yarn aD` builds Android debug
- `yarn aR` builds Android release
- `yarn bR` builds Android app bundle release

## Backend Setup

The app is powered by **Supabase** (Auth, Database, Realtime) and **Firebase** (Cloud Messaging for notifications).

### Environment Variables

To run the app, you need to create a `.env` file in the root directory with the following variables:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
FIREBASE_WEB_CLIENT_ID=your_google_auth_client_id
```

### Native Config Files

The following files are required for native builds but are ignored by Git for security:
- `android/app/google-services.json`
- `ios/WorkSyncPro/GoogleService-Info.plist`
- `worksyncpro-68dca-firebase-adminsdk-fbsvc-74a5c45ce7.json` (Service Account for backend functions)

## Security & Push Protection

This repository has **GitHub Push Protection** enabled. 
- **NEVER** commit `.env` or Service Account JSON files.
- These files are already listed in `.gitignore`.
- If you accidentally try to push secrets, the push will be blocked.

## Architecture

- **State Management**: Redux Toolkit with slices for `auth`, `tasks`, `team`, `notifications`, and `ui`.
- **Persistence**: Redux Persist with `AsyncStorage`.
- **Styling**: Theme-aware styling system with support for custom typography (Inter, Roboto, Poppins).
- **Navigation**: React Navigation with protected routes for authenticated users.

## Current Screens

- **Auth**: Splash, Onboarding, Login, Signup, Forgot Password
- **Main**: Dashboard, Tasks, Team, Analytics, Profile
- **Task flow**: Task List, Task Detail, Create Task, Edit Task, Comments
- **Team flow**: Team List, Invite Member, Member Profile

## Development

- **Linting**: `yarn lint`
- **Testing**: `yarn test`
- **Type Checking**: `yarn type-check`

## Vision

WorkSync Pro aims to be a focused workspace companion for small teams: fast task execution, clearer ownership, and better visibility into what the team is working on right now.
