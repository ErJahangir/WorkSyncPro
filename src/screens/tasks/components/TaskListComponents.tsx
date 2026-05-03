import React from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import type {TaskStatus} from '@/types';
import {RNText} from '@/components/common';

interface TaskListHeaderProps {
  total: number;
  onAddPress: () => void;
}

export const TaskListHeader: React.FC<TaskListHeaderProps> = ({
  total,
  onAddPress,
}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.header}>
      <View>
        <RNText style={styles.title}>My Tasks</RNText>
        <RNText style={styles.subtitle}>{total} tasks total</RNText>
      </View>
      <TouchableOpacity onPress={onAddPress} style={styles.addButton}>
        <RNText style={styles.addButtonText}>+</RNText>
      </TouchableOpacity>
    </View>
  );
};

interface TaskSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress: () => void;
  activeFilters: number;
}

export const TaskSearchBar: React.FC<TaskSearchBarProps> = ({
  value,
  onChangeText,
  onFilterPress,
  activeFilters,
}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.searchRow}>
      <View style={styles.searchContainer}>
        <RNText style={styles.searchIcon}>🔍</RNText>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks..."
          placeholderTextColor={theme.colors.textTertiary}
          value={value}
          onChangeText={onChangeText}
        />
        {value.length > 0 && (
          <TouchableOpacity
            onPress={() => onChangeText('')}
            style={styles.clearIcon}>
            <RNText style={styles.clearIconText}>✕</RNText>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        onPress={onFilterPress}
        style={[
          styles.filterButton,
          activeFilters > 0 && styles.filterButtonActive,
        ]}>
        <RNText style={styles.filterIcon}>⚙️</RNText>
        {activeFilters > 0 && (
          <View style={styles.filterBadge}>
            <RNText style={styles.filterBadgeText}>{activeFilters}</RNText>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

interface TaskStatusTabsProps {
  activeTab: TaskStatus | 'all';
  onTabPress: (status: TaskStatus | 'all') => void;
}

export const TaskStatusTabs: React.FC<TaskStatusTabsProps> = ({
  activeTab,
  onTabPress,
}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);

  const statusTabs: Array<{key: TaskStatus | 'all'; label: string}> = [
    {key: 'all', label: 'All'},
    {key: 'todo', label: 'To Do'},
    {key: 'in_progress', label: 'In Progress'},
    {key: 'completed', label: 'Done'},
  ];

  return (
    <View style={styles.tabsContainer}>
      {statusTabs.map(tab => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onTabPress(tab.key)}
            style={[styles.tab, isActive && styles.tabActive]}>
            <RNText style={[styles.tabText, isActive && styles.tabTextActive]}>
              {tab.label}
            </RNText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 16,
      paddingBottom: 12,
      paddingHorizontal: theme.spacing.base,
    },
    title: {
      fontSize: 26,
      fontWeight: '800',
      letterSpacing: -0.5,
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: 13,
      marginTop: 2,
      color: theme.colors.textSecondary,
    },
    addButton: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
      shadowColor: theme.colors.primary,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    addButtonText: {
      color: '#fff',
      fontSize: 22,
      lineHeight: 26,
    },
    searchRow: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 12,
      paddingHorizontal: theme.spacing.base,
    },
    searchContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 14,
      borderWidth: 1.5,
      height: 48,
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    },
    searchIcon: {
      fontSize: 16,
      marginHorizontal: 10,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      paddingVertical: 0,
      color: theme.colors.text,
    },
    clearIcon: {
      paddingHorizontal: 10,
    },
    clearIconText: {
      color: theme.colors.textTertiary,
      fontSize: 16,
    },
    filterButton: {
      width: 48,
      height: 48,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      position: 'relative',
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    },
    filterButtonActive: {
      backgroundColor: theme.colors.primaryLight,
      borderColor: theme.colors.primary,
    },
    filterIcon: {fontSize: 16},
    filterBadge: {
      position: 'absolute',
      top: -4,
      right: -4,
      width: 16,
      height: 16,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
    },
    filterBadgeText: {
      color: '#fff',
      fontSize: 9,
      fontWeight: '700',
    },
    tabsContainer: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      marginBottom: 12,
      gap: 4,
    },
    tab: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 999,
      backgroundColor: 'transparent',
    },
    tabActive: {
      backgroundColor: theme.colors.primary,
    },
    tabText: {
      fontSize: 13,
      fontWeight: '500',
      color: theme.colors.textSecondary,
    },
    tabTextActive: {
      color: '#fff',
      fontWeight: '700',
    },
  });
