/**
 * WorkSync Pro - Privacy Policy Screen
 */

import React, {useMemo} from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {RNText} from '@/components/common';

export const PrivacyPolicyScreen: React.FC = () => {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <RNText style={styles.title}>Privacy Policy</RNText>
          <RNText style={styles.lastUpdated}>Last Updated: May 2026</RNText>
        </View>

        <View style={styles.content}>
          <RNText style={styles.sectionTitle}>1. Information We Collect</RNText>
          <RNText style={styles.text}>
            We collect information you provide directly to us, such as when you create or modify your account,
            request customer support, or otherwise communicate with us. This information may include your name,
            email address, phone number, and profile picture.
          </RNText>

          <RNText style={styles.sectionTitle}>2. How We Use Information</RNText>
          <RNText style={styles.text}>
            We use the information we collect to provide, maintain, and improve our services,
            to develop new ones, and to protect WorkSync Pro and our users.
          </RNText>

          <RNText style={styles.sectionTitle}>3. Sharing of Information</RNText>
          <RNText style={styles.text}>
            We do not share your personal information with companies, organizations, or individuals outside of
            WorkSync Pro except in the following cases: with your consent, for external processing, or for legal reasons.
          </RNText>

          <RNText style={styles.sectionTitle}>4. Data Security</RNText>
          <RNText style={styles.text}>
            We use administrative, technical, and physical security measures to help protect your personal information.
            While we have taken reasonable steps to secure the personal information you provide to us, please be
            aware that despite our efforts, no security measures are perfect or impenetrable.
          </RNText>

          <RNText style={styles.sectionTitle}>5. Your Rights</RNText>
          <RNText style={styles.text}>
            You have the right to access, update, or delete the personal information we have on you. Whenever made possible,
            you can access, update or request deletion of your personal information directly within your account settings section.
          </RNText>
        </View>
      </ScrollView>
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
      paddingBottom: 40,
    },
    header: {
      marginBottom: 30,
    },
    title: {
      fontSize: 28,
      fontWeight: '800',
      color: theme.colors.text,
      marginBottom: 8,
    },
    lastUpdated: {
      fontSize: 14,
      color: theme.colors.textTertiary,
    },
    content: {
      gap: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
      marginTop: 10,
    },
    text: {
      fontSize: 15,
      color: theme.colors.textSecondary,
      lineHeight: 24,
    },
  });
