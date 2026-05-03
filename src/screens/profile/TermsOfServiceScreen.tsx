/**
 * WorkSync Pro - Terms of Service Screen
 */

import React, {useMemo} from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {RNText} from '@/components/common';

export const TermsOfServiceScreen: React.FC = () => {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <RNText style={styles.title}>Terms of Service</RNText>
          <RNText style={styles.lastUpdated}>Last Updated: May 2026</RNText>
        </View>

        <View style={styles.content}>
          <RNText style={styles.sectionTitle}>1. Acceptance of Terms</RNText>
          <RNText style={styles.text}>
            By accessing or using WorkSync Pro, you agree to be bound by these Terms of Service. If you do not agree to all
            the terms and conditions of this agreement, then you may not access the website or use any services.
          </RNText>

          <RNText style={styles.sectionTitle}>2. Use License</RNText>
          <RNText style={styles.text}>
            Permission is granted to temporarily download one copy of the materials (information or software) on WorkSync Pro
            for personal, non-commercial transitory viewing only.
          </RNText>

          <RNText style={styles.sectionTitle}>3. User Account</RNText>
          <RNText style={styles.text}>
            You are responsible for maintaining the confidentiality of your account and password and for restricting access
            to your computer or mobile device. You agree to accept responsibility for all activities that occur under your
            account or password.
          </RNText>

          <RNText style={styles.sectionTitle}>4. Limitations</RNText>
          <RNText style={styles.text}>
            In no event shall WorkSync Pro or its suppliers be liable for any damages (including, without limitation,
            damages for loss of data or profit, or due to business interruption) arising out of the use or inability
            to use the materials on WorkSync Pro.
          </RNText>

          <RNText style={styles.sectionTitle}>5. Governing Law</RNText>
          <RNText style={styles.text}>
            These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in
            which WorkSync Technologies is based and you irrevocably submit to the exclusive jurisdiction of the courts
            in that State or location.
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
