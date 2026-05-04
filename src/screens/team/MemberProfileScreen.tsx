/**
 * WorkSync Pro - Member Profile Screen
 * Displays detailed information about a team member
 */

import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {useAppSelector} from '@/hooks';
import {Avatar, Badge, Card} from '@/components';
import {ROLE_LABELS} from '@/constants';
import {RNText} from '@/components/common';
import {useTranslation} from 'react-i18next';

export const MemberProfileScreen: React.FC = () => {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const route = useRoute<any>();
  const {t} = useTranslation();
  const {members} = useAppSelector(s => s.team);
  const {tasks} = useAppSelector(s => s.tasks);
  const member = members.find(m => m.user_id === route.params?.userId);

  const memberTasks = tasks.filter(t => t.assigned_to === member?.user_id);
  const completedTasks = memberTasks.filter(t => t.status === 'completed');
  const completionRate =
    memberTasks.length > 0
      ? Math.round((completedTasks.length / memberTasks.length) * 100)
      : 0;

  const stats = [
    {
      label: t('memberProfile.tasksAssigned'),
      value: memberTasks.length.toString(),
    },
    {
      label: t('memberProfile.tasksCompleted'),
      value: completedTasks.length.toString(),
    },
    {label: t('memberProfile.completionRate'), value: `${completionRate}%`},
    {
      label: t('memberProfile.memberSince'),
      value: member ? new Date(member.joined_at).toLocaleDateString() : '—',
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}>
      <View style={styles.hero}>
        <Avatar
          name={member?.user?.name || '?'}
          uri={member?.user?.avatar}
          size={80}
        />
        <RNText style={styles.heroName}>
          {member?.user?.name || t('memberProfile.defaultName')}
        </RNText>
        <RNText style={styles.heroEmail}>{member?.user?.email || ''}</RNText>
        {member && (
          <Badge
            label={ROLE_LABELS[member.role]}
            variant={member.role === 'admin' ? 'error' : 'primary'}
          />
        )}
      </View>

      <View style={styles.content}>
        <Card>
          <RNText style={styles.sectionTitle}>
            {t('memberProfile.activity')}
          </RNText>
          {stats.map((item, index) => (
            <View
              key={item.label}
              style={[
                styles.statRow,
                index === stats.length - 1 && styles.noBorder,
              ]}>
              <RNText style={styles.statLabel}>{item.label}</RNText>
              <RNText style={styles.statValue}>{item.value}</RNText>
            </View>
          ))}
        </Card>
      </View>
    </ScrollView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingBottom: 40,
    },
    hero: {
      alignItems: 'center',
      paddingVertical: 40,
      gap: 8,
      backgroundColor: theme.colors.primaryLight,
    },
    heroName: {
      fontSize: 22,
      fontWeight: '800',
      color: theme.colors.text,
    },
    heroEmail: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    content: {
      paddingHorizontal: 16,
      marginTop: 16,
    },
    sectionTitle: {
      color: theme.colors.textSecondary,
      fontSize: 12,
      fontWeight: '600',
      textTransform: 'uppercase',
      marginBottom: 12,
    },
    statRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
    },
    statLabel: {
      color: theme.colors.textSecondary,
      fontSize: 14,
    },
    statValue: {
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: '600',
    },
    noBorder: {
      borderBottomWidth: 0,
    },
  });
