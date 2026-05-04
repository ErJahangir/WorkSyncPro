/**
 * WorkSync Pro - Change Password Screen
 * Securely update user password
 */

import React, {useState, useMemo} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {supabaseAuth} from '@/services';
import {Card, Button, Input} from '@/components';
import {RNText} from '@/components/common';
import {useNavigation} from '@react-navigation/native';

export const ChangePasswordScreen: React.FC = () => {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation = useNavigation();
  const {t} = useTranslation();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{password?: string; confirm?: string}>({});

  const validate = () => {
    const newErrors: {password?: string; confirm?: string} = {};
    if (password.length < 6) {
      newErrors.password = t('profile.changePassword.minLength');
    }
    if (password !== confirmPassword) {
      newErrors.confirm = t('profile.changePassword.mismatch');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const {error} = await supabaseAuth.updatePassword(password);
      if (error) throw error;

      Alert.alert(t('profile.changePassword.successTitle'), t('profile.changePassword.successMessage'), [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (err: any) {
      Alert.alert(t('profile.changePassword.errorTitle'), err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <RNText style={styles.title}>{t('profile.changePassword.title')}</RNText>
            <RNText style={styles.subtitle}>
              {t('profile.changePassword.subtitle')}
            </RNText>
          </View>

          <Card style={styles.formCard}>
            <Input
              label={t('profile.changePassword.newPassword')}
              placeholder={t('profile.changePassword.passwordPlaceholder')}
              secureTextEntry
              showPasswordToggle
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              autoCapitalize="none"
            />
            <View style={{height: 16}} />
            <Input
              label={t('profile.changePassword.confirmPassword')}
              placeholder={t('profile.changePassword.confirmPlaceholder')}
              secureTextEntry
              showPasswordToggle
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={errors.confirm}
              autoCapitalize="none"
            />
          </Card>

          <View style={styles.buttonContainer}>
            <Button
              title={loading ? t('profile.changePassword.updating') : t('profile.changePassword.updateBtn')}
              onPress={handleUpdate}
              loading={loading}
              disabled={loading || !password || !confirmPassword}
              fullWidth
              size="lg"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      padding: theme.spacing.base,
    },
    header: {
      marginBottom: 30,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    formCard: {
      padding: 20,
    },
    buttonContainer: {
      marginTop: 30,
    },
  });
