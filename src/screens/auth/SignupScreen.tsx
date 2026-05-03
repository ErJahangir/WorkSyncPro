/**
 * WorkSync Pro - Signup Screen
 */

import React, {useEffect} from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform} from 'react-native';
import {emailSchema, nameSchema, passwordSchema} from '@/utils';
import * as yup from 'yup';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useNavigation} from '@react-navigation/native';

import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {SignupFormData} from '@/types';
import {showToast} from '@/utils';
import {Button, Input} from '@/components';
import {useAppDispatch, useAppSelector} from '@/hooks';
import {clearAuthError, registerUser} from '@/store/slices';
import {RNText} from '@/components/common';

const schema = yup.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
});

export const SignupScreen: React.FC = () => {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const {isLoading, error} = useAppSelector(s => s.auth);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, []);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<SignupFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: SignupFormData) => {
    const result = await dispatch(
      registerUser({
        email: data.email,
        password: data.password,
        name: data.name,
      }),
    );

    if (registerUser.fulfilled.match(result)) {
      showToast('success', 'Account created! Please verify your email.');
      navigation.navigate('EmailVerification', {email: data.email});
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <RNText style={styles.title}>Create Account 🚀</RNText>
          <RNText style={styles.subtitle}>Join your team on WorkSync Pro</RNText>
        </View>

        {error && (
          <View style={styles.errorBanner}>
            <RNText style={styles.errorText}>⚠️ {error}</RNText>
          </View>
        )}

        <Controller
          control={control}
          name="name"
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              label="Full Name"
              required
              placeholder="John Doe"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.name?.message}
              leftIcon={<RNText style={styles.inputIcon}>👤</RNText>}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              label="Email Address"
              required
              placeholder="you@company.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
              leftIcon={<RNText style={styles.inputIcon}>✉️</RNText>}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              label="Password"
              required
              placeholder="Min. 8 characters"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
              showPasswordToggle
              secureTextEntry
              leftIcon={<RNText style={styles.inputIcon}>🔒</RNText>}
              hint="Use letters, numbers and special characters"
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              label="Confirm Password"
              required
              placeholder="Repeat your password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.confirmPassword?.message}
              showPasswordToggle
              secureTextEntry
              leftIcon={<RNText style={styles.inputIcon}>🔒</RNText>}
            />
          )}
        />

        <RNText style={styles.termsText}>
          By signing up, you agree to our{' '}
          <RNText style={styles.highlightText}>Terms of Service</RNText> and{' '}
          <RNText style={styles.highlightText}>Privacy Policy</RNText>
        </RNText>

        <Button
          title="Create Account"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          fullWidth
          size="lg"
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.signInButton}>
          <RNText style={styles.signInText}>
            Already have an account?{' '}
            <RNText style={styles.signInHighlight}>Sign In</RNText>
          </RNText>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    keyboardView: {flex: 1},
    scrollView: {
      backgroundColor: theme.colors.background,
    },
    content: {paddingHorizontal: 24, paddingTop: 70, paddingBottom: 40},
    header: {marginBottom: 32, gap: 8},
    title: {
      fontSize: 30,
      fontWeight: '800',
      letterSpacing: -0.5,
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: 15,
      color: theme.colors.textSecondary,
    },
    errorBanner: {
      padding: 12,
      borderRadius: 10,
      marginBottom: 16,
      backgroundColor: theme.colors.errorLight,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 13,
      fontWeight: '500',
    },
    inputIcon: {fontSize: 16},
    termsText: {
      color: theme.colors.textTertiary,
      fontSize: 12,
      marginBottom: 16,
      lineHeight: 18,
    },
    highlightText: {
      color: theme.colors.primary,
    },
    signInButton: {marginTop: 20},
    signInText: {
      color: theme.colors.textSecondary,
      textAlign: 'center',
      fontSize: 14,
    },
    signInHighlight: {
      color: theme.colors.primary,
      fontWeight: '700',
    },
  });
