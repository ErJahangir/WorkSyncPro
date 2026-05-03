/**
 * WorkSync Pro - Dashboard Screen
 * Main home screen with stats, chart, and activity feed
 */

import React, {useEffect, useCallback} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {
  useAppDispatch,
  useAppSelector,
  useRealtimeNotifications,
  useRealtimeTasks,
} from '@/hooks';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {
  fetchTasks,
  fetchTeams,
  selectAllTasks,
  selectTaskStats,
} from '@/store/slices';
import {Card, Avatar, TaskCardSkeleton} from '@/components';
import {StatCard, ProgressBar, RecentTaskRow} from './components';
import {RNText} from '@/components/common';

// ─── Main Dashboard Screen ────────────────────────────────

export const DashboardScreen: React.FC = () => {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const {user} = useAppSelector(s => s.auth);
  const {isLoading, isRefreshing} = useAppSelector(s => s.tasks);
  const {members} = useAppSelector(s => s.team);
  const stats = useAppSelector(selectTaskStats);
  const tasks = useAppSelector(selectAllTasks);

  // Realtime subscriptions
  useRealtimeTasks(user?.id);
  useRealtimeNotifications(user?.id);

  useEffect(() => {
    // Only perform the initial fetch if we have a user and don't have tasks yet
    if (user && tasks.length === 0 && !isLoading) {
      dispatch(fetchTasks({refresh: false}));
    }
    if (user) {
      dispatch(fetchTeams(user.id));
    }
  }, [dispatch, user?.id]);

  const onRefresh = useCallback(() => {
    dispatch(fetchTasks({refresh: true}));
  }, [dispatch]);

  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const recentTasks = tasks.slice(0, 5);

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }>
        {/* ─── Header ─── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <RNText style={styles.greeting}>Good {getGreeting()} 👋</RNText>
            <RNText style={styles.userName}>{firstName}</RNText>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notifButton} onPress={() => {}}>
              <RNText style={styles.notifIcon}>🔔</RNText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Avatar name={user?.name || 'U'} uri={user?.avatar} size={40} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Stats Grid ─── */}
        <View style={styles.statsGrid}>
          <StatCard
            label="Total Tasks"
            value={stats.total}
            icon="📋"
            color={theme.colors.primary}
            bgColor={theme.colors.primaryLight}
            trend={`${completionRate}% done`}
          />
          <StatCard
            label="In Progress"
            value={stats.inProgress}
            icon="⏳"
            color={theme.colors.warning}
            bgColor={theme.colors.warningLight}
          />
          <StatCard
            label="Completed"
            value={stats.completed}
            icon="✅"
            color={theme.colors.success}
            bgColor={theme.colors.successLight}
          />
          <StatCard
            label="Team Members"
            value={members.length || 0}
            icon="👥"
            color={theme.colors.info}
            bgColor={theme.colors.infoLight}
          />
        </View>

        {/* ─── Productivity Card ─── */}
        <View style={styles.section}>
          <Card>
            <View style={styles.cardHeader}>
              <RNText style={styles.cardTitle}>Team Productivity</RNText>
              <RNText style={styles.cardValue}>{completionRate}%</RNText>
            </View>
            <ProgressBar
              progress={completionRate}
              color={theme.colors.primary}
            />
            <View style={styles.progressLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.bgPrimary]} />
                <RNText style={styles.legendText}>
                  Completed ({stats.completed})
                </RNText>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.bgSurfaceVariant]} />
                <RNText style={styles.legendText}>
                  Remaining ({stats.todo + stats.inProgress})
                </RNText>
              </View>
            </View>

            {/* Priority breakdown */}
            <View style={styles.priorityBreakdown}>
              {[
                {
                  label: 'High Priority',
                  count: tasks.filter(t => t.priority === 'high').length,
                  color: theme.colors.priorityHigh,
                },
                {
                  label: 'Medium',
                  count: tasks.filter(t => t.priority === 'medium').length,
                  color: theme.colors.priorityMedium,
                },
                {
                  label: 'Low',
                  count: tasks.filter(t => t.priority === 'low').length,
                  color: theme.colors.priorityLow,
                },
              ].map(item => (
                <View key={item.label} style={styles.priorityItem}>
                  <View
                    style={[
                      styles.priorityDotSm,
                      {backgroundColor: item.color},
                    ]}
                  />
                  <RNText style={styles.priorityLabel}>{item.label}</RNText>
                  <RNText style={styles.priorityCount}>{item.count}</RNText>
                </View>
              ))}
            </View>
          </Card>
        </View>

        {/* ─── Recent Tasks ─── */}
        <View style={styles.section}>
          <View style={styles.recentTasksHeader}>
            <RNText style={styles.sectionTitle}>Recent Tasks</RNText>
            <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
              <RNText style={styles.seeAllText}>See All →</RNText>
            </TouchableOpacity>
          </View>

          <Card padding={0} style={styles.recentTasksCard}>
            {isLoading ? (
              <View style={styles.skeletonContainer}>
                {[1, 2, 3].map(i => (
                  <TaskCardSkeleton key={i} />
                ))}
              </View>
            ) : recentTasks.length > 0 ? (
              recentTasks.map(task => (
                <RecentTaskRow
                  key={task.id}
                  task={task}
                  onPress={() =>
                    navigation.navigate('Tasks', {
                      screen: 'TaskDetail',
                      params: {taskId: task.id},
                    })
                  }
                />
              ))
            ) : (
              <View style={styles.emptyTasks}>
                <RNText style={styles.emptyIcon}>📭</RNText>
                <RNText style={styles.emptyText}>
                  No tasks yet. Create your first one!
                </RNText>
              </View>
            )}
          </Card>
        </View>

        {/* ─── Quick Actions ─── */}
        <View style={[styles.section, styles.marginBottomLarge]}>
          <RNText style={styles.quickActionsTitle}>Quick Actions</RNText>
          <View style={styles.quickActions}>
            {[
              {
                icon: '➕',
                label: 'New Task',
                onPress: () =>
                  navigation.navigate('Tasks', {screen: 'CreateTask'}),
              },
              {
                icon: '👥',
                label: 'Team',
                onPress: () => navigation.navigate('Team'),
              },
              {
                icon: '📊',
                label: 'Analytics',
                onPress: () => navigation.navigate('Analytics'),
              },
              {
                icon: '👤',
                label: 'Profile',
                onPress: () => navigation.navigate('Profile'),
              },
            ].map(action => (
              <TouchableOpacity
                key={action.label}
                onPress={action.onPress}
                activeOpacity={0.75}
                style={styles.quickActionBtn}>
                <RNText style={styles.quickActionIcon}>{action.icon}</RNText>
                <RNText style={styles.quickActionLabel}>{action.label}</RNText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 16,
      paddingBottom: 20,
      paddingHorizontal: theme.spacing.base,
    },
    headerLeft: {gap: 2},
    headerRight: {flexDirection: 'row', alignItems: 'center', gap: 10},
    greeting: {
      fontSize: 13,
      fontWeight: '400',
      color: theme.colors.textSecondary,
    },
    userName: {
      fontSize: 24,
      fontWeight: '800',
      letterSpacing: -0.5,
      color: theme.colors.text,
    },
    notifButton: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    },
    notifIcon: {fontSize: 18},
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      paddingHorizontal: theme.spacing.base,
    },
    section: {
      paddingHorizontal: theme.spacing.base,
      marginTop: theme.spacing.base,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    cardTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.colors.text,
    },
    cardValue: {
      fontSize: 22,
      fontWeight: '800',
      color: theme.colors.primary,
    },
    progressLegend: {flexDirection: 'row', marginTop: 10, gap: 16},
    legendItem: {flexDirection: 'row', alignItems: 'center', gap: 6},
    legendDot: {width: 8, height: 8, borderRadius: 4},
    bgPrimary: {backgroundColor: theme.colors.primary},
    bgSurfaceVariant: {backgroundColor: theme.colors.surfaceVariant},
    legendText: {color: theme.colors.textSecondary, fontSize: 12},
    priorityBreakdown: {
      marginTop: 14,
      paddingTop: 14,
      borderTopWidth: 1,
      gap: 8,
      borderTopColor: theme.colors.divider,
    },
    priorityItem: {flexDirection: 'row', alignItems: 'center', gap: 8},
    priorityDotSm: {width: 8, height: 8, borderRadius: 4},
    priorityLabel: {
      color: theme.colors.textSecondary,
      fontSize: 12,
      flex: 1,
    },
    priorityCount: {
      color: theme.colors.text,
      fontSize: 13,
      fontWeight: '600',
    },
    recentTasksHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: theme.colors.text,
    },
    seeAllText: {
      color: theme.colors.primary,
      fontSize: 13,
      fontWeight: '600',
    },
    recentTasksCard: {overflow: 'hidden'},
    skeletonContainer: {padding: theme.spacing.base},
    emptyTasks: {padding: 32, alignItems: 'center'},
    emptyIcon: {fontSize: 36, marginBottom: 8},
    emptyText: {
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    quickActionsTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 12,
    },
    quickActions: {flexDirection: 'row', gap: 10},
    quickActionBtn: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 14,
      alignItems: 'center',
      borderWidth: 1,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    },
    quickActionIcon: {fontSize: 22},
    quickActionLabel: {
      color: theme.colors.textSecondary,
      fontSize: 11,
      fontWeight: '500',
      marginTop: 4,
    },
    marginBottomLarge: {marginBottom: 32},
  });
