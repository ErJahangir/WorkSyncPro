import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {Badge} from '@/components';
import {RNText} from '@/components/common';

interface RecentTaskRowProps {
  task: any;
  onPress: () => void;
}

export const RecentTaskRow: React.FC<RecentTaskRowProps> = ({
  task,
  onPress,
}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);

  const priorityColors: Record<string, string> = {
    low: theme.colors.priorityLow,
    medium: theme.colors.priorityMedium,
    high: theme.colors.priorityHigh,
  };

  const statusBadgeVariant: Record<string, any> = {
    todo: 'info',
    in_progress: 'warning',
    completed: 'success',
  };

  const statusLabel: Record<string, string> = {
    todo: 'To Do',
    in_progress: 'In Progress',
    completed: 'Done',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={styles.taskRow}>
      <View
        style={[
          styles.priorityDot,
          {backgroundColor: priorityColors[task.priority]},
        ]}
      />
      <View style={styles.taskRowContent}>
        <RNText style={styles.taskRowTitle} numberOfLines={1}>
          {task.title}
        </RNText>
        {task.deadline && (
          <RNText style={styles.taskRowDeadline}>
            📅 {new Date(task.deadline).toLocaleDateString()}
          </RNText>
        )}
      </View>
      <Badge
        label={statusLabel[task.status]}
        variant={statusBadgeVariant[task.status]}
        size="sm"
      />
    </TouchableOpacity>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    taskRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      gap: 12,
      borderBottomColor: theme.colors.borderLight,
    },
    priorityDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      flexShrink: 0,
    },
    taskRowContent: {
      flex: 1,
    },
    taskRowTitle: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
    },
    taskRowDeadline: {
      fontSize: 11,
      marginTop: 2,
      color: theme.colors.textTertiary,
    },
  });
