/**
 * WorkSync Pro - Redux Store Configuration
 * Uses Redux Toolkit with redux-persist for offline state
 */

import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import authReducer from './slices/authSlice';
import tasksReducer from './slices/tasksSlice';
import teamReducer from './slices/teamSlice';
import notificationsReducer from './slices/notificationsSlice';
import uiReducer from './slices/uiSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  tasks: tasksReducer,
  team: teamReducer,
  notifications: notificationsReducer,
  ui: uiReducer,
});

const persistConfig = {
  key: 'worksync-root',
  storage: AsyncStorage,
  // Only persist auth and ui state; tasks/team are refreshed on mount
  whitelist: ['auth', 'ui'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: __DEV__,
});

export const persistor = persistStore(store);

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
