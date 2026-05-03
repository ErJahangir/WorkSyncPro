import React from 'react';
import {ActivityIndicator, StyleSheet, TouchableOpacity, View, TextInput} from 'react-native';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import type {TaskStatus, Comment} from '@/types';
import {Avatar} from '@/components';
import {formatRelativeTime} from '@/utils/dateUtils';
import {RNText} from '@/components/common';

interface TaskDetailHeaderProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const TaskDetailHeader = React.memo<TaskDetailHeaderProps>(({
  onEdit,
  onDelete,
}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.headerActions}>
      <TouchableOpacity onPress={onEdit} style={styles.editBtn}>
        <RNText style={styles.editBtnText}>Edit</RNText>
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
        <RNText style={styles.deleteBtnText}>Delete</RNText>
      </TouchableOpacity>
    </View>
  );
});

interface StatusSelectorProps {
  currentStatus: TaskStatus;
  onStatusChange: (status: TaskStatus) => void;
}

const STATUS_OPTIONS: Array<{
  status: TaskStatus;
  label: string;
  icon: string;
  color: string;
}> = [
  {status: 'todo', label: 'To Do', icon: '📋', color: '#0EA5E9'},
  {status: 'in_progress', label: 'In Progress', icon: '⚡', color: '#F59E0B'},
  {status: 'completed', label: 'Completed', icon: '✅', color: '#10B981'},
];

export const StatusSelector = React.memo<StatusSelectorProps>(({
  currentStatus,
  onStatusChange,
}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.statusRow}>
      {STATUS_OPTIONS.map(opt => {
        const isActive = currentStatus === opt.status;
        return (
          <TouchableOpacity
            key={opt.status}
            onPress={() => onStatusChange(opt.status)}
            activeOpacity={0.75}
            style={[
              styles.statusItem,
              {
                backgroundColor: isActive
                  ? opt.color + '20'
                  : theme.colors.surfaceVariant,
                borderColor: opt.color,
                borderWidth: isActive ? 1.5 : 0,
              },
            ]}>
            <RNText style={styles.statusIcon}>{opt.icon}</RNText>
            <RNText
              style={[
                styles.statusLabel,
                {color: isActive ? opt.color : theme.colors.textSecondary},
              ]}>
              {opt.label}
            </RNText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

interface CommentBubbleProps {
  comment: Comment;
  currentUserId?: string;
}

export const CommentBubble = React.memo<CommentBubbleProps>(({
  comment,
  currentUserId,
}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const isMine = comment.user_id === currentUserId;

  return (
    <View style={styles.commentRow}>
      <Avatar
        name={comment.user?.name || '?'}
        uri={comment.user?.avatar}
        size={34}
      />
      <View style={styles.commentContent}>
        <View
          style={[
            styles.bubble,
            {
              backgroundColor: isMine
                ? theme.colors.primaryLight
                : theme.colors.surfaceVariant,
            },
          ]}>
          <View style={styles.bubbleHeader}>
            <RNText style={styles.commentAuthor}>
              {comment.user?.name || 'Unknown'}
            </RNText>
            <RNText style={styles.commentTime}>
              {formatRelativeTime(comment.created_at)}
            </RNText>
          </View>
          <RNText style={styles.commentText}>{comment.message}</RNText>
        </View>
      </View>
    </View>
  );
});

interface CommentInputProps {
  onSend: (text: string) => Promise<void>;
  sending: boolean;
  user: any;
}

export const CommentInput = React.memo<CommentInputProps>(({
  onSend,
  sending,
  user,
}) => {
  const [text, setText] = React.useState('');
  const {theme} = useTheme();
  const styles = createStyles(theme);

  const handleSend = async () => {
    if (!text.trim() || sending) return;
    const currentText = text.trim();
    setText('');
    await onSend(currentText);
  };

  return (
    <View style={styles.inputContainer}>
      <Avatar name={user?.name || 'U'} uri={user?.avatar} size={34} />
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Write a comment..."
          placeholderTextColor={theme.colors.textTertiary}
          value={text}
          onChangeText={setText}
          style={styles.textInput}
          multiline
          maxLength={500}
        />
      </View>
      <TouchableOpacity
        onPress={handleSend}
        disabled={!text.trim() || sending}
        style={[
          styles.sendBtn,
          {
            backgroundColor: text.trim()
              ? theme.colors.primary
              : theme.colors.surfaceVariant,
          },
        ]}>
        {sending ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <RNText style={styles.sendIcon}>↑</RNText>
        )}
      </TouchableOpacity>
    </View>
  );
});

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    headerActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 8,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    editBtn: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 10,
      backgroundColor: theme.colors.primaryLight,
    },
    editBtnText: {
      color: theme.colors.primary,
      fontSize: 13,
      fontWeight: '600',
    },
    deleteBtn: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 10,
      backgroundColor: theme.colors.errorLight,
    },
    deleteBtnText: {
      color: theme.colors.error,
      fontSize: 13,
      fontWeight: '600',
    },
    statusRow: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 8,
    },
    statusItem: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 12,
      alignItems: 'center',
    },
    statusIcon: {
      fontSize: 18,
      marginBottom: 3,
    },
    statusLabel: {
      fontSize: 11,
      fontWeight: '600',
      textAlign: 'center',
    },
    commentRow: {
      flexDirection: 'row',
      gap: 10,
    },
    commentContent: {
      flex: 1,
    },
    bubble: {
      borderRadius: 12,
      padding: 12,
    },
    bubbleHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    commentAuthor: {
      color: theme.colors.text,
      fontWeight: '700',
      fontSize: 13,
    },
    commentTime: {
      color: theme.colors.textTertiary,
      fontSize: 11,
    },
    commentText: {
      color: theme.colors.text,
      fontSize: 14,
      lineHeight: 20,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 10,
      padding: 12,
      borderTopWidth: 1,
      backgroundColor: theme.colors.surface,
      borderTopColor: theme.colors.border,
    },
    inputWrapper: {
      flex: 1,
      borderRadius: 20,
      borderWidth: 1,
      overflow: 'hidden',
      backgroundColor: theme.colors.surfaceVariant,
      borderColor: theme.colors.border,
    },
    textInput: {
      flex: 1,
      color: theme.colors.text,
      fontSize: 14,
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    sendBtn: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendIcon: {
      fontSize: 18,
      color: '#fff',
    },
  });
