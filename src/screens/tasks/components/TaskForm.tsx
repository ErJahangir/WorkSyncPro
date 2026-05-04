import React, {useMemo, useState} from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {useSelector} from 'react-redux';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {Button, Input} from '@/components';
import type {TaskFormData, TaskPriority, TaskStatus} from '@/types';
import {RNText} from '@/components/common';
import {RootState} from '@/store';
import {useTranslation} from 'react-i18next';

interface TaskFormProps {
  initialValues?: Partial<TaskFormData>;
  onSubmit: (data: TaskFormData & {tagsList: string[]}) => Promise<void>;
  isLoading?: boolean;
  submitButtonLabel: string;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  initialValues,
  onSubmit,
  isLoading,
  submitButtonLabel,
}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const {t} = useTranslation();

  const schema = useMemo(
    () =>
      yup.object().shape({
        title: yup
          .string()
          .required(t('tasks.taskForm.validation.titleRequired'))
          .min(3, t('tasks.taskForm.validation.titleShort'))
          .max(100, t('tasks.taskForm.validation.titleLong')),
        description: yup
          .string()
          .ensure()
          .max(500, t('tasks.taskForm.validation.descLong')),
        priority: yup.string().oneOf(['low', 'medium', 'high']).required(),
        status: yup
          .string()
          .oneOf(['todo', 'in_progress', 'completed'])
          .required(),
        tags: yup.mixed<string | string[]>().optional(),
        deadline: yup.date().optional(),
        team_id: yup.string().optional().nullable(),
        assigned_to: yup.string().optional().nullable(),
      }),
    [t],
  );

  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(
    initialValues?.tags
      ? typeof initialValues.tags === 'string'
        ? []
        : (initialValues.tags as any)
      : [],
  );

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: {errors},
  } = useForm<TaskFormData>({
    resolver: yupResolver(schema as any),
    defaultValues: {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      priority: initialValues?.priority || 'medium',
      status: initialValues?.status || 'todo',
      tags: '',
      deadline: initialValues?.deadline,
      team_id: initialValues?.team_id || null,
      assigned_to: initialValues?.assigned_to || null,
    },
  });

  const teams = useSelector((state: RootState) => state.team.teams);
  const members = useSelector((state: RootState) => state.team.members);
  const selectedTeamId = watch('team_id');
  const assignedToId = watch('assigned_to');

  const priority = watch('priority');
  const status = watch('status');

  const addTag = () => {
    const tInput = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (tInput && !tags.includes(tInput) && tags.length < 5) {
      setTags(prev => [...prev, tInput]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) =>
    setTags(prev => prev.filter(t => t !== tag));

  const onFormSubmit = (data: TaskFormData) => {
    onSubmit({...data, tagsList: tags});
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Controller
        control={control}
        name="title"
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            label={t('tasks.taskForm.titleLabel')}
            required
            placeholder={t('tasks.taskForm.titlePlaceholder')}
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
          <View style={styles.section}>
            <SectionLabel title={t('tasks.taskForm.descriptionLabel')} />
            <View style={styles.descriptionContainer}>
              <TextInput
                multiline
                numberOfLines={4}
                placeholder={t('tasks.taskForm.descriptionPlaceholder')}
                placeholderTextColor={theme.colors.textTertiary}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                style={styles.descriptionInput}
              />
            </View>
            {errors.description && (
              <RNText style={styles.errorText}>
                ⚠️ {errors.description.message}
              </RNText>
            )}
          </View>
        )}
      />

      {/* Team Selection */}
      {teams.length > 0 && (
        <View style={styles.section}>
          <SectionLabel title={t('tasks.taskForm.teamLabel')} />
          <OptionPicker
            selected={selectedTeamId || 'personal'}
            onSelect={val => {
              const teamId = val === 'personal' ? null : val;
              setValue('team_id', teamId);
              setValue('assigned_to', null); // Reset assignee when team changes
            }}
            options={[
              {
                value: 'personal',
                label: t('tasks.taskForm.personalTask'),
                icon: '👤',
                color: theme.colors.textSecondary,
              },
              ...teams.map(team => ({
                value: team.id,
                label: team.name,
                icon: '👥',
                color: theme.colors.primary,
              })),
            ]}
          />
        </View>
      )}

      {/* Member Assignment (Only if a team is selected) */}
      {selectedTeamId && members.length > 0 && (
        <View style={styles.section}>
          <SectionLabel title={t('tasks.taskForm.assigneeLabel')} />
          <OptionPicker
            selected={assignedToId || 'unassigned'}
            onSelect={val =>
              setValue('assigned_to', val === 'unassigned' ? null : val)
            }
            options={[
              {
                value: 'unassigned',
                label: t('tasks.taskForm.unassigned'),
                icon: '👤',
                color: theme.colors.textTertiary,
              },
              ...members
                .filter(m => m.team_id === selectedTeamId)
                .map(m => ({
                  value: m.user_id,
                  label: m.user?.name || t('common.unknownUser'),
                  icon: '👤',
                  color: theme.colors.primary,
                })),
            ]}
          />
        </View>
      )}

      {/* Priority */}
      <View style={styles.section}>
        <SectionLabel title={t('tasks.taskForm.priorityLabel')} required />
        <OptionPicker
          selected={priority}
          onSelect={val => setValue('priority', val as TaskPriority)}
          options={[
            {
              value: 'low',
              label: t('tasks.taskForm.low'),
              icon: '🟢',
              color: theme.colors.priorityLow,
            },
            {
              value: 'medium',
              label: t('tasks.taskForm.medium'),
              icon: '🟡',
              color: theme.colors.priorityMedium,
            },
            {
              value: 'high',
              label: t('tasks.taskForm.high'),
              icon: '🔴',
              color: theme.colors.priorityHigh,
            },
          ]}
        />
      </View>

      {/* Status */}
      <View style={styles.section}>
        <SectionLabel title={t('tasks.taskForm.statusLabel')} required />
        <OptionPicker
          selected={status}
          onSelect={val => setValue('status', val as TaskStatus)}
          options={[
            {
              value: 'todo',
              label: t('status.todo'),
              icon: '📋',
              color: theme.colors.statusTodo,
            },
            {
              value: 'in_progress',
              label: t('status.in_progress'),
              icon: '⚡',
              color: theme.colors.statusInProgress,
            },
            {
              value: 'completed',
              label: t('status.completed'),
              icon: '✅',
              color: theme.colors.statusCompleted,
            },
          ]}
        />
      </View>

      {/* Tags */}
      <View style={styles.section}>
        <SectionLabel title={t('tasks.taskForm.tagsLabel')} />
        <View style={styles.tagInputRow}>
          <View style={styles.tagInputContainer}>
            <TextInput
              value={tagInput}
              onChangeText={setTagInput}
              placeholder={t('tasks.taskForm.tagsPlaceholder')}
              placeholderTextColor={theme.colors.textTertiary}
              onSubmitEditing={addTag}
              returnKeyType="done"
              style={styles.tagInput}
            />
          </View>
          <TouchableOpacity onPress={addTag} style={styles.tagAddBtn}>
            <RNText style={styles.tagAddIcon}>+</RNText>
          </TouchableOpacity>
        </View>
        {tags.length > 0 && (
          <View style={styles.tagsList}>
            {tags.map(tag => (
              <TouchableOpacity
                key={tag}
                onPress={() => removeTag(tag)}
                style={styles.tagChip}>
                <RNText style={styles.tagChipText}>#{tag}</RNText>
                <RNText style={styles.tagChipClose}>✕</RNText>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <RNText style={styles.tagHint}>
          {t('tasks.taskForm.tagsHint', {count: tags.length})}
        </RNText>
      </View>

      <Button
        title={submitButtonLabel}
        onPress={handleSubmit(onFormSubmit)}
        loading={isLoading}
        fullWidth
        size="lg"
        style={styles.submitBtn}
      />
    </View>
  );
};

// Internal Components

const SectionLabel: React.FC<{title: string; required?: boolean}> = ({
  title,
  required,
}) => {
  const {theme} = useTheme();
  return (
    <RNText
      style={{
        color: theme.colors.textSecondary,
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 8,
      }}>
      {title}
      {required && <RNText style={{color: theme.colors.error}}> *</RNText>}
    </RNText>
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
            <RNText style={{fontSize: 14}}>{opt.icon}</RNText>
            <RNText
              style={{
                color: isSelected
                  ? opt.color || theme.colors.primary
                  : theme.colors.textSecondary,
                fontSize: 13,
                fontWeight: isSelected ? '700' : '500',
              }}>
              {opt.label}
            </RNText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {flex: 1},
    section: {marginBottom: 20},
    descriptionContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1.5,
      borderColor: theme.colors.border,
      padding: theme.spacing.md,
      minHeight: 100,
    },
    descriptionInput: {
      color: theme.colors.text,
      fontSize: 14,
      lineHeight: 22,
      textAlignVertical: 'top',
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 11,
      marginTop: 4,
    },
    tagInputRow: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 8,
    },
    tagInputContainer: {
      flex: 1,
      borderRadius: 12,
      borderWidth: 1.5,
      overflow: 'hidden',
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    },
    tagInput: {
      color: theme.colors.text,
      fontSize: 14,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    tagAddBtn: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primaryLight,
    },
    tagAddIcon: {
      color: theme.colors.primary,
      fontWeight: '700',
      fontSize: 18,
    },
    tagsList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    tagChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 999,
      backgroundColor: theme.colors.primaryLight,
    },
    tagChipText: {
      color: theme.colors.primary,
      fontSize: 12,
      fontWeight: '600',
    },
    tagChipClose: {
      color: theme.colors.primary,
      fontSize: 12,
      marginLeft: 4,
    },
    tagHint: {
      color: theme.colors.textTertiary,
      fontSize: 11,
      marginTop: 4,
    },
    submitBtn: {
      marginTop: 20,
    },
  });
