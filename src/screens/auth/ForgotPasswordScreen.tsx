/**
 * WorkSync Pro - Forgot Password Screen
 */

import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@theme/ThemeProvider';
import {useAppDispatch, useAppSelector} from '@hooks/useAppSelector';
import {forgotPassword} from '@store/slices/authSlice';
import {Button} from '@components/common/Button';
import {Input} from '@components/common/Input';
import {ForgotPasswordFormData} from '@/types/index';

const schema = yup.object({
  email: yup.string().required('Email is required').email('Invalid email'),
});

export const ForgotPasswordScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const {isLoading} = useAppSelector(s => s.auth);
  const [sent, setSent] = useState(false);

  const {control, handleSubmit, formState: {errors}, getValues} = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const result = await dispatch(forgotPassword(data.email));
    if (forgotPassword.fulfilled.match(result)) {
      setSent(true);
    }
  };

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={[styles.container, {backgroundColor: theme.colors.background}]}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={{fontSize: 20}}>←</Text>
        </TouchableOpacity>

        {!sent ? (
          <>
            <View style={styles.header}>
              <Text style={styles.icon}>🔑</Text>
              <Text style={[styles.title, {color: theme.colors.text}]}>Reset Password</Text>
              <Text style={[styles.subtitle, {color: theme.colors.textSecondary}]}>
                Enter your email and we'll send you reset instructions
              </Text>
            </View>

            <Controller control={control} name="email" render={({field: {onChange, onBlur, value}}) => (
              <Input label="Email Address" required placeholder="you@company.com"
                keyboardType="email-address" autoCapitalize="none"
                value={value} onChangeText={onChange} onBlur={onBlur}
                error={errors.email?.message} leftIcon={<Text style={{fontSize: 16}}>✉️</Text>} />
            )} />

            <Button title="Send Reset Email" onPress={handleSubmit(onSubmit)} loading={isLoading} fullWidth size="lg" style={{marginTop: 8}} />
          </>
        ) : (
          <View style={styles.successContainer}>
            <Text style={{fontSize: 64, textAlign: 'center'}}>📧</Text>
            <Text style={[styles.title, {color: theme.colors.text, textAlign: 'center'}]}>
              Check your inbox
            </Text>
            <Text style={[styles.subtitle, {color: theme.colors.textSecondary, textAlign: 'center'}]}>
              We sent password reset instructions to{'\n'}
              <Text style={{color: theme.colors.primary, fontWeight: '600'}}>
                {getValues('email')}
              </Text>
            </Text>
            <Button title="Back to Sign In" onPress={() => navigation.navigate('Login')} fullWidth size="lg" variant="outline" style={{marginTop: 32}} />
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
  const navigation = useNavigation<any>();
  const {email} = route.params;

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center', padding: 32}]}>
      <Text style={{fontSize: 72, marginBottom: 24}}>✅</Text>
      <Text style={[styles.title, {color: theme.colors.text, textAlign: 'center', marginBottom: 12}]}>
        Verify your email
      </Text>
      <Text style={[styles.subtitle, {color: theme.colors.textSecondary, textAlign: 'center', marginBottom: 32}]}>
        We sent a verification link to{'\n'}
        <Text style={{color: theme.colors.primary, fontWeight: '600'}}>{email}</Text>
        {'\n\n'}Please check your inbox and click the link to activate your account.
      </Text>
      <Button title="Go to Sign In" onPress={() => navigation.navigate('Login')} fullWidth size="lg" />
      <Button title="Resend Email" onPress={() => {}} variant="ghost" fullWidth size="md" style={{marginTop: 8}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  content: {paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40},
  backButton: {marginBottom: 32, width: 40, height: 40, justifyContent: 'center'},
  header: {marginBottom: 32, gap: 8},
  icon: {fontSize: 48, marginBottom: 8},
  title: {fontSize: 28, fontWeight: '800', letterSpacing: -0.5},
  subtitle: {fontSize: 15, lineHeight: 23},
  successContainer: {flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12},
});
