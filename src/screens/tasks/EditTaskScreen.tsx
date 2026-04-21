/**
 * WorkSync Pro - Edit Task Screen
 * Pre-fills form with existing task data
 */

import React, {useState} from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import {useForm, Controller, SubmitHandler} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTheme} from '@theme/ThemeProvider';
import {useAppDispatch, useAppSelector} from '@hooks/useAppSelector';
import {updateTask} from '@store/slices/tasksSlice';
import {Button} from '@components/common/Button';
import {Input} from '@components/common/Input';
import {TaskFormData, TaskPriority, TaskStatus, Task} from '@/types/index';

const schema = yup.object().shape({
  title: yup.string().required('Title is required').min(3).max(100),
  description: yup.string().ensure().max(500),
  priority: yup.string().oneOf(['low', 'medium', 'high']).required(),
  status: yup.string().oneOf(['todo', 'in_progress', 'completed']).required(),
  tags: yup.string().optional(),
  deadline: yup.date().optional(),
});

const OptionPicker: React.FC<{
  options: Array<{value: string; label: string; icon: string; color?: string}>;
  selected: string;
  onSelect: (v: string) => void;
}> = ({options, selected, onSelect}) => {
  const {theme} = useTheme();
  return (
    <View style={{flexDirection: 'row', gap: 8, flexWrap: 'wrap'}}>
      {options.map(opt => {
        const isSel = selected === opt.value;
        return (
          <TouchableOpacity key={opt.value} onPress={() => onSelect(opt.value)} activeOpacity={0.75}
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 5,
              paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1.5,
              backgroundColor: isSel ? (opt.color ? opt.color + '20' : theme.colors.primaryLight) : 'transparent',
              borderColor: isSel ? (opt.color || theme.colors.primary) : theme.colors.border,
            }}>
            <Text style={{fontSize: 13}}>{opt.icon}</Text>
            <Text style={{fontSize: 13, fontWeight: isSel ? '700' : '500',
              color: isSel ? (opt.color || theme.colors.primary) : theme.colors.textSecondary}}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export const EditTaskScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useAppDispatch();
  const {isLoading} = useAppSelector(s => s.tasks);
  const task: Task = route.params.task;

  const [tags, setTags] = useState<string[]>(task.tags || []);
  const [tagInput, setTagInput] = useState('');

  const {control, handleSubmit, setValue, watch, formState: {errors}} = useForm<TaskFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      status: task.status,
      tags: task.tags?.join(', ') || '',
    },
  });

  const priority = watch('priority');
  const status = watch('status');

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags(p => [...p, t]);
      setTagInput('');
    }
  };

  const onSubmit: SubmitHandler<TaskFormData> = async data => {
    const result = await dispatch(updateTask({
      id: task.id,
      title: data.title,
      description: data.description,
      priority: data.priority as TaskPriority,
      status: data.status as TaskStatus,
      tags,
    }));
    if (updateTask.fulfilled.match(result)) navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[{flex: 1}, {backgroundColor: theme.colors.background}]}>
        <View style={[styles.header, {borderBottomColor: theme.colors.border}]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{color: theme.colors.textSecondary, fontSize: 15, fontWeight: '500'}}>Cancel</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {color: theme.colors.text}]}>Edit Task</Text>
          <Button title="Save" onPress={handleSubmit(onSubmit)} loading={isLoading} size="sm" style={{paddingHorizontal: 16}} />
        </View>

        <ScrollView contentContainerStyle={{paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40}} keyboardShouldPersistTaps="handled">
          <Controller control={control} name="title" render={({field: {onChange, onBlur, value}}) => (
            <Input label="Task Title" required value={value} onChangeText={onChange} onBlur={onBlur} error={errors.title?.message} />
          )} />

          <Controller control={control} name="description" render={({field: {onChange, onBlur, value}}) => (
            <View style={{marginBottom: 20}}>
              <Text style={{color: theme.colors.textSecondary, fontSize: 12, fontWeight: '500', marginBottom: 8}}>Description</Text>
              <View style={{backgroundColor: theme.colors.surface, borderRadius: 12, borderWidth: 1.5, borderColor: theme.colors.border, padding: 12, minHeight: 90}}>
                <TextInput multiline numberOfLines={4} value={value} onChangeText={onChange} onBlur={onBlur}
                  style={{color: theme.colors.text, fontSize: 14, lineHeight: 22, textAlignVertical: 'top'}}
                  placeholder="Task description..." placeholderTextColor={theme.colors.textTertiary} />
              </View>
            </View>
          )} />

          <View style={{marginBottom: 20}}>
            <Text style={{color: theme.colors.textSecondary, fontSize: 12, fontWeight: '500', marginBottom: 8}}>Priority</Text>
            <OptionPicker selected={priority} onSelect={v => setValue('priority', v as TaskPriority)} options={[
              {value: 'low', label: 'Low', icon: '🟢', color: theme.colors.priorityLow},
              {value: 'medium', label: 'Medium', icon: '🟡', color: theme.colors.priorityMedium},
              {value: 'high', label: 'High', icon: '🔴', color: theme.colors.priorityHigh},
            ]} />
          </View>

          <View style={{marginBottom: 20}}>
            <Text style={{color: theme.colors.textSecondary, fontSize: 12, fontWeight: '500', marginBottom: 8}}>Status</Text>
            <OptionPicker selected={status} onSelect={v => setValue('status', v as TaskStatus)} options={[
              {value: 'todo', label: 'To Do', icon: '📋', color: theme.colors.statusTodo},
              {value: 'in_progress', label: 'In Progress', icon: '⚡', color: theme.colors.statusInProgress},
              {value: 'completed', label: 'Completed', icon: '✅', color: theme.colors.statusCompleted},
            ]} />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export const TaskCommentsScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<any>();
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background}}>
      <Text style={{color: theme.colors.text, fontSize: 18}}>Comments</Text>
      <Text style={{color: theme.colors.textSecondary, marginTop: 8}}>See Task Detail for full thread</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1,
  },
  headerTitle: {fontSize: 17, fontWeight: '700'},
});
