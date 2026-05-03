/**
 * WorkSync Pro - Task Card Component
 * Reusable card for displaying task info in lists
 */

import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme} from '@/theme';
import {Task, TaskPriority, TaskStatus} from '@/types';
import {formatDeadline, isOverdue} from '@/utils';
import {Avatar, Badge, RNText} from '../common';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onLongPress?: () => void;
}

const PRIORITY_CONFIG: Record<
  TaskPriority,
  {icon: string; label: string; variant: any}
> = {
  low: {icon: '🟢', label: 'Low', variant: 'success'},
  medium: {icon: '🟡', label: 'Medium', variant: 'warning'},
  high: {icon: '🔴', label: 'High', variant: 'error'},
};

const STATUS_CONFIG: Record<
  TaskStatus,
  {icon: string; label: string; variant: any}
> = {
  todo: {icon: '○', label: 'To Do', variant: 'info'},
  in_progress: {icon: '◑', label: 'In Progress', variant: 'warning'},
  completed: {icon: '●', label: 'Done', variant: 'success'},
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onPress,
  onLongPress,
}) => {
  const {theme} = useTheme();
  const priority = PRIORITY_CONFIG[task.priority];
  const status = STATUS_CONFIG[task.status];
  const overdue = task.deadline
    ? isOverdue(task.deadline) && task.status !== 'completed'
    : false;

  const priorityColors: Record<TaskPriority, string> = {
    low: theme.colors.priorityLow,
    medium: theme.colors.priorityMedium,
    high: theme.colors.priorityHigh,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.78}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: overdue
            ? theme.colors.error + '40'
            : theme.colors.borderLight,
          shadowColor: theme.isDark ? '#000' : '#6366F1',
        },
      ]}>
      {/* Priority stripe */}
      <View
        style={[
          styles.priorityStripe,
          {backgroundColor: priorityColors[task.priority]},
        ]}
      />

      <View style={styles.content}>
        {/* Top row */}
        <View style={styles.topRow}>
          <View style={styles.titleContainer}>
            <RNText
              style={[
                styles.title,
                {
                  color: theme.colors.text,
                  textDecorationLine:
                    task.status === 'completed' ? 'line-through' : 'none',
                  opacity: task.status === 'completed' ? 0.6 : 1,
                },
              ]}
              numberOfLines={2}>
              {task.title}
            </RNText>
          </View>
          <Badge label={status.label} variant={status.variant} size="sm" dot />
        </View>

        {/* Description */}
        {task.description ? (
          <RNText
            style={[styles.description, {color: theme.colors.textSecondary}]}
            numberOfLines={2}>
            {task.description}
          </RNText>
        ) : null}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {task.tags.slice(0, 3).map(tag => (
              <View
                key={tag}
                style={[
                  styles.tag,
                  {backgroundColor: theme.colors.surfaceVariant},
                ]}>
                <RNText
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: 10,
                    fontWeight: '500',
                  }}>
                  #{tag}
                </RNText>
              </View>
            ))}
            {task.tags.length > 3 && (
              <RNText style={{color: theme.colors.textTertiary, fontSize: 10}}>
                +{task.tags.length - 3}
              </RNText>
            )}
          </View>
        )}

        {/* Bottom row */}
        <View style={styles.bottomRow}>
          {/* Assignees */}
          <View style={styles.assignees}>
            {task.assignees?.slice(0, 3).map((user, idx) => (
              <View
                key={user.id}
                style={[styles.assigneeAvatar, {marginLeft: idx > 0 ? -8 : 0}]}>
                <Avatar name={user.name} uri={user.avatar} size={24} />
              </View>
            ))}
            {(task.assignees?.length || 0) > 3 && (
              <View
                style={[
                  styles.moreAssignees,
                  {backgroundColor: theme.colors.surfaceVariant},
                ]}>
                <RNText
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: 9,
                    fontWeight: '600',
                  }}>
                  +{(task.assignees?.length || 0) - 3}
                </RNText>
              </View>
            )}
          </View>

          <View style={styles.metaRight}>
            {/* Comments */}
            {(task.comments_count || 0) > 0 && (
              <View style={styles.metaItem}>
                <RNText style={{fontSize: 11}}>💬</RNText>
                <RNText
                  style={[styles.metaText, {color: theme.colors.textTertiary}]}>
                  {task.comments_count}
                </RNText>
              </View>
            )}

            {/* Deadline */}
            {task.deadline && (
              <View style={styles.metaItem}>
                <RNText style={{fontSize: 11}}>📅</RNText>
                <RNText
                  style={[
                    styles.metaText,
                    {
                      color: overdue
                        ? theme.colors.error
                        : theme.colors.textTertiary,
                      fontWeight: overdue ? '600' : '400',
                    },
                  ]}>
                  {overdue ? 'Overdue' : formatDeadline(task.deadline)}
                </RNText>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 12,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  priorityStripe: {
    width: 4,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  content: {flex: 1, padding: 14, gap: 6},
  topRow: {flexDirection: 'row', alignItems: 'flex-start', gap: 8},
  titleContainer: {flex: 1},
  title: {fontSize: 15, fontWeight: '600', lineHeight: 21},
  description: {fontSize: 13, lineHeight: 18},
  tagsRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 4},
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  assignees: {flexDirection: 'row', alignItems: 'center'},
  assigneeAvatar: {borderRadius: 12, borderWidth: 1.5, borderColor: '#fff'},
  moreAssignees: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  metaRight: {flexDirection: 'row', alignItems: 'center', gap: 10},
  metaItem: {flexDirection: 'row', alignItems: 'center', gap: 3},
  metaText: {fontSize: 11},
});
