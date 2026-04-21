/**
 * WorkSync Pro - Dashboard Screen
 * Main home screen with stats, chart, and activity feed
 */

import React, {useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@theme/ThemeProvider';
import {useAppDispatch} from '@hooks/useAppSelector';
import {useAppSelector} from '@hooks/useAppSelector';
import {
  fetchTasks,
  selectTaskStats,
  selectAllTasks,
} from '@store/slices/tasksSlice';
import {fetchTeamMembers} from '@store/slices/teamSlice';
import {Card, Avatar, Badge, TaskCardSkeleton} from '@components/common/index';
import {useRealtimeTasks} from '@hooks/index';

const {width} = Dimensions.get('window');

// ─── Stat Card ────────────────────────────────────────────

const StatCard: React.FC<{
  label: string;
  value: number | string;
  icon: string;
  color: string;
  bgColor: string;
  trend?: string;
}> = ({label, value, icon, color, bgColor, trend}) => {
  const {theme} = useTheme();
  return (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.borderLight,
        },
      ]}>
      <View style={[styles.statIconBg, {backgroundColor: bgColor}]}>
        <Text style={{fontSize: 20}}>{icon}</Text>
      </View>
      <Text style={[styles.statValue, {color: theme.colors.text}]}>
        {value}
      </Text>
      <Text style={[styles.statLabel, {color: theme.colors.textSecondary}]}>
        {label}
      </Text>
      {trend && (
        <Text style={{color, fontSize: 11, fontWeight: '600', marginTop: 2}}>
          {trend}
        </Text>
      )}
    </View>
  );
};

// ─── Mini Progress Bar ─────────────────────────────────────

const ProgressBar: React.FC<{progress: number; color: string}> = ({
  progress,
  color,
}) => {
  const {theme} = useTheme();
  return (
    <View
      style={[
        styles.progressTrack,
        {backgroundColor: theme.colors.surfaceVariant},
      ]}>
      <View
        style={[
          styles.progressFill,
          {width: `${Math.min(progress, 100)}%`, backgroundColor: color},
        ]}
      />
    </View>
  );
};

// ─── Task Row ─────────────────────────────────────────────

const RecentTaskRow: React.FC<{task: any; onPress: () => void}> = ({
  task,
  onPress,
}) => {
  const {theme} = useTheme();
  const priorityColors: Record<string, string> = {
    low: theme.colors.priorityLow,
    medium: theme.colors.priorityMedium,
    high: theme.colors.priorityHigh,
  };
  const statusBadgeVariant: Record<string, any> = {
    todo: 'info',
    in_progress: 'warning',
    completed: 'success',
  };
  const statusLabel: Record<string, string> = {
    todo: 'To Do',
    in_progress: 'In Progress',
    completed: 'Done',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.taskRow, {borderBottomColor: theme.colors.borderLight}]}>
      <View
        style={[
          styles.priorityDot,
          {backgroundColor: priorityColors[task.priority]},
        ]}
      />
      <View style={styles.taskRowContent}>
        <Text
          style={[styles.taskRowTitle, {color: theme.colors.text}]}
          numberOfLines={1}>
          {task.title}
        </Text>
        {task.deadline && (
          <Text
            style={[
              styles.taskRowDeadline,
              {color: theme.colors.textTertiary},
            ]}>
            📅 {new Date(task.deadline).toLocaleDateString()}
          </Text>
        )}
      </View>
      <Badge
        label={statusLabel[task.status]}
        variant={statusBadgeVariant[task.status]}
        size="sm"
      />
    </TouchableOpacity>
  );
};

// ─── Main Dashboard Screen ────────────────────────────────

