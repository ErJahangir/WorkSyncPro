/**
 * WorkSync Pro - Signup Screen
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
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@theme/ThemeProvider';
import {useAppDispatch, useAppSelector} from '@hooks/useAppSelector';
import {registerUser, clearError} from '@store/slices/authSlice';
import {Button} from '@components/common/Button';
import {Input} from '@components/common/Input';
import {showToast} from '@utils/toast';
import {SignupFormData} from '@/types/index';

const schema = yup.object({
  name: yup.string().required('Full name is required').min(2, 'Too short'),
  email: yup.string().required('Email is required').email('Invalid email'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'At least 8 characters'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
});

export const SignupScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const {isLoading, error} = useAppSelector(s => s.auth);

  useEffect(() => {
    return () => {
      dispatch(clearError());
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
    console.log(result);

    if (registerUser.fulfilled.match(result)) {
      showToast('success', 'Account created! Please verify your email.');
      navigation.navigate('EmailVerification', {email: data.email});
    }
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
        <View style={styles.header}>
          <Text style={[styles.title, {color: theme.colors.text}]}>
            Create Account 🚀
          </Text>
          <Text style={[styles.subtitle, {color: theme.colors.textSecondary}]}>
            Join your team on WorkSync Pro
          </Text>
        </View>

        {error && (
          <View
            style={[
              styles.errorBanner,
              {backgroundColor: theme.colors.errorLight},
            ]}>
            <Text
              style={{
                color: theme.colors.error,
                fontSize: 13,
                fontWeight: '500',
              }}>
              ⚠️ {error}
            </Text>
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
              leftIcon={<Text style={{fontSize: 16}}>👤</Text>}
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
              placeholder="Min. 8 characters"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
              showPasswordToggle
              secureTextEntry
              leftIcon={<Text style={{fontSize: 16}}>🔒</Text>}
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
              leftIcon={<Text style={{fontSize: 16}}>🔒</Text>}
            />
          )}
        />

        <Text
          style={{
            color: theme.colors.textTertiary,
            fontSize: 12,
            marginBottom: 16,
            lineHeight: 18,
          }}>
          By signing up, you agree to our{' '}
          <Text style={{color: theme.colors.primary}}>Terms of Service</Text>{' '}
          and <Text style={{color: theme.colors.primary}}>Privacy Policy</Text>
        </Text>

        <Button
          title="Create Account"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          fullWidth
          size="lg"
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={{marginTop: 20}}>
          <Text
            style={{
              color: theme.colors.textSecondary,
              textAlign: 'center',
              fontSize: 14,
            }}>
            Already have an account?{' '}
            <Text style={{color: theme.colors.primary, fontWeight: '700'}}>
              Sign In
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  content: {paddingHorizontal: 24, paddingTop: 70, paddingBottom: 40},
  header: {marginBottom: 32, gap: 8},
  title: {fontSize: 30, fontWeight: '800', letterSpacing: -0.5},
  subtitle: {fontSize: 15},
  errorBanner: {padding: 12, borderRadius: 10, marginBottom: 16},
});
