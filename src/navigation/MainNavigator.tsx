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
  type ProfileStackParamList,
} from '@/types';
import {useTheme} from '@/theme';
import {
  AnalyticsScreen,
  CreateTaskScreen,
  CreateTeamScreen,
  DashboardScreen,
  EditTaskScreen,
  InviteMemberScreen,
  InvitesScreen,
  MemberProfileScreen,
  ProfileScreen,
  TaskCommentsScreen,
  TaskDetailScreen,
  TaskListScreen,
  TeamDetailScreen,
  TeamScreen,
  NotificationsScreen,
  ChangePasswordScreen,
  EmailPreferencesScreen,
  LanguageScreen,
  AboutScreen,
  PrivacyPolicyScreen,
  TermsOfServiceScreen,
} from '@/screens';
import {useTranslation} from 'react-i18next';
import {useAppSelector, useRealtimeNotifications} from '@/hooks';
import {RNText} from '@/components/common';

const Tab = createBottomTabNavigator<MainTabParamList>();
const TaskStack = createNativeStackNavigator<TaskStackParamList>();
const TeamStack = createNativeStackNavigator<TeamStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

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
      <RNText style={[styles.icon, {opacity: focused ? 1 : 0.6}]}>
        {icon}
      </RNText>
      {badge && badge > 0 ? (
        <View style={styles.badge}>
          <RNText style={styles.badgeText}>{badge > 99 ? '99+' : badge}</RNText>
        </View>
      ) : null}
    </View>
    <RNText
      style={[styles.label, {color, fontWeight: focused ? '600' : '400'}]}>
      {label}
    </RNText>
  </View>
);

// Task Stack Navigator
const TaskStackNavigator: React.FC = () => {
  const {theme} = useTheme();
  const {t} = useTranslation();
  return (
    <TaskStack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: theme.colors.surface},
        headerTintColor: theme.colors.text,
        headerTitleStyle: {fontWeight: '600', fontSize: 17},
        headerShadowVisible: false,
        animation: Platform.OS === 'android' ? 'slide_from_bottom' : 'default',
      }}>
      <TaskStack.Screen
        name="TaskList"
        component={TaskListScreen}
        options={{headerShown: false}}
      />
      <TaskStack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={{title: t('navigation.taskDetails')}}
      />
      <TaskStack.Screen
        name="CreateTask"
        component={CreateTaskScreen}
        options={{
          title: t('navigation.newTask'),
          presentation: 'modal',
        }}
      />
      <TaskStack.Screen
        name="EditTask"
        component={EditTaskScreen}
        options={{title: t('navigation.editTask'), presentation: 'modal'}}
      />
      <TaskStack.Screen
        name="TaskComments"
        component={TaskCommentsScreen}
        options={{title: t('navigation.comments')}}
      />
    </TaskStack.Navigator>
  );
};

// Team Stack Navigator
const TeamStackNavigator: React.FC = () => {
  const {theme} = useTheme();
  const {t} = useTranslation();
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
        options={{title: t('navigation.team')}}
      />
      <TeamStack.Screen
        name="CreateTeam"
        component={CreateTeamScreen}
        options={{title: t('navigation.newTeam'), presentation: 'modal'}}
      />
      <TeamStack.Screen
        name="InviteMember"
        component={InviteMemberScreen}
        options={{title: t('navigation.inviteMember'), presentation: 'modal'}}
      />
      <TeamStack.Screen
        name="Invites"
        component={InvitesScreen}
        options={{title: t('navigation.invitations')}}
      />
      <TeamStack.Screen
        name="MemberProfile"
        component={MemberProfileScreen}
        options={{title: t('navigation.memberProfile')}}
      />
    </TeamStack.Navigator>
  );
};

// Profile Stack Navigator
const ProfileStackNavigator: React.FC = () => {
  const {theme} = useTheme();
  const {t} = useTranslation();
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: theme.colors.surface},
        headerTintColor: theme.colors.text,
        headerTitleStyle: {fontWeight: '600', fontSize: 17},
        headerShadowVisible: false,
      }}>
      <ProfileStack.Screen
        name="ProfileHome"
        component={ProfileScreen}
        options={{headerShown: false}}
      />
      <ProfileStack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{title: t('navigation.notifications')}}
      />
      <ProfileStack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{title: t('navigation.changePassword')}}
      />
      <ProfileStack.Screen
        name="EmailPreferences"
        component={EmailPreferencesScreen}
        options={{title: t('navigation.emailPreferences')}}
      />
      <ProfileStack.Screen
        name="Language"
        component={LanguageScreen}
        options={{title: t('navigation.language')}}
      />
      <ProfileStack.Screen
        name="About"
        component={AboutScreen}
        options={{title: t('navigation.about')}}
      />
      <ProfileStack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{title: t('navigation.privacyPolicy')}}
      />
      <ProfileStack.Screen
        name="TermsOfService"
        component={TermsOfServiceScreen}
        options={{title: t('navigation.termsOfService')}}
      />
    </ProfileStack.Navigator>
  );
};

// Main Tab Navigator
export const MainNavigator: React.FC = () => {
  const {theme} = useTheme();
  const {t} = useTranslation();
  const {user} = useAppSelector(state => state.auth);
  const {unreadCount} = useAppSelector(state => state.notifications);

  // Listen for global notifications
  useRealtimeNotifications(user?.id);

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
            <TabIcon
              icon="🏠"
              label={t('navigation.home')}
              focused={focused}
              color={color}
            />
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
            <TabIcon
              icon="✅"
              label={t('navigation.tasks')}
              focused={focused}
              color={color}
            />
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
              label={t('navigation.team')}
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
            <TabIcon
              icon="📊"
              label={t('navigation.stats')}
              focused={focused}
              color={color}
            />
          ),
          tabBarActiveTintColor: theme.colors.tabBarActive,
          tabBarInactiveTintColor: theme.colors.tabBarInactive,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarIcon: ({focused, color}) => (
            <TabIcon
              icon="👤"
              label={t('navigation.profile')}
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
