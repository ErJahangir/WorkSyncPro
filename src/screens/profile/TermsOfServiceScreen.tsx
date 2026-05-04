/**
 * WorkSync Pro - Terms of Service Screen
 */

import React, {useMemo} from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {RNText} from '@/components/common';

export const TermsOfServiceScreen: React.FC = () => {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {t} = useTranslation();

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <RNText style={styles.title}>{t('profile.termsOfService.title')}</RNText>
          <RNText style={styles.lastUpdated}>{t('profile.termsOfService.lastUpdated')}</RNText>
        </View>

        <View style={styles.content}>
          <RNText style={styles.sectionTitle}>{t('profile.termsOfService.section1.title')}</RNText>
          <RNText style={styles.text}>
            {t('profile.termsOfService.section1.text')}
          </RNText>

          <RNText style={styles.sectionTitle}>{t('profile.termsOfService.section2.title')}</RNText>
          <RNText style={styles.text}>
            {t('profile.termsOfService.section2.text')}
          </RNText>

          <RNText style={styles.sectionTitle}>{t('profile.termsOfService.section3.title')}</RNText>
          <RNText style={styles.text}>
            {t('profile.termsOfService.section3.text')}
          </RNText>

          <RNText style={styles.sectionTitle}>{t('profile.termsOfService.section4.title')}</RNText>
          <RNText style={styles.text}>
            {t('profile.termsOfService.section4.text')}
          </RNText>

          <RNText style={styles.sectionTitle}>{t('profile.termsOfService.section5.title')}</RNText>
          <RNText style={styles.text}>
            {t('profile.termsOfService.section5.text')}
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
