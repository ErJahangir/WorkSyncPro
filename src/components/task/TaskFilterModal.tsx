/**
 * WorkSync Pro - Task Filter Modal
 * Bottom sheet modal for filtering and sorting tasks
 */

import React, {useState} from 'react';
import {
  View, Text, Modal, StyleSheet, TouchableOpacity,
  ScrollView, TouchableWithoutFeedback,
} from 'react-native';
import {useTheme} from '@theme/ThemeProvider';
import {TaskFilter, TaskPriority, TaskStatus} from '@/types/index';
import {Button} from '@components/common/Button';

interface TaskFilterModalProps {
  visible: boolean;
  onClose: () => void;
  currentFilter: TaskFilter;
  onApply: (filter: TaskFilter) => void;
  onClear: () => void;
}

const ToggleChip: React.FC<{
  label: string; icon?: string;
  selected: boolean; onPress: () => void;
  color?: string;
}> = ({label, icon, selected, onPress, color}) => {
  const {theme} = useTheme();
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={{
      flexDirection: 'row', alignItems: 'center', gap: 5,
      paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1.5,
      backgroundColor: selected ? (color ? color + '18' : theme.colors.primaryLight) : 'transparent',
      borderColor: selected ? (color || theme.colors.primary) : theme.colors.border,
    }}>
      {icon && <Text style={{fontSize: 13}}>{icon}</Text>}
      <Text style={{fontSize: 13, fontWeight: selected ? '700' : '500',
        color: selected ? (color || theme.colors.primary) : theme.colors.textSecondary}}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export const TaskFilterModal: React.FC<TaskFilterModalProps> = ({
  visible, onClose, currentFilter, onApply, onClear,
}) => {
  const {theme} = useTheme();
  const [localFilter, setLocalFilter] = useState<TaskFilter>(currentFilter);

  const toggle = <T extends string>(field: keyof TaskFilter, val: T) => {
    setLocalFilter(f => ({...f, [field]: f[field] === val ? undefined : val}));
  };

  const SortBtn: React.FC<{by: TaskFilter['sortBy']; label: string}> = ({by, label}) => (
    <TouchableOpacity onPress={() => setLocalFilter(f => ({...f, sortBy: by}))} activeOpacity={0.75}
      style={{
        paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5,
        backgroundColor: localFilter.sortBy === by ? theme.colors.primaryLight : 'transparent',
        borderColor: localFilter.sortBy === by ? theme.colors.primary : theme.colors.border,
      }}>
      <Text style={{fontSize: 13, fontWeight: '500',
        color: localFilter.sortBy === by ? theme.colors.primary : theme.colors.textSecondary}}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <View style={[styles.sheet, {backgroundColor: theme.colors.surface}]}>
        <View style={[styles.handle, {backgroundColor: theme.colors.border}]} />

        <View style={styles.sheetHeader}>
          <Text style={[styles.sheetTitle, {color: theme.colors.text}]}>Filter & Sort</Text>
          <TouchableOpacity onPress={onClear}>
            <Text style={{color: theme.colors.error, fontSize: 14, fontWeight: '600'}}>Clear All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={[styles.groupLabel, {color: theme.colors.textSecondary}]}>Status</Text>
          <View style={styles.chipRow}>
            {(['todo', 'in_progress', 'completed'] as TaskStatus[]).map(s => (
              <ToggleChip key={s} label={s === 'in_progress' ? 'In Progress' : s === 'todo' ? 'To Do' : 'Done'}
                selected={localFilter.status === s} onPress={() => toggle('status', s)}
                icon={s === 'todo' ? '📋' : s === 'in_progress' ? '⚡' : '✅'}
                color={s === 'todo' ? '#0EA5E9' : s === 'in_progress' ? '#F59E0B' : '#10B981'} />
            ))}
          </View>

          <Text style={[styles.groupLabel, {color: theme.colors.textSecondary}]}>Priority</Text>
          <View style={styles.chipRow}>
            {(['low', 'medium', 'high'] as TaskPriority[]).map(p => (
              <ToggleChip key={p} label={p.charAt(0).toUpperCase() + p.slice(1)}
                selected={localFilter.priority === p} onPress={() => toggle('priority', p)}
                icon={p === 'low' ? '🟢' : p === 'medium' ? '🟡' : '🔴'}
                color={p === 'low' ? '#10B981' : p === 'medium' ? '#F59E0B' : '#F43F5E'} />
            ))}
          </View>

          <Text style={[styles.groupLabel, {color: theme.colors.textSecondary}]}>Sort By</Text>
          <View style={styles.chipRow}>
            <SortBtn by="created_at" label="Newest" />
            <SortBtn by="deadline" label="Deadline" />
            <SortBtn by="priority" label="Priority" />
            <SortBtn by="title" label="A–Z" />
          </View>

          <Text style={[styles.groupLabel, {color: theme.colors.textSecondary}]}>Order</Text>
          <View style={styles.chipRow}>
            {(['asc', 'desc'] as const).map(order => (
              <ToggleChip key={order} label={order === 'asc' ? '↑ Ascending' : '↓ Descending'}
                selected={localFilter.sortOrder === order} onPress={() => setLocalFilter(f => ({...f, sortOrder: order}))} />
            ))}
          </View>

          <View style={{height: 20}} />
        </ScrollView>

        <View style={{paddingBottom: 16, gap: 8}}>
          <Button title="Apply Filters" onPress={() => onApply(localFilter)} fullWidth size="lg" />
          <Button title="Cancel" onPress={onClose} fullWidth size="md" variant="ghost" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'},
  sheet: {
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8,
    maxHeight: '80%',
  },
  handle: {
    width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 16,
  },
  sheetHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20},
  sheetTitle: {fontSize: 18, fontWeight: '700'},
  groupLabel: {fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginTop: 4},
  chipRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16},
});
