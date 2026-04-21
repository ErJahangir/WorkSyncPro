/**
 * WorkSync Pro - Task List Screen
 * Search, filter, sort, infinite pagination, pull-to-refresh
 */

import React, {useEffect, useCallback, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@theme/ThemeProvider';
import {useAppDispatch, useAppSelector} from '@hooks/useAppSelector';
import {
  fetchTasks,
  setFilter,
  clearFilter,
  selectAllTasks,
  selectTasksLoading,
  selectTasksRefreshing,
  selectTaskFilter,
  selectTasksPagination,
} from '@store/slices/tasksSlice';
import {useDebounce} from '@hooks/index';
import {TaskCardSkeleton, EmptyState, Badge} from '@components/common/index';
import {TaskCard} from '@components/task/TaskCard';
import {TaskFilterModal} from '@components/task/TaskFilterModal';
import {Task, TaskStatus, TaskPriority} from '@/types/index';

export const TaskListScreen: React.FC = () => {
  const {theme} = useTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();

  const tasks = useAppSelector(selectAllTasks);
  const isLoading = useAppSelector(selectTasksLoading);
  const isRefreshing = useAppSelector(selectTasksRefreshing);
  const filter = useAppSelector(selectTaskFilter);
  const pagination = useAppSelector(selectTasksPagination);
  console.log('pagination', pagination);

  const [searchText, setSearchText] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const debouncedSearch = useDebounce(searchText, 400);

  // Active filter count badge
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
    // Only fetch more if we aren't already loading, have more data, and have at least some tasks
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
    <View style={{paddingHorizontal: theme.spacing.base}}>
      {[1, 2, 3, 4, 5].map(i => (
        <TaskCardSkeleton key={i} />
      ))}
    </View>
  );

  const renderFooter = () => {
    if (!pagination.hasMore || tasks.length === 0) return null;
    return (
      <View style={{paddingVertical: 20, alignItems: 'center'}}>
        <Text style={{color: theme.colors.textTertiary, fontSize: 12}}>
          Loading more...
        </Text>
      </View>
    );
  };

  const statusTabs: Array<{key: TaskStatus | 'all'; label: string}> = [
    {key: 'all', label: 'All'},
    {key: 'todo', label: 'To Do'},
    {key: 'in_progress', label: 'In Progress'},
    {key: 'completed', label: 'Done'},
  ];

  const activeTab = filter.status || 'all';

  return (
    <SafeAreaView
      style={[styles.safeArea, {backgroundColor: theme.colors.background}]}
      edges={['top']}>
      {/* ─── Header ─── */}
      <View style={[styles.header, {paddingHorizontal: theme.spacing.base}]}>
        <View>
          <Text style={[styles.title, {color: theme.colors.text}]}>
            My Tasks
          </Text>
          <Text style={[styles.subtitle, {color: theme.colors.textSecondary}]}>
            {pagination.total} tasks total
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateTask')}
          style={[styles.addButton, {backgroundColor: theme.colors.primary}]}>
          <Text style={{color: '#fff', fontSize: 22, lineHeight: 26}}>+</Text>
        </TouchableOpacity>
      </View>

      {/* ─── Search Bar ─── */}
      <View style={[styles.searchRow, {paddingHorizontal: theme.spacing.base}]}>
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}>
          <Text style={{fontSize: 16, marginHorizontal: 10}}>🔍</Text>
          <TextInput
            style={[styles.searchInput, {color: theme.colors.text}]}
            placeholder="Search tasks..."
            placeholderTextColor={theme.colors.textTertiary}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchText('')}
              style={{paddingHorizontal: 10}}>
              <Text style={{color: theme.colors.textTertiary, fontSize: 16}}>
                ✕
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          onPress={() => setShowFilterModal(true)}
          style={[
            styles.filterButton,
            {
              backgroundColor:
                activeFilters > 0
                  ? theme.colors.primaryLight
                  : theme.colors.surface,
              borderColor:
                activeFilters > 0 ? theme.colors.primary : theme.colors.border,
            },
          ]}>
          <Text style={{fontSize: 16}}>⚙️</Text>
          {activeFilters > 0 && (
            <View
              style={[
                styles.filterBadge,
                {backgroundColor: theme.colors.primary},
              ]}>
              <Text style={{color: '#fff', fontSize: 9, fontWeight: '700'}}>
                {activeFilters}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* ─── Status Tabs ─── */}
      <View style={styles.tabsContainer}>
        {statusTabs.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() =>
                dispatch(
                  setFilter({
                    status:
                      tab.key === 'all' ? undefined : (tab.key as TaskStatus),
                  }),
                )
              }
              style={[
                styles.tab,
                {
                  backgroundColor: isActive
                    ? theme.colors.primary
                    : 'transparent',
                  borderRadius: 999,
                },
              ]}>
              <Text
                style={{
                  color: isActive ? '#fff' : theme.colors.textSecondary,
                  fontSize: 13,
                  fontWeight: isActive ? '700' : '500',
                }}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ─── Task List ─── */}
      {isLoading && tasks.length === 0 ? (
        renderSkeletons()
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={item => item.id}
          renderItem={renderTask}
          contentContainerStyle={[
            {paddingHorizontal: theme.spacing.base, paddingBottom: 100},
            tasks.length === 0 && {flex: 1},
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

const styles = StyleSheet.create({
  safeArea: {flex: 1},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {fontSize: 26, fontWeight: '800', letterSpacing: -0.5},
  subtitle: {fontSize: 13, marginTop: 2},
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  searchRow: {flexDirection: 'row', gap: 10, marginBottom: 12},
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1.5,
    height: 48,
  },
  searchInput: {flex: 1, fontSize: 14, paddingVertical: 0},
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 4,
  },
  tab: {paddingHorizontal: 14, paddingVertical: 7},
});
