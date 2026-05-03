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

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{password?: string; confirm?: string}>({});

  const validate = () => {
    const newErrors: {password?: string; confirm?: string} = {};
    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      newErrors.confirm = 'Passwords do not match';
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

      Alert.alert('Success', 'Your password has been updated successfully', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update password');
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
            <RNText style={styles.title}>Update Password</RNText>
            <RNText style={styles.subtitle}>
              Ensure your account stays secure by using a strong password.
            </RNText>
          </View>

          <Card style={styles.formCard}>
            <Input
              label="New Password"
              placeholder="Min 6 characters"
              secureTextEntry
              showPasswordToggle
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              autoCapitalize="none"
            />
            <View style={{height: 16}} />
            <Input
              label="Confirm New Password"
              placeholder="Repeat password"
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
              title={loading ? 'Updating...' : 'Update Password'}
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
