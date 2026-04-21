/**
 * WorkSync Pro - Root Navigator
 * Handles auth flow, main app, and protected routes
 */

import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAppSelector} from '@hooks/useAppSelector';
import {useAppDispatch} from '@hooks/useAppSelector';
import {initializeAuth} from '@store/slices/authSlice';
import {AuthNavigator} from './AuthNavigator';
import {MainNavigator} from './MainNavigator';
import {OnboardingScreen} from '@screens/auth/OnboardingScreen';
import {useNetworkStatus} from '@hooks/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from '@constants/config';
import {RootStackParamList} from '@/types/index';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const {isAuthenticated, isInitialized} = useAppSelector(state => state.auth);
  const [hasSeenOnboarding, setHasSeenOnboarding] = React.useState<
    boolean | null
  >(null);

  useNetworkStatus(); // Initialize network listener

  useEffect(() => {
    const init = async () => {
      const seen = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_DONE);
      setHasSeenOnboarding(seen === 'true');
    };
    init();
  }, []);

  if (hasSeenOnboarding === null || !isInitialized) return null;

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
