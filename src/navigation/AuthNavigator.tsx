/**
 * WorkSync Pro - Auth Navigator
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@/types/index';
import {LoginScreen} from '@screens/auth/LoginScreen';
import {SignupScreen} from '@screens/auth/SignupScreen';
import {
  EmailVerificationScreen,
  ForgotPasswordScreen,
} from '@screens/auth/ForgotPasswordScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <Stack.Screen
      name="EmailVerification"
      component={EmailVerificationScreen}
    />
  </Stack.Navigator>
);
