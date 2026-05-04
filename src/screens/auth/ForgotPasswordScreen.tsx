/**
 * WorkSync Pro - Forgot Password Screen
 */

import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {useTranslation} from 'react-i18next';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {useAppDispatch, useAppSelector} from '@/hooks';
import {forgotPassword} from '@/store/slices';
import {Button, Input} from '@/components';
import {ForgotPasswordFormData} from '@/types';
import {RNText} from '@/components/common';

const schema = yup.object({
  email: yup.string().required('Email is required').email('Invalid email'),
});

export const ForgotPasswordScreen: React.FC = () => {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const {t} = useTranslation();
  const {isLoading} = useAppSelector(s => s.auth);
  const [sent, setSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const result = await dispatch(forgotPassword(data.email));
    if (forgotPassword.fulfilled.match(result)) {
      setSent(true);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <RNText style={styles.backButtonText}>←</RNText>
        </TouchableOpacity>

        {!sent ? (
          <>
            <View style={styles.header}>
              <RNText style={styles.icon}>🔑</RNText>
              <RNText style={styles.title}>{t('auth.forgotPassword.title')}</RNText>
              <RNText style={styles.subtitle}>
                {t('auth.forgotPassword.subtitle')}
              </RNText>
            </View>

            <Controller
              control={control}
              name="email"
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  label={t('auth.login.emailLabel')}
                  required
                  placeholder={t('auth.login.emailPlaceholder')}
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

            <Button
              title={t('auth.forgotPassword.sendEmail')}
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              fullWidth
              size="lg"
              style={styles.submitButton}
            />
          </>
        ) : (
          <View style={styles.successContainer}>
            <RNText style={styles.successIcon}>📧</RNText>
            <RNText style={styles.successTitle}>{t('auth.forgotPassword.successTitle')}</RNText>
            <RNText style={styles.successSubtitle}>
              {t('auth.forgotPassword.successSubtitle')} {'\n'}
              <RNText style={styles.highlightText}>{getValues('email')}</RNText>
            </RNText>
            <Button
              title={t('auth.forgotPassword.backToSignIn')}
              onPress={() => navigation.navigate('Login')}
              fullWidth
              size="lg"
              variant="outline"
              style={styles.backToSignInButton}
            />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

/**
 * WorkSync Pro - Email Verification Screen
 */
export const EmailVerificationScreen: React.FC<{route: any}> = ({route}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();
  const {t} = useTranslation();
  const {email} = route.params;

  return (
    <View style={styles.verifyContainer}>
      <RNText style={styles.verifyIcon}>✅</RNText>
      <RNText style={styles.verifyTitle}>{t('auth.verifyEmail.title')}</RNText>
      <RNText style={styles.verifySubtitle}>
        {t('auth.verifyEmail.subtitle')} {'\n'}
        <RNText style={styles.highlightText}>{email}</RNText>
        {'\n\n'}{t('auth.verifyEmail.instruction')}
      </RNText>
      <Button
        title={t('auth.verifyEmail.goToSignIn')}
        onPress={() => navigation.navigate('Login')}
        fullWidth
        size="lg"
      />
      <Button
        title={t('auth.verifyEmail.resendEmail')}
        onPress={() => {}}
        variant="ghost"
        fullWidth
        size="md"
        style={styles.resendButton}
      />
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    keyboardView: {flex: 1},
    scrollView: {
      backgroundColor: theme.colors.background,
    },
    content: {paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40},
    backButton: {
      marginBottom: 32,
      width: 40,
      height: 40,
      justifyContent: 'center',
    },
    backButtonText: {fontSize: 20},
    header: {marginBottom: 32, gap: 8},
    icon: {fontSize: 48, marginBottom: 8},
    title: {
      fontSize: 28,
      fontWeight: '800',
      letterSpacing: -0.5,
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: 15,
      lineHeight: 23,
      color: theme.colors.textSecondary,
    },
    inputIcon: {fontSize: 16},
    submitButton: {marginTop: 8},
    successContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
    },
    successIcon: {fontSize: 64, textAlign: 'center'},
    successTitle: {
      fontSize: 28,
      fontWeight: '800',
      letterSpacing: -0.5,
      color: theme.colors.text,
      textAlign: 'center',
    },
    successSubtitle: {
      fontSize: 15,
      lineHeight: 23,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    highlightText: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
    backToSignInButton: {marginTop: 32},
    verifyContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    },
    verifyIcon: {fontSize: 72, marginBottom: 24},
    verifyTitle: {
      fontSize: 28,
      fontWeight: '800',
      letterSpacing: -0.5,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 12,
    },
    verifySubtitle: {
      fontSize: 15,
      lineHeight: 23,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 32,
    },
    resendButton: {marginTop: 8},
  });
