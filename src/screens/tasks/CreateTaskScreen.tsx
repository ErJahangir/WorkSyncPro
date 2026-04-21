/**
 * WorkSync Pro - Create Task Screen
 * Full task creation form with validation
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import {useForm, Controller, SubmitHandler} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@theme/ThemeProvider';
import {useAppDispatch, useAppSelector} from '@hooks/useAppSelector';
import {createTask} from '@store/slices/tasksSlice';
import {Button} from '@components/common/Button';
import {Input} from '@components/common/Input';
import {TaskFormData, TaskPriority, TaskStatus} from '@/types/index';

const schema = yup.object().shape({
  title: yup
    .string()
    .required('Task title is required')
    .min(3, 'Too short')
    .max(100, 'Too long'),
  description: yup.string().ensure().max(500, 'Max 500 characters'),
  priority: yup.string().oneOf(['low', 'medium', 'high']).required(),
  status: yup.string().oneOf(['todo', 'in_progress', 'completed']).required(),
  tags: yup.string().optional(),
  deadline: yup.date().optional(),
});

// ─── Picker Section ───────────────────────────────────────

const SectionLabel: React.FC<{title: string; required?: boolean}> = ({
  title,
  required,
}) => {
  const {theme} = useTheme();
  return (
    <Text
      style={{
        color: theme.colors.textSecondary,
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 8,
      }}>
      {title}
      {required && <Text style={{color: theme.colors.error}}> *</Text>}
    </Text>
  );
};

const OptionPicker: React.FC<{
  options: Array<{value: string; label: string; icon: string; color?: string}>;
  selected: string;
  onSelect: (val: string) => void;
}> = ({options, selected, onSelect}) => {
  const {theme} = useTheme();
  return (
    <View style={{flexDirection: 'row', gap: 8, flexWrap: 'wrap'}}>
      {options.map(opt => {
        const isSelected = selected === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            onPress={() => onSelect(opt.value)}
            activeOpacity={0.75}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 999,
              borderWidth: 1.5,
              backgroundColor: isSelected
                ? opt.color
                  ? opt.color + '20'
                  : theme.colors.primaryLight
                : 'transparent',
              borderColor: isSelected
                ? opt.color || theme.colors.primary
                : theme.colors.border,
            }}>
            <Text style={{fontSize: 14}}>{opt.icon}</Text>
            <Text
              style={{
                color: isSelected
                  ? opt.color || theme.colors.primary
                  : theme.colors.textSecondary,
                fontSize: 13,
                fontWeight: isSelected ? '700' : '500',
              }}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────

export const CreateTaskScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(s => s.auth);
  const {isLoading} = useAppSelector(s => s.tasks);

  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: {errors},
  } = useForm<TaskFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      status: 'todo',
      tags: '',
      deadline: undefined,
    },
  });
  // console.log(isLoading);

  const priority = watch('priority');
  const status = watch('status');

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags(prev => [...prev, t]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) =>
    setTags(prev => prev.filter(t => t !== tag));

  const onSubmit: SubmitHandler<TaskFormData> = async data => {
    if (!user) return;
    const result = await dispatch(
      createTask({
        input: {
          title: data.title,
          description: data.description,
          priority: data.priority as TaskPriority,
          status: data.status as TaskStatus,
          tags,
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
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View
        style={[styles.container, {backgroundColor: theme.colors.background}]}>
        {/* Header */}
        <View style={[styles.header, {borderBottomColor: theme.colors.border}]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.closeBtn}>
            <Text
              style={{
                color: theme.colors.textSecondary,
                fontSize: 15,
                fontWeight: '500',
              }}>
              Cancel
            </Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {color: theme.colors.text}]}>
            New Task
          </Text>
          <Button
            title="Create"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            size="sm"
            style={{paddingHorizontal: 16}}
          />
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.content,
            {paddingHorizontal: theme.spacing.base},
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Title */}
          <Controller
            control={control}
            name="title"
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                label="Task Title"
                required
                placeholder="What needs to be done?"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.title?.message}
              />
            )}
          />

          {/* Description */}
          <Controller
            control={control}
            name="description"
            render={({field: {onChange, onBlur, value}}) => (
              <View style={{marginBottom: 20}}>
                <SectionLabel title="Description" />
                <View
                  style={{
                    backgroundColor: theme.colors.surface,
                    borderRadius: theme.borderRadius.lg,
                    borderWidth: 1.5,
                    borderColor: theme.colors.border,
                    padding: theme.spacing.md,
                    minHeight: 100,
                  }}>
                  <TextInput
                    multiline
                    numberOfLines={4}
                    placeholder="Add a detailed description..."
                    placeholderTextColor={theme.colors.textTertiary}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    style={{
                      color: theme.colors.text,
                      fontSize: 14,
                      lineHeight: 22,
                      textAlignVertical: 'top',
                    }}
                  />
                </View>
                {errors.description && (
                  <Text
                    style={{
                      color: theme.colors.error,
                      fontSize: 11,
                      marginTop: 4,
                    }}>
                    ⚠️ {errors.description.message}
                  </Text>
                )}
              </View>
            )}
          />

          {/* Priority */}
          <View style={{marginBottom: 20}}>
            <SectionLabel title="Priority" required />
            <OptionPicker
              selected={priority}
              onSelect={val => setValue('priority', val as TaskPriority)}
              options={[
                {
                  value: 'low',
                  label: 'Low',
                  icon: '🟢',
                  color: theme.colors.priorityLow,
                },
                {
                  value: 'medium',
                  label: 'Medium',
                  icon: '🟡',
                  color: theme.colors.priorityMedium,
                },
                {
                  value: 'high',
                  label: 'High',
                  icon: '🔴',
                  color: theme.colors.priorityHigh,
                },
              ]}
            />
          </View>

          {/* Status */}
          <View style={{marginBottom: 20}}>
            <SectionLabel title="Status" required />
            <OptionPicker
              selected={status}
              onSelect={val => setValue('status', val as TaskStatus)}
              options={[
                {
                  value: 'todo',
                  label: 'To Do',
                  icon: '📋',
                  color: theme.colors.statusTodo,
                },
                {
                  value: 'in_progress',
                  label: 'In Progress',
                  icon: '⚡',
                  color: theme.colors.statusInProgress,
                },
                {
                  value: 'completed',
                  label: 'Completed',
                  icon: '✅',
                  color: theme.colors.statusCompleted,
                },
              ]}
            />
          </View>

          {/* Tags */}
          <View style={{marginBottom: 20}}>
            <SectionLabel title="Tags" />
            <View style={{flexDirection: 'row', gap: 8, marginBottom: 8}}>
              <View
                style={[
                  styles.tagInput,
                  {
                    flex: 1,
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}>
                <TextInput
                  value={tagInput}
                  onChangeText={setTagInput}
                  placeholder="Add tag..."
                  placeholderTextColor={theme.colors.textTertiary}
                  onSubmitEditing={addTag}
                  returnKeyType="done"
                  style={{
                    color: theme.colors.text,
                    fontSize: 14,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={addTag}
                style={[
                  styles.tagAddBtn,
                  {backgroundColor: theme.colors.primaryLight},
                ]}>
                <Text
                  style={{
                    color: theme.colors.primary,
                    fontWeight: '700',
                    fontSize: 18,
                  }}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
            {tags.length > 0 && (
              <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 6}}>
                {tags.map(tag => (
                  <TouchableOpacity
                    key={tag}
                    onPress={() => removeTag(tag)}
                    style={[
                      styles.tagChip,
                      {backgroundColor: theme.colors.primaryLight},
                    ]}>
                    <Text
                      style={{
                        color: theme.colors.primary,
                        fontSize: 12,
                        fontWeight: '600',
                      }}>
                      #{tag}
                    </Text>
                    <Text
                      style={{
                        color: theme.colors.primary,
                        fontSize: 12,
                        marginLeft: 4,
                      }}>
                      ✕
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <Text
              style={{
                color: theme.colors.textTertiary,
                fontSize: 11,
                marginTop: 4,
              }}>
              {tags.length}/5 tags · Tap a tag to remove
            </Text>
          </View>

          <View style={{height: 40}} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  closeBtn: {padding: 4},
  headerTitle: {fontSize: 17, fontWeight: '700'},
  content: {paddingTop: 20, paddingBottom: 40},
  tagInput: {borderRadius: 12, borderWidth: 1.5, overflow: 'hidden'},
  tagAddBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
});
