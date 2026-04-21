/**
 * WorkSync Pro - Login Screen
 * Full form validation with React Hook Form + Yup
 */

import React, {useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@theme/ThemeProvider';
import {useAppDispatch} from '@hooks/useAppSelector';
import {useAppSelector} from '@hooks/useAppSelector';
import {loginUser, clearError} from '@store/slices/authSlice';
import {Button} from '@components/common/Button';
import {Input} from '@components/common/Input';
import {LoginFormData} from '@/types/index';

const schema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const LoginScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const {isLoading, error} = useAppSelector(state => state.auth);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {toValue: 1, duration: 500, useNativeDriver: true}),
      Animated.timing(slideAnim, {toValue: 0, duration: 500, useNativeDriver: true}),
    ]).start();
    return () => { dispatch(clearError()); };
  }, []);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    defaultValues: {email: '', password: ''},
  });

  const onSubmit = async (data: LoginFormData) => {
    await dispatch(loginUser(data));
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={[styles.container, {backgroundColor: theme.colors.background}]}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* Header area */}
        <Animated.View
          style={[
            styles.header,
            {opacity: fadeAnim, transform: [{translateY: slideAnim}]},
          ]}>
          <View
            style={[
              styles.logoIcon,
              {backgroundColor: theme.colors.primary},
            ]}>
            <Text style={{fontSize: 32}}>⚡</Text>
          </View>
          <Text
            style={[
              styles.title,
              {color: theme.colors.text, fontSize: theme.typography.fontSize['4xl']},
            ]}>
            Welcome back
          </Text>
          <Text
            style={[
              styles.subtitle,
              {
                color: theme.colors.textSecondary,
                fontSize: theme.typography.fontSize.base,
              },
            ]}>
            Sign in to your WorkSync Pro account
          </Text>
        </Animated.View>

        {/* Form */}
        <Animated.View
          style={[
            styles.form,
            {opacity: fadeAnim, transform: [{translateY: slideAnim}]},
          ]}>

          {/* Error banner */}
          {error && (
            <View
              style={[
                styles.errorBanner,
                {backgroundColor: theme.colors.errorLight},
              ]}>
              <Text style={{color: theme.colors.error, fontSize: 13, fontWeight: '500'}}>
                ⚠️ {error}
              </Text>
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
                leftIcon={<Text style={{fontSize: 16}}>✉️</Text>}
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
                leftIcon={<Text style={{fontSize: 16}}>🔒</Text>}
                showPasswordToggle
                secureTextEntry
              />
            )}
          />

          {/* Forgot password */}
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotButton}>
            <Text
              style={{
                color: theme.colors.primary,
                fontWeight: '600',
                fontSize: theme.typography.fontSize.sm,
              }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <Button
            title="Sign In"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            fullWidth
            size="lg"
            style={{marginTop: 8}}
          />

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View
              style={[styles.divider, {backgroundColor: theme.colors.border}]}
            />
            <Text
              style={[
                styles.dividerText,
                {color: theme.colors.textTertiary},
              ]}>
              or
            </Text>
            <View
              style={[styles.divider, {backgroundColor: theme.colors.border}]}
            />
          </View>

          {/* Sign up link */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Signup')}
            style={styles.signupLink}>
            <Text
              style={{
                color: theme.colors.textSecondary,
                fontSize: theme.typography.fontSize.base,
                textAlign: 'center',
              }}>
              Don't have an account?{' '}
              <Text
                style={{
                  color: theme.colors.primary,
                  fontWeight: '700',
                }}>
                Create Account
              </Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
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
  },
  title: {
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontWeight: '400',
  },
  form: {gap: 2},
  errorBanner: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 8,
    paddingVertical: 4,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 12,
  },
  divider: {flex: 1, height: 1},
  dividerText: {fontSize: 13},
  signupLink: {paddingVertical: 4},
});
