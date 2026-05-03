/**
 * WorkSync Pro - Root Navigator
 * Handles auth flow, main app, and protected routes
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/types';
import {OnboardingScreen} from '@/screens';
import {MainNavigator} from './MainNavigator';
import {AuthNavigator} from './AuthNavigator';
import {useAppSelector, useNetworkStatus} from '@/hooks';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const {isAuthenticated, isInitialized, hasSeenOnboarding} = useAppSelector(
    state => state.auth,
  );

  useNetworkStatus(); // Initialize network listener

  if (!isInitialized) return null;

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {!hasSeenOnboarding ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : isAuthenticated ? (
        <Stack.Screen name="Main" component={MainNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};
