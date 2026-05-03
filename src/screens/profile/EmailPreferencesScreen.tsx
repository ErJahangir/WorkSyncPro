/**
 * WorkSync Pro - Email Preferences Screen
 * Manage email notification settings
 */

import React, {useState, useMemo} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {Card, Divider, RNText} from '@/components';
import {SettingRow} from './components';

export const EmailPreferencesScreen: React.FC = () => {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [prefs, setPrefs] = useState({
    taskAssigned: true,
    taskCompleted: false,
    mentions: true,
    teamInvites: true,
    weeklySummary: true,
    productUpdates: false,
  });

  const togglePref = (key: keyof typeof prefs) => {
    setPrefs(prev => ({...prev, [key]: !prev[key]}));
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <RNText style={styles.title}>Email Preferences</RNText>
          <RNText style={styles.subtitle}>
            Choose which notifications you'd like to receive via email.
          </RNText>
        </View>

        <View style={styles.section}>
          <RNText style={styles.sectionTitle}>Task Activity</RNText>
          <Card>
            <SettingRow
              label="Task Assigned"
              description="When someone assigns a task to you"
              value={prefs.taskAssigned}
              onValueChange={() => togglePref('taskAssigned')}
              icon="📥"
            />
            <Divider />
            <SettingRow
              label="Task Completed"
              description="When a task you created is completed"
              value={prefs.taskCompleted}
              onValueChange={() => togglePref('taskCompleted')}
              icon="✅"
            />
            <Divider />
            <SettingRow
              label="Mentions"
              description="When someone mentions you in a comment"
              value={prefs.mentions}
              onValueChange={() => togglePref('mentions')}
              icon="💬"
            />
          </Card>
        </View>

        <View style={styles.section}>
          <RNText style={styles.sectionTitle}>Team & Network</RNText>
          <Card>
            <SettingRow
              label="Team Invitations"
              description="When you are invited to join a team"
              value={prefs.teamInvites}
              onValueChange={() => togglePref('teamInvites')}
              icon="👥"
            />
          </Card>
        </View>

        <View style={styles.section}>
          <RNText style={styles.sectionTitle}>Updates & Reports</RNText>
          <Card>
            <SettingRow
              label="Weekly Productivity Report"
              description="A summary of your weekly achievements"
              value={prefs.weeklySummary}
              onValueChange={() => togglePref('weeklySummary')}
              icon="📊"
            />
            <Divider />
            <SettingRow
              label="Product Updates"
              description="News about WorkSync Pro features"
              value={prefs.productUpdates}
              onValueChange={() => togglePref('productUpdates')}
              icon="🚀"
            />
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      padding: theme.spacing.base,
      paddingBottom: 40,
    },
    header: {
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    section: {
      marginTop: 24,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.textTertiary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 10,
      marginLeft: 4,
    },
  });
