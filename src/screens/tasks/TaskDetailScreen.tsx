/**
 * WorkSync Pro - Task Detail Screen
 * Full task view with comments, attachments, status changes
 */

import React, {useEffect, useState, useRef} from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTheme} from '@theme/ThemeProvider';
import {useAppDispatch, useAppSelector} from '@hooks/useAppSelector';
import {fetchTaskById, updateTaskStatus, deleteTask, setSelectedTask} from '@store/slices/tasksSlice';
import {useRealtimeComments} from '@hooks/index';
import {Avatar, Badge, Card, Divider} from '@components/common/index';
import {db} from '@services/supabase';
import {Comment, Task, TaskStatus} from '@/types/index';
import {formatRelativeTime, formatDeadline, isOverdue} from '@utils/dateUtils';
import {showToast} from '@utils/toast';

const STATUS_OPTIONS: Array<{status: TaskStatus; label: string; icon: string; color: string}> = [
  {status: 'todo', label: 'To Do', icon: '📋', color: '#0EA5E9'},
  {status: 'in_progress', label: 'In Progress', icon: '⚡', color: '#F59E0B'},
  {status: 'completed', label: 'Completed', icon: '✅', color: '#10B981'},
];

export const TaskDetailScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useAppDispatch();
  const {taskId} = route.params;

  const task = useAppSelector(s => s.tasks.selectedTask);
  const {user} = useAppSelector(s => s.auth);

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [sendingComment, setSendingComment] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    dispatch(fetchTaskById(taskId));
    loadComments();
  }, [taskId]);

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const {data} = await db.getComments(taskId);
      setComments((data || []) as Comment[]);
    } finally {
      setLoadingComments(false);
    }
  };

  // Realtime comments
  useRealtimeComments(taskId, (newComment) => {
    setComments(prev => {
      if (prev.find(c => c.id === (newComment as Comment).id)) return prev;
      return [...prev, newComment as Comment];
    });
  });

  const handleStatusChange = async (status: TaskStatus) => {
    if (!task) return;
    await dispatch(updateTaskStatus({taskId: task.id, status}));
    showToast('success', `Status → ${status.replace('_', ' ')}`);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to permanently delete this task?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete', style: 'destructive',
          onPress: async () => {
            await dispatch(deleteTask(taskId));
            navigation.goBack();
          },
        },
      ],
    );
  };

  const handleSendComment = async () => {
    if (!commentText.trim() || !user || sendingComment) return;
    const text = commentText.trim();
    setCommentText('');
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
        setTimeout(() => scrollRef.current?.scrollToEnd({animated: true}), 100);
      }
    } finally {
      setSendingComment(false);
    }
  };

  const priorityColors: Record<string, string> = {
    low: theme.colors.priorityLow,
    medium: theme.colors.priorityMedium,
    high: theme.colors.priorityHigh,
  };

  if (!task) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background}}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  const overdue = task.deadline ? isOverdue(task.deadline) && task.status !== 'completed' : false;

  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: theme.colors.background}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}>

      {/* Header actions */}
      <View style={[styles.headerActions, {borderBottomColor: theme.colors.border}]}>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditTask', {task})}
          style={[styles.headerBtn, {backgroundColor: theme.colors.primaryLight}]}>
          <Text style={{color: theme.colors.primary, fontSize: 13, fontWeight: '600'}}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleDelete}
          style={[styles.headerBtn, {backgroundColor: theme.colors.errorLight}]}>
          <Text style={{color: theme.colors.error, fontSize: 13, fontWeight: '600'}}>Delete</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollRef}
        style={{flex: 1}}
        contentContainerStyle={[styles.content, {paddingHorizontal: theme.spacing.base}]}
        showsVerticalScrollIndicator={false}>

        {/* ─── Task Header ─── */}
        <View style={{marginBottom: 16}}>
          {/* Priority badge */}
          <View style={{flexDirection: 'row', gap: 8, marginBottom: 10}}>
            <View style={[styles.priorityBadge, {backgroundColor: priorityColors[task.priority] + '20'}]}>
              <View style={[styles.priorityDot, {backgroundColor: priorityColors[task.priority]}]} />
              <Text style={{color: priorityColors[task.priority], fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5}}>
                {task.priority} priority
              </Text>
            </View>
          </View>

          <Text style={[styles.taskTitle, {color: theme.colors.text}]}>
            {task.title}
          </Text>

          {task.description && (
            <Text style={[styles.taskDesc, {color: theme.colors.textSecondary}]}>
              {task.description}
            </Text>
          )}
        </View>

        {/* ─── Status Selector ─── */}
        <Card style={{marginBottom: 12}}>
          <Text style={[styles.sectionLabel, {color: theme.colors.textSecondary}]}>
            Change Status
          </Text>
          <View style={{flexDirection: 'row', gap: 8, marginTop: 8}}>
            {STATUS_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.status}
                onPress={() => handleStatusChange(opt.status)}
                activeOpacity={0.75}
                style={{
                  flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center',
                  backgroundColor: task.status === opt.status ? opt.color + '20' : theme.colors.surfaceVariant,
                  borderWidth: task.status === opt.status ? 1.5 : 0,
                  borderColor: opt.color,
                }}>
                <Text style={{fontSize: 18, marginBottom: 3}}>{opt.icon}</Text>
                <Text style={{
                  fontSize: 11, fontWeight: '600', textAlign: 'center',
                  color: task.status === opt.status ? opt.color : theme.colors.textSecondary,
                }}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* ─── Meta Info ─── */}
        <Card style={{marginBottom: 12}}>
          <View style={{gap: 12}}>
            {task.deadline && (
              <View style={styles.metaRow}>
                <Text style={[styles.metaLabel, {color: theme.colors.textSecondary}]}>Deadline</Text>
                <Text style={{
                  color: overdue ? theme.colors.error : theme.colors.text,
                  fontWeight: '600', fontSize: 14,
                }}>
                  {overdue ? '⚠️ ' : '📅 '}{formatDeadline(task.deadline)}
                  {overdue && ' · Overdue'}
                </Text>
              </View>
            )}
            {task.creator && (
              <View style={styles.metaRow}>
                <Text style={[styles.metaLabel, {color: theme.colors.textSecondary}]}>Created by</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                  <Avatar name={task.creator.name} uri={task.creator.avatar} size={20} />
                  <Text style={{color: theme.colors.text, fontWeight: '500', fontSize: 14}}>{task.creator.name}</Text>
                </View>
              </View>
            )}
            {task.tags && task.tags.length > 0 && (
              <View style={styles.metaRow}>
                <Text style={[styles.metaLabel, {color: theme.colors.textSecondary}]}>Tags</Text>
                <View style={{flexDirection: 'row', gap: 4, flexWrap: 'wrap'}}>
                  {task.tags.map(tag => (
                    <View key={tag} style={[styles.tag, {backgroundColor: theme.colors.surfaceVariant}]}>
                      <Text style={{color: theme.colors.textSecondary, fontSize: 11}}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </Card>

        {/* ─── Assignees ─── */}
        {task.assignees && task.assignees.length > 0 && (
          <Card style={{marginBottom: 12}}>
            <Text style={[styles.sectionLabel, {color: theme.colors.textSecondary, marginBottom: 10}]}>
              Assignees ({task.assignees.length})
            </Text>
            {task.assignees.map(member => (
              <View key={member.id} style={[styles.memberRow]}>
                <Avatar name={member.name} uri={member.avatar} size={36} />
                <View style={{flex: 1}}>
                  <Text style={{color: theme.colors.text, fontWeight: '600', fontSize: 14}}>{member.name}</Text>
                  <Text style={{color: theme.colors.textSecondary, fontSize: 12}}>{member.email}</Text>
                </View>
              </View>
            ))}
          </Card>
        )}

        {/* ─── Comments ─── */}
        <View style={{marginBottom: 8}}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text, marginBottom: 12}]}>
            💬 Discussion ({comments.length})
          </Text>

          {loadingComments ? (
            <ActivityIndicator color={theme.colors.primary} style={{marginVertical: 20}} />
          ) : comments.length === 0 ? (
            <View style={styles.noComments}>
              <Text style={{fontSize: 32, marginBottom: 8}}>💭</Text>
              <Text style={{color: theme.colors.textSecondary, textAlign: 'center'}}>
                No comments yet. Start the discussion!
              </Text>
            </View>
          ) : (
            <View style={{gap: 12}}>
              {comments.map(comment => (
                <View key={comment.id} style={{flexDirection: 'row', gap: 10}}>
                  <Avatar
                    name={comment.user?.name || '?'}
                    uri={comment.user?.avatar}
                    size={34}
                  />
                  <View style={{flex: 1}}>
                    <View style={[
                      styles.commentBubble,
                      {backgroundColor: comment.user_id === user?.id
                        ? theme.colors.primaryLight
                        : theme.colors.surfaceVariant},
                    ]}>
                      <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4}}>
                        <Text style={{color: theme.colors.text, fontWeight: '700', fontSize: 13}}>
                          {comment.user?.name || 'Unknown'}
                        </Text>
                        <Text style={{color: theme.colors.textTertiary, fontSize: 11}}>
                          {formatRelativeTime(comment.created_at)}
                        </Text>
                      </View>
                      <Text style={{color: theme.colors.text, fontSize: 14, lineHeight: 20}}>
                        {comment.message}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={{height: 80}} />
      </ScrollView>

      {/* ─── Comment Input ─── */}
      <View style={[
        styles.commentInput,
        {backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border},
      ]}>
        <Avatar name={user?.name || 'U'} uri={user?.avatar} size={34} />
        <View style={[styles.inputWrapper, {backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.border}]}>
          <TextInput
            placeholder="Write a comment..."
            placeholderTextColor={theme.colors.textTertiary}
            value={commentText}
            onChangeText={setCommentText}
            style={{flex: 1, color: theme.colors.text, fontSize: 14, paddingVertical: 8, paddingHorizontal: 12}}
            multiline
            maxLength={500}
          />
        </View>
        <TouchableOpacity
          onPress={handleSendComment}
          disabled={!commentText.trim() || sendingComment}
          style={[styles.sendBtn, {
            backgroundColor: commentText.trim() ? theme.colors.primary : theme.colors.surfaceVariant,
          }]}>
          {sendingComment
            ? <ActivityIndicator size="small" color="#fff" />
            : <Text style={{fontSize: 18}}>↑</Text>
          }
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  headerActions: {
    flexDirection: 'row', justifyContent: 'flex-end', gap: 8,
    paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1,
  },
  headerBtn: {paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10},
  content: {paddingTop: 20},
  priorityBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, alignSelf: 'flex-start',
  },
  priorityDot: {width: 6, height: 6, borderRadius: 3},
  taskTitle: {fontSize: 22, fontWeight: '800', lineHeight: 30, letterSpacing: -0.3, marginBottom: 8},
  taskDesc: {fontSize: 15, lineHeight: 23},
  sectionLabel: {fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5},
  sectionTitle: {fontSize: 17, fontWeight: '700'},
  metaRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  metaLabel: {fontSize: 13, fontWeight: '500'},
  tag: {paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6},
  memberRow: {flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8},
  noComments: {alignItems: 'center', paddingVertical: 32},
  commentBubble: {borderRadius: 12, padding: 12},
  commentInput: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10,
    padding: 12, borderTopWidth: 1,
  },
  inputWrapper: {flex: 1, borderRadius: 20, borderWidth: 1, overflow: 'hidden'},
  sendBtn: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: 'center', justifyContent: 'center',
  },
});
