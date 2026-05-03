/**
 * WorkSync Pro - Invite Member Screen
 * Allows inviting new members via email
 */

import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView, TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {Button} from '@/components';
import {RolePicker} from './components';
import {RNText} from '@/components/common';

export const InviteMemberScreen: React.FC = () => {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'manager' | 'user'>('user');
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    if (!email.trim()) return;
    setLoading(true);
    // Simulation
    setTimeout(() => {
      setLoading(false);
      navigation.goBack();
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <RNText style={styles.cancelText}>Cancel</RNText>
        </TouchableOpacity>
        <RNText style={styles.headerTitle}>Invite Member</RNText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <RNText style={styles.heroIcon}>📧</RNText>
        <RNText style={styles.description}>
          Enter the email address of the person you'd like to invite to your
          team.
        </RNText>

        <RNText style={styles.fieldLabel}>Email Address</RNText>
        <View style={styles.inputWrapper}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="colleague@company.com"
            placeholderTextColor={theme.colors.textTertiary}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.textInput}
          />
        </View>

        <RNText style={[styles.fieldLabel, styles.marginTop16]}>Role</RNText>
        <RolePicker selectedRole={role} onSelect={setRole} />

        <Button
          title="Send Invitation"
          onPress={handleInvite}
          loading={loading}
          fullWidth
          size="lg"
        />
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    cancelText: {
      color: theme.colors.textSecondary,
      fontSize: 15,
    },
    headerTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: theme.colors.text,
    },
    headerSpacer: {
      width: 60,
    },
    scrollContent: {
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 40,
    },
    heroIcon: {
      fontSize: 32,
      textAlign: 'center',
      marginBottom: 16,
    },
    description: {
      fontSize: 14,
      lineHeight: 22,
      textAlign: 'center',
      marginBottom: 24,
      color: theme.colors.textSecondary,
    },
    fieldLabel: {
      fontSize: 12,
      fontWeight: '600',
      marginBottom: 8,
      textTransform: 'uppercase',
      letterSpacing: 0.4,
      color: theme.colors.textSecondary,
    },
    inputWrapper: {
      borderRadius: 12,
      borderWidth: 1.5,
      overflow: 'hidden',
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    },
    textInput: {
      flex: 1,
      color: theme.colors.text,
      fontSize: 14,
      padding: 14,
    },
    marginTop16: {
      marginTop: 16,
    },
  });
