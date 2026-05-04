/**
 * WorkSync Pro - Edit Task Screen
 * Pre-fills form with existing task data
 */

import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation, useRoute} from '@react-navigation/native';

import {useTheme, type Theme} from '@/theme';
import {useAppDispatch, useAppSelector} from '@/hooks';
import {updateTask} from '@/store/slices';
import {TaskForm} from './components';
import {TaskFormData, type TaskPriority, type TaskStatus, Task} from '@/types';
import {RNText} from '@/components/common';

export const EditTaskScreen: React.FC = () => {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useAppDispatch();
  const {t} = useTranslation();
  const {isLoading} = useAppSelector(s => s.tasks);
  const task: Task = route.params.task;

  const onSubmit = async (data: TaskFormData & {tagsList: string[]}) => {
    const result = await dispatch(
      updateTask({
        id: task.id,
        title: data.title,
        description: data.description,
        priority: data.priority as TaskPriority,
        status: data.status as TaskStatus,
        tags: data.tagsList,
      }),
    );
    if (updateTask.fulfilled.match(result)) {
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
            <RNText style={styles.cancelText}>
              {t('tasks.editTask.cancel')}
            </RNText>
          </TouchableOpacity>
          <RNText style={styles.headerTitle}>
            {t('tasks.editTask.title')}
          </RNText>
          <View style={styles.headerAction} />
        </View>

        <ScrollView
          style={styles.flexOne}
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <TaskForm
            initialValues={{
              ...task,
              deadline: task.deadline ? new Date(task.deadline) : undefined,
            }}
            onSubmit={onSubmit}
            isLoading={isLoading}
            submitButtonLabel={t('tasks.editTask.saveChanges')}
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
