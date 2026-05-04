/**
 * WorkSync Pro - Email Preferences Screen
 * Manage email notification settings
 */

import React, {useState, useMemo} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {Card, Divider, RNText} from '@/components';
import {SettingRow} from './components';

export const EmailPreferencesScreen: React.FC = () => {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {t} = useTranslation();

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
          <RNText style={styles.title}>{t('profile.emailPreferences.title')}</RNText>
          <RNText style={styles.subtitle}>
            {t('profile.emailPreferences.subtitle')}
          </RNText>
        </View>

        <View style={styles.section}>
          <RNText style={styles.sectionTitle}>{t('profile.emailPreferences.taskActivity')}</RNText>
          <Card>
            <SettingRow
              label={t('profile.emailPreferences.taskAssigned')}
              description={t('profile.emailPreferences.taskAssignedDesc')}
              value={prefs.taskAssigned}
              onValueChange={() => togglePref('taskAssigned')}
              icon="📥"
            />
            <Divider />
            <SettingRow
              label={t('profile.emailPreferences.taskCompleted')}
              description={t('profile.emailPreferences.taskCompletedDesc')}
              value={prefs.taskCompleted}
              onValueChange={() => togglePref('taskCompleted')}
              icon="✅"
            />
            <Divider />
            <SettingRow
              label={t('profile.emailPreferences.mentions')}
              description={t('profile.emailPreferences.mentionsDesc')}
              value={prefs.mentions}
              onValueChange={() => togglePref('mentions')}
              icon="💬"
            />
          </Card>
        </View>

        <View style={styles.section}>
          <RNText style={styles.sectionTitle}>{t('profile.emailPreferences.teamNetwork')}</RNText>
          <Card>
            <SettingRow
              label={t('profile.emailPreferences.teamInvites')}
              description={t('profile.emailPreferences.teamInvitesDesc')}
              value={prefs.teamInvites}
              onValueChange={() => togglePref('teamInvites')}
              icon="👥"
            />
          </Card>
        </View>

        <View style={styles.section}>
          <RNText style={styles.sectionTitle}>{t('profile.emailPreferences.updatesReports')}</RNText>
          <Card>
            <SettingRow
              label={t('profile.emailPreferences.weeklySummary')}
              description={t('profile.emailPreferences.weeklySummaryDesc')}
              value={prefs.weeklySummary}
              onValueChange={() => togglePref('weeklySummary')}
              icon="📊"
            />
            <Divider />
            <SettingRow
              label={t('profile.emailPreferences.productUpdates')}
              description={t('profile.emailPreferences.productUpdatesDesc')}
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
