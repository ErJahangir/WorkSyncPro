/**
 * WorkSync Pro - Login Screen
 * Full form validation with React Hook Form + Yup
 */

import React, {useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import * as yup from 'yup';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {emailSchema, passwordSchema} from '@/utils';
import {useNavigation} from '@react-navigation/native';

import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {useAppDispatch, useAppSelector, useGoogleLogin} from '@/hooks';
import {clearAuthError, loginUser, loginWithGoogle} from '@/store/slices';
import {LoginFormData} from '@/types';
import {Button, Input} from '@/components';
import {RNText} from '@/components/common';

const schema = yup.object({
  email: emailSchema,
  password: passwordSchema,
});

export const LoginScreen: React.FC = () => {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const {isLoading, error} = useAppSelector(state => state.auth);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
    return () => {
      dispatch(clearAuthError());
    };
  }, []);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    defaultValues: {email: '', password: ''},
  });

  const {signInWithGoogle, isGoogleLoading} = useGoogleLogin();

  const onSubmit = async (data: LoginFormData) => {
    await dispatch(loginUser(data));
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
        {/* Header area */}
        <Animated.View
          style={[
            styles.header,
            {opacity: fadeAnim, transform: [{translateY: slideAnim}]},
          ]}>
          <View style={styles.logoIcon}>
            <RNText style={styles.logoEmoji}>⚡</RNText>
          </View>
          <RNText style={styles.title}>Welcome back</RNText>
          <RNText style={styles.subtitle}>
            Sign in to your WorkSync Pro account
          </RNText>
        </Animated.View>

        {/* Form */}
        <Animated.View
          style={[
            styles.form,
            {opacity: fadeAnim, transform: [{translateY: slideAnim}]},
          ]}>
          {/* Error banner */}
          {error && (
            <View style={styles.errorBanner}>
              <RNText style={styles.errorText}>⚠️ {error}</RNText>
            </View>
          )}

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
                autoComplete="email"
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
                placeholder="Enter your password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                leftIcon={<RNText style={styles.inputIcon}>🔒</RNText>}
                showPasswordToggle
                secureTextEntry
              />
            )}
          />

          {/* Forgot password */}
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotButton}>
            <RNText style={styles.forgotButtonText}>Forgot Password?</RNText>
          </TouchableOpacity>

          <Button
            title="Sign In"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            fullWidth
            size="lg"
            style={styles.submitButton}
          />

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <RNText style={styles.dividerText}>or</RNText>
            <View style={styles.divider} />
          </View>

          <Button
            title="Continue with Google"
            onPress={signInWithGoogle}
            variant="outline"
            fullWidth
            size="lg"
            loading={isGoogleLoading}
            icon={<RNText style={styles.googleIcon}>🌐</RNText>}
            style={styles.googleButton}
          />

          {/* Sign up link */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Signup')}
            style={styles.signupLink}>
            <RNText style={styles.signupText}>
              Don't have an account?{' '}
              <RNText style={styles.signupHighlight}>Create Account</RNText>
            </RNText>
          </TouchableOpacity>
        </Animated.View>
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
    content: {
      paddingHorizontal: 24,
      paddingTop: 80,
      paddingBottom: 40,
    },
    header: {
      alignItems: 'center',
      marginBottom: 40,
      gap: 12,
    },
    logoIcon: {
      width: 68,
      height: 68,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
      shadowColor: '#6366F1',
      shadowOffset: {width: 0, height: 6},
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 8,
      backgroundColor: theme.colors.primary,
    },
    logoEmoji: {fontSize: 32},
    title: {
      fontWeight: '800',
      letterSpacing: -0.5,
      color: theme.colors.text,
      fontSize: theme.typography.fontSize['4xl'],
    },
    subtitle: {
      fontWeight: '400',
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.base,
    },
    form: {gap: 2},
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
    forgotButton: {
      alignSelf: 'flex-end',
      marginBottom: 8,
      paddingVertical: 4,
    },
    forgotButtonText: {
      color: theme.colors.primary,
      fontWeight: '600',
      fontSize: theme.typography.fontSize.sm,
    },
    submitButton: {marginTop: 8},
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 20,
      gap: 12,
    },
    divider: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.border,
    },
    dividerText: {
      fontSize: 13,
      color: theme.colors.textTertiary,
    },
    googleIcon: {fontSize: 18},
    googleButton: {marginBottom: 16},
    signupLink: {paddingVertical: 4},
    signupText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.base,
      textAlign: 'center',
    },
    signupHighlight: {
      color: theme.colors.primary,
      fontWeight: '700',
    },
  });
