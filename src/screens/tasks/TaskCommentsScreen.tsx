/**
 * WorkSync Pro - Task Comments Screen
 * Dedicated view for task discussion (Placeholder)
 */

import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {RNText} from '@/components/common';

export const TaskCommentsScreen: React.FC = () => {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <RNText style={styles.title}>{t('tasks.commentsPlaceholder.title')}</RNText>
      <RNText style={styles.subtitle}>{t('tasks.commentsPlaceholder.subtitle')}</RNText>
      <RNText style={styles.hint}>
        {t('tasks.commentsPlaceholder.hint')}
      </RNText>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
      padding: 20,
    },
    title: {
      color: theme.colors.text,
      fontSize: 24,
      fontWeight: '700',
    },
    subtitle: {
      color: theme.colors.textSecondary,
      fontSize: 16,
      marginTop: 8,
      textAlign: 'center',
    },
    hint: {
      color: theme.colors.textTertiary,
      fontSize: 14,
      marginTop: 16,
      textAlign: 'center',
    },
  });
