import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Avatar} from '@/components';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {RNText} from '@/components/common';

interface TopPerformerItemProps {
  rank: number;
  completed: number;
  user: {
    name: string;
    avatar?: string;
  } | null;
  isLast: boolean;
}

export const TopPerformerItem: React.FC<TopPerformerItemProps> = ({
  rank,
  completed,
  user,
  isLast,
}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const {t} = useTranslation();

  const getRankBg = () => {
    switch (rank) {
      case 1:
        return '#FFD700';
      case 2:
        return '#C0C0C0';
      case 3:
        return '#CD7F32';
      default:
        return theme.colors.surfaceVariant;
    }
  };

  return (
    <View
      style={[
        styles.container,
        !isLast && styles.borderBottom,
        {borderBottomColor: theme.colors.divider},
      ]}>
      <View style={[styles.rankBadge, {backgroundColor: getRankBg()}]}>
        <RNText style={styles.rankText}>{rank}</RNText>
      </View>
      <Avatar name={user?.name || '?'} uri={user?.avatar} size={36} />
      <View style={styles.userInfo}>
        <RNText style={styles.userName}>{user?.name || 'Unknown'}</RNText>
        <RNText style={styles.taskCount}>
          {t('analytics.tasksCompletedCount', {count: completed})}
        </RNText>
      </View>
      <View style={styles.countBadge}>
        <RNText style={styles.countText}>{completed}</RNText>
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 10,
    },
    borderBottom: {
      borderBottomWidth: 1,
    },
    rankBadge: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rankText: {
      fontSize: 12,
      fontWeight: '700',
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      color: theme.colors.text,
      fontWeight: '600',
      fontSize: 14,
    },
    taskCount: {
      color: theme.colors.textSecondary,
      fontSize: 11,
    },
    countBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: theme.colors.successLight,
    },
    countText: {
      color: theme.colors.success,
      fontSize: 11,
      fontWeight: '700',
    },
  });