export const DashboardScreen: React.FC = () => {
  const {theme} = useTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const {user} = useAppSelector(s => s.auth);
  const {isLoading, isRefreshing} = useAppSelector(s => s.tasks);
  const {members} = useAppSelector(s => s.team);
  const stats = useAppSelector(selectTaskStats);
  const tasks = useAppSelector(selectAllTasks);

  // Realtime task subscription
  useRealtimeTasks(user?.id);

  useEffect(() => {
    // Only perform the initial fetch if we have a user and don't have tasks yet
    if (user && tasks.length === 0 && !isLoading) {
      dispatch(fetchTasks({refresh: false}));
    }
    if (user) {
      dispatch(fetchTeamMembers(user.id));
    }
  }, [dispatch, user?.id]); // Use user.id for reference stability

  const onRefresh = useCallback(() => {
    dispatch(fetchTasks({refresh: true}));
  }, [dispatch]);

  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const recentTasks = tasks.slice(0, 5);

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <SafeAreaView
      style={[styles.safeArea, {backgroundColor: theme.colors.background}]}
      edges={['top']}>
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
        <View style={[styles.header, {paddingHorizontal: theme.spacing.base}]}>
          <View style={styles.headerLeft}>
            <Text
              style={[styles.greeting, {color: theme.colors.textSecondary}]}>
              Good {getGreeting()} 👋
            </Text>
            <Text style={[styles.userName, {color: theme.colors.text}]}>
              {firstName}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={[
                styles.notifButton,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => {}}>
              <Text style={{fontSize: 18}}>🔔</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Avatar name={user?.name || 'U'} uri={user?.avatar} size={40} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Stats Grid ─── */}
        <View
          style={[styles.statsGrid, {paddingHorizontal: theme.spacing.base}]}>
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
        <View
          style={{
            paddingHorizontal: theme.spacing.base,
            marginTop: theme.spacing.base,
          }}>
          <Card>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, {color: theme.colors.text}]}>
                Team Productivity
              </Text>
              <Text style={[styles.cardValue, {color: theme.colors.primary}]}>
                {completionRate}%
              </Text>
            </View>
            <ProgressBar
              progress={completionRate}
              color={theme.colors.primary}
            />
            <View style={styles.progressLegend}>
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    {backgroundColor: theme.colors.primary},
                  ]}
                />
                <Text style={{color: theme.colors.textSecondary, fontSize: 12}}>
                  Completed ({stats.completed})
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    {backgroundColor: theme.colors.surfaceVariant},
                  ]}
                />
                <Text style={{color: theme.colors.textSecondary, fontSize: 12}}>
                  Remaining ({stats.todo + stats.inProgress})
                </Text>
              </View>
            </View>

            {/* Priority breakdown */}
            <View
              style={[
                styles.priorityBreakdown,
                {borderTopColor: theme.colors.divider},
              ]}>
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
                  <Text
                    style={{
                      color: theme.colors.textSecondary,
                      fontSize: 12,
                      flex: 1,
                    }}>
                    {item.label}
                  </Text>
                  <Text
                    style={{
                      color: theme.colors.text,
                      fontSize: 13,
                      fontWeight: '600',
                    }}>
                    {item.count}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        {/* ─── Recent Tasks ─── */}
        <View
          style={{
            paddingHorizontal: theme.spacing.base,
            marginTop: theme.spacing.base,
          }}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
              Recent Tasks
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
              <Text
                style={{
                  color: theme.colors.primary,
                  fontSize: 13,
                  fontWeight: '600',
                }}>
                See All →
              </Text>
            </TouchableOpacity>
          </View>

          <Card padding={0} style={{overflow: 'hidden'}}>
            {isLoading ? (
              <View style={{padding: theme.spacing.base}}>
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
              <View style={{padding: 32, alignItems: 'center'}}>
                <Text style={{fontSize: 36, marginBottom: 8}}>📭</Text>
                <Text
                  style={{
                    color: theme.colors.textSecondary,
                    textAlign: 'center',
                  }}>
                  No tasks yet. Create your first one!
                </Text>
              </View>
            )}
          </Card>
        </View>

        {/* ─── Quick Actions ─── */}
        <View
          style={{
            paddingHorizontal: theme.spacing.base,
            marginTop: theme.spacing.base,
            marginBottom: 32,
          }}>
          <Text
            style={[
              styles.sectionTitle,
              {color: theme.colors.text, marginBottom: 12},
            ]}>
            Quick Actions
          </Text>
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
                style={[
                  styles.quickActionBtn,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}>
                <Text style={{fontSize: 22}}>{action.icon}</Text>
                <Text
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: 11,
                    fontWeight: '500',
                    marginTop: 4,
                  }}>
                  {action.label}
                </Text>
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

const styles = StyleSheet.create({
  safeArea: {flex: 1},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerLeft: {gap: 2},
  headerRight: {flexDirection: 'row', alignItems: 'center', gap: 10},
  greeting: {fontSize: 13, fontWeight: '400'},
  userName: {fontSize: 24, fontWeight: '800', letterSpacing: -0.5},
  notifButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: (width - 48 - 12) / 2,
    padding: 14,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {fontSize: 26, fontWeight: '800', letterSpacing: -1, marginTop: 4},
  statLabel: {fontSize: 12, fontWeight: '500'},
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {fontSize: 15, fontWeight: '700'},
  cardValue: {fontSize: 22, fontWeight: '800'},
  progressTrack: {height: 8, borderRadius: 4, overflow: 'hidden'},
  progressFill: {height: '100%', borderRadius: 4},
  progressLegend: {flexDirection: 'row', marginTop: 10, gap: 16},
  legendItem: {flexDirection: 'row', alignItems: 'center', gap: 6},
  legendDot: {width: 8, height: 8, borderRadius: 4},
  priorityBreakdown: {marginTop: 14, paddingTop: 14, borderTopWidth: 1, gap: 8},
  priorityItem: {flexDirection: 'row', alignItems: 'center', gap: 8},
  priorityDotSm: {width: 8, height: 8, borderRadius: 4},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {fontSize: 17, fontWeight: '700'},
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  priorityDot: {width: 8, height: 8, borderRadius: 4, flexShrink: 0},
  taskRowContent: {flex: 1},
  taskRowTitle: {fontSize: 14, fontWeight: '500'},
  taskRowDeadline: {fontSize: 11, marginTop: 2},
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
  },
});
