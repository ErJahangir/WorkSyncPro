/**
 * WorkSync Pro - Task Comments Screen
 * Dedicated view for task discussion (Placeholder)
 */

import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {RNText} from '@/components/common';

export const TaskCommentsScreen: React.FC = () => {
  const {theme} = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <RNText style={styles.title}>Comments</RNText>
      <RNText style={styles.subtitle}>Full discussion thread coming soon.</RNText>
      <RNText style={styles.hint}>
        Check Task Detail for the current discussion.
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
