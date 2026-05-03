/**
 * WorkSync Pro - Task List Screen
 * Search, filter, sort, infinite pagination, pull-to-refresh
 */

import React, {useEffect, useCallback, useState} from 'react';
import {View, FlatList, StyleSheet, RefreshControl} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {useAppDispatch, useAppSelector, useDebounce} from '@/hooks';
import {
  fetchTasks,
  setFilter,
  clearFilter,
  selectAllTasks,
  selectTasksLoading,
  selectTasksRefreshing,
  selectTaskFilter,
  selectTasksPagination,
} from '@/store/slices';
import {
  TaskCardSkeleton,
  EmptyState,
  TaskFilterModal,
  TaskCard,
} from '@/components';
import {} from '@/components';
import {Task, TaskStatus} from '@/types';
import {TaskListHeader, TaskSearchBar, TaskStatusTabs} from './components';
import {RNText} from '@/components/common';

export const TaskListScreen: React.FC = () => {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();

  const tasks = useAppSelector(selectAllTasks);
  const isLoading = useAppSelector(selectTasksLoading);
  const isRefreshing = useAppSelector(selectTasksRefreshing);
  const filter = useAppSelector(selectTaskFilter);
  const pagination = useAppSelector(selectTasksPagination);

  const [searchText, setSearchText] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const debouncedSearch = useDebounce(searchText, 400);

  const activeFilters = [
    filter.status,
    filter.priority,
    filter.assignedTo,
  ].filter(Boolean).length;

  useEffect(() => {
    dispatch(setFilter({search: debouncedSearch || undefined}));
  }, [debouncedSearch, dispatch]);

  useEffect(() => {
    dispatch(fetchTasks({refresh: true}));
  }, [filter.status, filter.priority, filter.search, filter.sortBy, dispatch]);

  const onRefresh = useCallback(() => {
    dispatch(fetchTasks({refresh: true}));
  }, [dispatch]);

  const onEndReached = useCallback(() => {
    if (!isLoading && pagination.hasMore && tasks.length > 0) {
      dispatch(fetchTasks({refresh: false}));
    }
  }, [isLoading, pagination.hasMore, tasks.length, dispatch]);

  const renderTask = useCallback(
    ({item}: {item: Task}) => (
      <TaskCard
        task={item}
        onPress={() => navigation.navigate('TaskDetail', {taskId: item.id})}
      />
    ),
    [navigation],
  );

  const renderSkeletons = () => (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3, 4, 5].map(i => (
        <TaskCardSkeleton key={i} />
      ))}
    </View>
  );

  const renderFooter = () => {
    if (!pagination.hasMore || tasks.length === 0) return null;
    return (
      <View style={styles.footer}>
        <RNText style={styles.footerText}>Loading more...</RNText>
      </View>
    );
  };

  const activeTab = filter.status || 'all';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <TaskListHeader
        total={pagination.total}
        onAddPress={() => navigation.navigate('CreateTask')}
      />

      {/* Search Bar */}
      <TaskSearchBar
        value={searchText}
        onChangeText={setSearchText}
        onFilterPress={() => setShowFilterModal(true)}
        activeFilters={activeFilters}
      />

      {/* Status Tabs */}
      <TaskStatusTabs
        activeTab={activeTab}
        onTabPress={status =>
          dispatch(
            setFilter({
              status: status === 'all' ? undefined : (status as TaskStatus),
            }),
          )
        }
      />

      {/* Task List */}
      {isLoading && tasks.length === 0 ? (
        renderSkeletons()
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={item => item.id}
          renderItem={renderTask}
          contentContainerStyle={[
            styles.listContent,
            tasks.length === 0 && styles.flexOne,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
            />
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <EmptyState
              icon="📋"
              title="No tasks found"
              subtitle={
                searchText
                  ? `No results for "${searchText}"`
                  : 'Create your first task to get started'
              }
              action={{
                label: '+ Create Task',
                onPress: () => navigation.navigate('CreateTask'),
              }}
            />
          }
        />
      )}

      {/* Filter Modal */}
      <TaskFilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        currentFilter={filter}
        onApply={f => {
          dispatch(setFilter(f));
          setShowFilterModal(false);
        }}
        onClear={() => {
          dispatch(clearFilter());
          setShowFilterModal(false);
        }}
      />
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    skeletonContainer: {
      paddingHorizontal: theme.spacing.base,
    },
    footer: {
      paddingVertical: 20,
      alignItems: 'center',
    },
    footerText: {
      color: theme.colors.textTertiary,
      fontSize: 12,
    },
    listContent: {
      paddingHorizontal: theme.spacing.base,
      paddingBottom: 100,
    },
    flexOne: {flex: 1},
  });
