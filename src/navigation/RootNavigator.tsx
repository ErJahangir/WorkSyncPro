/**
 * WorkSync Pro - Root Navigator
 * Handles auth flow, main app, and protected routes
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAppSelector} from '@hooks/useAppSelector';
import {AuthNavigator} from './AuthNavigator';
import {MainNavigator} from './MainNavigator';
import {OnboardingScreen} from '@screens/auth/OnboardingScreen';
import {useNetworkStatus} from '@hooks/index';
import {RootStackParamList} from '@/types/index';

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
