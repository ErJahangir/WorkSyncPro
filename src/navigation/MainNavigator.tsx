/**
 * WorkSync Pro - Main Navigator
 * Bottom tab + nested stack navigators
 */

import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  type MainTabParamList,
  type TaskStackParamList,
  type TeamStackParamList,
} from '@/types';
import {useTheme} from '@/theme';
import {
  AnalyticsScreen,
  CreateTaskScreen,
  DashboardScreen,
  EditTaskScreen,
  InviteMemberScreen,
  MemberProfileScreen,
  ProfileScreen,
  TaskCommentsScreen,
  TaskDetailScreen,
  TaskListScreen,
  TeamDetailScreen,
  TeamScreen,
} from '@/screens';
import {useAppSelector} from '@/hooks';
import {RNText} from '@/components/common';

const Tab = createBottomTabNavigator<MainTabParamList>();
const TaskStack = createNativeStackNavigator<TaskStackParamList>();
const TeamStack = createNativeStackNavigator<TeamStackParamList>();

// Tab icon component
const TabIcon: React.FC<{
  icon: string;
  label: string;
  focused: boolean;
  color: string;
  badge?: number;
}> = ({icon, label, focused, color, badge}) => (
  <View style={styles.tabItem}>
    <View style={styles.iconWrapper}>
      <RNText style={[styles.icon, {opacity: focused ? 1 : 0.6}]}>{icon}</RNText>
      {badge && badge > 0 ? (
        <View style={styles.badge}>
          <RNText style={styles.badgeText}>{badge > 99 ? '99+' : badge}</RNText>
        </View>
      ) : null}
    </View>
    <RNText style={[styles.label, {color, fontWeight: focused ? '600' : '400'}]}>
      {label}
    </RNText>
  </View>
);

// Task Stack Navigator
const TaskStackNavigator: React.FC = () => {
  const {theme} = useTheme();
  return (
    <TaskStack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: theme.colors.surface},
        headerTintColor: theme.colors.text,
        headerTitleStyle: {fontWeight: '600', fontSize: 17},
        headerShadowVisible: false,
      }}>
      <TaskStack.Screen
        name="TaskList"
        component={TaskListScreen}
        options={{headerShown: false}}
      />
      <TaskStack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={{title: 'Task Details'}}
      />
      <TaskStack.Screen
        name="CreateTask"
        component={CreateTaskScreen}
        options={{
          title: 'New Task',
          presentation: 'modal',
        }}
      />
      <TaskStack.Screen
        name="EditTask"
        component={EditTaskScreen}
        options={{title: 'Edit Task', presentation: 'modal'}}
      />
      <TaskStack.Screen
        name="TaskComments"
        component={TaskCommentsScreen}
        options={{title: 'Comments'}}
      />
    </TaskStack.Navigator>
  );
};

// Team Stack Navigator
const TeamStackNavigator: React.FC = () => {
  const {theme} = useTheme();
  return (
    <TeamStack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: theme.colors.surface},
        headerTintColor: theme.colors.text,
        headerTitleStyle: {fontWeight: '600', fontSize: 17},
        headerShadowVisible: false,
      }}>
      <TeamStack.Screen
        name="TeamList"
        component={TeamScreen}
        options={{headerShown: false}}
      />
      <TeamStack.Screen
        name="TeamDetail"
        component={TeamDetailScreen}
        options={{title: 'Team'}}
      />
      <TeamStack.Screen
        name="InviteMember"
        component={InviteMemberScreen}
        options={{title: 'Invite Member', presentation: 'modal'}}
      />
      <TeamStack.Screen
        name="MemberProfile"
        component={MemberProfileScreen}
        options={{title: 'Member Profile'}}
      />
    </TeamStack.Navigator>
  );
};

// Main Tab Navigator
export const MainNavigator: React.FC = () => {
  const {theme} = useTheme();
  const {unreadCount} = useAppSelector(state => state.notifications);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBarBackground,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
        },
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({focused, color}) => (
            <TabIcon icon="🏠" label="Home" focused={focused} color={color} />
          ),
          tabBarActiveTintColor: theme.colors.tabBarActive,
          tabBarInactiveTintColor: theme.colors.tabBarInactive,
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={TaskStackNavigator}
        options={{
          tabBarIcon: ({focused, color}) => (
            <TabIcon icon="✅" label="Tasks" focused={focused} color={color} />
          ),
          tabBarActiveTintColor: theme.colors.tabBarActive,
          tabBarInactiveTintColor: theme.colors.tabBarInactive,
        }}
      />
      <Tab.Screen
        name="Team"
        component={TeamStackNavigator}
        options={{
          tabBarIcon: ({focused, color}) => (
            <TabIcon
              icon="👥"
              label="Team"
              focused={focused}
              color={color}
              badge={unreadCount}
            />
          ),
          tabBarActiveTintColor: theme.colors.tabBarActive,
          tabBarInactiveTintColor: theme.colors.tabBarInactive,
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarIcon: ({focused, color}) => (
            <TabIcon icon="📊" label="Stats" focused={focused} color={color} />
          ),
          tabBarActiveTintColor: theme.colors.tabBarActive,
          tabBarInactiveTintColor: theme.colors.tabBarInactive,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({focused, color}) => (
            <TabIcon
              icon="👤"
              label="Profile"
              focused={focused}
              color={color}
            />
          ),
          tabBarActiveTintColor: theme.colors.tabBarActive,
          tabBarInactiveTintColor: theme.colors.tabBarInactive,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  iconWrapper: {
    position: 'relative',
  },
  icon: {
    fontSize: 22,
  },
  label: {
    fontSize: 10,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#F43F5E',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
});
