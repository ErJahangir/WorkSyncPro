/**
 * WorkSync Pro - Create Task Screen
 * Full task creation form with validation
 */

import React from 'react';
import {View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {useAppDispatch, useAppSelector} from '@/hooks';
import {createTask} from '@/store/slices';
import {Button} from '@/components';
import {TaskFormData, TaskPriority, TaskStatus} from '@/types';
import {TaskForm} from './components';
import {RNText} from '@/components/common';

export const CreateTaskScreen: React.FC = () => {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(s => s.auth);
  const {isLoading} = useAppSelector(s => s.tasks);

  const onSubmit = async (data: TaskFormData & {tagsList: string[]}) => {
    if (!user) return;
    const result = await dispatch(
      createTask({
        input: {
          title: data.title,
          description: data.description,
          priority: data.priority as TaskPriority,
          status: data.status as TaskStatus,
          tags: data.tagsList,
        },
        userId: user.id,
      }),
    );
    if (createTask.fulfilled.match(result)) {
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.closeBtn}>
            <RNText style={styles.cancelText}>Cancel</RNText>
          </TouchableOpacity>
          <RNText style={styles.headerTitle}>New Task</RNText>
          <View style={styles.headerAction} />
        </View>

        <ScrollView
          style={styles.flexOne}
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <TaskForm
            onSubmit={onSubmit}
            isLoading={isLoading}
            submitButtonLabel="Create Task"
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: theme.colors.background},
    content: {flex: 1},
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    closeBtn: {padding: 4, minWidth: 60},
    cancelText: {
      color: theme.colors.textSecondary,
      fontSize: 15,
      fontWeight: '500',
    },
    headerTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: theme.colors.text,
    },
    headerAction: {minWidth: 60},
    flexOne: {flex: 1},
    formContent: {
      paddingTop: 20,
      paddingHorizontal: theme.spacing.base,
      paddingBottom: 40,
    },
  });
