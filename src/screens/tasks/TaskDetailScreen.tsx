/**
 * WorkSync Pro - Task Detail Screen
 * Full task view with comments, attachments, status changes
 */

import React, {useEffect, useState, useRef, useCallback, useMemo} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {useAppDispatch, useAppSelector, useRealtimeComments} from '@/hooks';
import {fetchTaskById, updateTaskStatus, deleteTask} from '@/store/slices';
import {Avatar, Card, RNText} from '@/components';
import {db} from '@/services';
import {Comment, TaskStatus} from '@/types';
import {formatDeadline, isOverdue, showToast} from '@/utils';
import {
  CommentBubble,
  CommentInput,
  StatusSelector,
  TaskDetailHeader,
} from './components';
import {useTranslation} from 'react-i18next';

export const TaskDetailScreen: React.FC = () => {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useAppDispatch();
  const {taskId} = route.params;
  const {t} = useTranslation();

  const task = useAppSelector(s => s.tasks.selectedTask);
  const user = useAppSelector(s => s.auth.user);

  const [comments, setComments] = useState<Comment[]>([]);
  const [sendingComment, setSendingComment] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    dispatch(fetchTaskById(taskId));
    loadComments();
  }, [taskId, dispatch]);

  const loadComments = useCallback(async () => {
    setLoadingComments(true);
    try {
      const {data} = await db.getComments(taskId);
      setComments((data || []) as Comment[]);
    } finally {
      setLoadingComments(false);
    }
  }, [taskId]);

  useRealtimeComments(taskId, newComment => {
    setComments(prev => {
      if (prev.find(c => c.id === (newComment as Comment).id)) return prev;
      return [...prev, newComment as Comment];
    });
  });

  const handleStatusChange = useCallback(
    async (status: TaskStatus) => {
      if (!task) return;
      await dispatch(updateTaskStatus({taskId: task.id, status}));
      showToast(
        'success',
        t('tasks.taskDetail.statusUpdate', {status: t(`status.${status}`)}),
      );
    },
    [task, dispatch, t],
  );

  const handleDelete = useCallback(() => {
    Alert.alert(
      t('tasks.taskDetail.deleteTitle'),
      t('tasks.taskDetail.deleteConfirm'),
      [
        {text: t('tasks.taskDetail.cancelBtn'), style: 'cancel'},
        {
          text: t('tasks.taskDetail.deleteBtn'),
          style: 'destructive',
          onPress: async () => {
            await dispatch(deleteTask(taskId));
            navigation.goBack();
          },
        },
      ],
    );
  }, [taskId, dispatch, navigation, t]);

  const handleEdit = useCallback(
    () => navigation.navigate('EditTask', {task}),
    [navigation, task],
  );

  const handleSendComment = useCallback(
    async (text: string) => {
      if (!text.trim() || !user || sendingComment) return;
      setSendingComment(true);
      try {
        const {data, error} = await db.createComment({
          task_id: taskId,
          user_id: user.id,
          message: text,
          created_at: new Date().toISOString(),
        });
        if (!error && data) {
          setComments(prev => [...prev, data as Comment]);
          setTimeout(
            () => scrollRef.current?.scrollToEnd({animated: true}),
            100,
          );
        }
      } finally {
        setSendingComment(false);
      }
    },
    [taskId, user, sendingComment],
  );

  const priorityColors = useMemo(
    () =>
      ({
        low: theme.colors.priorityLow,
        medium: theme.colors.priorityMedium,
        high: theme.colors.priorityHigh,
      } as Record<string, string>),
    [theme.colors],
  );

  const overdue = useMemo(
    () =>
      task?.deadline
        ? isOverdue(task.deadline) && task.status !== 'completed'
        : false,
    [task?.deadline, task?.status],
  );

  if (!task) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}>
      {/* Header actions */}
      <TaskDetailHeader onEdit={handleEdit} onDelete={handleDelete} />

      <ScrollView
        ref={scrollRef}
        style={styles.flexOne}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* ─── Task Content ─── */}
        <View style={styles.headerSection}>
          <View style={styles.priorityRow}>
            <View
              style={[
                styles.priorityBadge,
                {backgroundColor: priorityColors[task.priority] + '20'},
              ]}>
              <View
                style={[
                  styles.priorityDot,
                  {backgroundColor: priorityColors[task.priority]},
                ]}
              />
              <RNText
                style={[
                  styles.priorityText,
                  {color: priorityColors[task.priority]},
                ]}>
                {t('tasks.taskDetail.priority', {priority: task.priority})}
              </RNText>
            </View>
          </View>

          <RNText style={styles.taskTitle}>{task.title}</RNText>

          {task.description && (
            <RNText style={styles.taskDesc}>{task.description}</RNText>
          )}
        </View>

        {/* Status Selector */}
        <Card style={styles.cardMargin}>
          <RNText style={styles.sectionLabel}>
            {t('tasks.taskDetail.changeStatus')}
          </RNText>
          <StatusSelector
            currentStatus={task.status}
            onStatusChange={handleStatusChange}
          />
        </Card>

        {/* Meta Info */}
        <Card style={styles.cardMargin}>
          <View style={styles.metaContainer}>
            {task.deadline && (
              <View style={styles.metaRow}>
                <RNText style={styles.metaLabel}>
                  {t('tasks.taskDetail.deadline')}
                </RNText>
                <RNText
                  style={[
                    styles.deadlineText,
                    {color: overdue ? theme.colors.error : theme.colors.text},
                  ]}>
                  {overdue ? '⚠️ ' : '📅 '}
                  {formatDeadline(task.deadline)}
                  {overdue && ` · ${t('tasks.taskDetail.overdue')}`}
                </RNText>
              </View>
            )}
            {task.creator && (
              <View style={styles.metaRow}>
                <RNText style={styles.metaLabel}>
                  {t('tasks.taskDetail.createdBy')}
                </RNText>
                <View style={styles.creatorInfo}>
                  <Avatar
                    name={task.creator.name}
                    uri={task.creator.avatar}
                    size={20}
                  />
                  <RNText style={styles.creatorName}>
                    {task.creator.name}
                  </RNText>
                </View>
              </View>
            )}
            {task.tags && task.tags.length > 0 && (
              <View style={styles.metaRow}>
                <RNText style={styles.metaLabel}>
                  {t('tasks.taskDetail.tags')}
                </RNText>
                <View style={styles.tagsContainer}>
                  {task.tags.map(tag => (
                    <View key={tag} style={styles.tag}>
                      <RNText style={styles.tagText}>#{tag}</RNText>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </Card>

        {/* Assignees */}
        {task.assignees && task.assignees.length > 0 && (
          <Card style={styles.cardMargin}>
            <RNText style={styles.assigneesTitle}>
              {t('tasks.taskDetail.assignees', {count: task.assignees.length})}
            </RNText>
            {task.assignees.map(member => (
              <View key={member.id} style={styles.memberRow}>
                <Avatar name={member.name} uri={member.avatar} size={36} />
                <View style={styles.flexOne}>
                  <RNText style={styles.memberName}>{member.name}</RNText>
                  <RNText style={styles.memberEmail}>{member.email}</RNText>
                </View>
              </View>
            ))}
          </Card>
        )}

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <RNText style={styles.discussionTitle}>
            💬 {t('tasks.taskDetail.discussion', {count: comments.length})}
          </RNText>

          {loadingComments ? (
            <ActivityIndicator
              color={theme.colors.primary}
              style={styles.loader}
            />
          ) : comments.length === 0 ? (
            <View style={styles.noComments}>
              <RNText style={styles.noCommentsIcon}>💭</RNText>
              <RNText style={styles.noCommentsText}>
                {t('tasks.taskDetail.noComments')}
              </RNText>
            </View>
          ) : (
            <View style={styles.commentsList}>
              {comments.map(comment => (
                <CommentBubble
                  key={comment.id}
                  comment={comment}
                  currentUserId={user?.id}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      {/* Comment Input */}
      <CommentInput
        onSend={handleSendComment}
        sending={sendingComment}
        user={user}
      />
    </KeyboardAvoidingView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
    },
    flexOne: {flex: 1},
    content: {
      paddingTop: 20,
      paddingHorizontal: theme.spacing.base,
    },
    headerSection: {marginBottom: 16},
    priorityRow: {flexDirection: 'row', gap: 8, marginBottom: 10},
    priorityBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 999,
      alignSelf: 'flex-start',
    },
    priorityDot: {width: 6, height: 6, borderRadius: 3},
    priorityText: {
      fontSize: 11,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    taskTitle: {
      fontSize: 22,
      fontWeight: '800',
      lineHeight: 30,
      letterSpacing: -0.3,
      marginBottom: 8,
      color: theme.colors.text,
    },
    taskDesc: {
      fontSize: 15,
      lineHeight: 23,
      color: theme.colors.textSecondary,
    },
    cardMargin: {marginBottom: 12},
    sectionLabel: {
      fontSize: 12,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      color: theme.colors.textSecondary,
    },
    metaContainer: {gap: 12},
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    metaLabel: {
      fontSize: 13,
      fontWeight: '500',
      color: theme.colors.textSecondary,
    },
    deadlineText: {
      fontWeight: '600',
      fontSize: 14,
    },
    creatorInfo: {flexDirection: 'row', alignItems: 'center', gap: 6},
    creatorName: {
      color: theme.colors.text,
      fontWeight: '500',
      fontSize: 14,
    },
    tagsContainer: {flexDirection: 'row', gap: 4, flexWrap: 'wrap'},
    tag: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      backgroundColor: theme.colors.surfaceVariant,
    },
    tagText: {
      color: theme.colors.textSecondary,
      fontSize: 11,
    },
    assigneesTitle: {
      fontSize: 12,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      color: theme.colors.textSecondary,
      marginBottom: 10,
    },
    memberRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 8,
    },
    memberName: {
      color: theme.colors.text,
      fontWeight: '600',
      fontSize: 14,
    },
    memberEmail: {
      color: theme.colors.textSecondary,
      fontSize: 12,
    },
    commentsSection: {marginBottom: 8},
    discussionTitle: {
      fontSize: 17,
      fontWeight: '700',
      marginBottom: 12,
      color: theme.colors.text,
    },
    loader: {marginVertical: 20},
    noComments: {alignItems: 'center', paddingVertical: 32},
    noCommentsIcon: {fontSize: 32, marginBottom: 8},
    noCommentsText: {
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    commentsList: {gap: 12},
    spacer: {height: 80},
  });
