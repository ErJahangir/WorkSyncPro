/**
 * WorkSync Pro - Team List Screen
 * Displays members and allows inviting new ones
 */

import React, {useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView, RefreshControl} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {useAppDispatch, useAppSelector} from '@/hooks';
import {fetchTeams, fetchTeamMembers} from '@/store/slices';
import {EmptyState} from '@/components';
import {TeamMemberRow} from './components';
import {RNText} from '@/components/common';

export const TeamScreen: React.FC = () => {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(s => s.auth);
  const {members, isLoading} = useAppSelector(s => s.team);

  useEffect(() => {
    if (user) {
      dispatch(fetchTeams(user.id));
    }
  }, [user, dispatch]);

  useEffect(() => {
    // If a team is selected, fetch its members
    const teamId = 'default'; // For now, or get from state
    dispatch(fetchTeamMembers(teamId));
  }, [dispatch]);

  const onRefresh = () => {
    if (user) {
      dispatch(fetchTeams(user.id));
      dispatch(fetchTeamMembers(user.id));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <RNText style={styles.title}>Team</RNText>
            <RNText style={styles.subtitle}>{members.length} members</RNText>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Invites')}
              style={styles.headerIconButton}>
              <RNText style={styles.headerIconText}>✉️</RNText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('CreateTeam')}
              style={styles.headerIconButton}>
              <RNText style={styles.headerIconText}>🏗️</RNText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('InviteMember', {teamId: 'default'})
              }
              style={styles.addButton}>
              <RNText style={styles.addButtonText}>+ Invite</RNText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Members */}
        <View style={styles.membersContainer}>
          <RNText style={styles.sectionTitle}>Members</RNText>
          {members.length === 0 && !isLoading ? (
            <EmptyState
              icon="👥"
              title="No team members"
              subtitle="Invite your teammates to get started"
            />
          ) : (
            members.map(member => (
              <TeamMemberRow
                key={member.id}
                member={member}
                onPress={() =>
                  navigation.navigate('MemberProfile', {userId: member.user_id})
                }
              />
            ))
          )}
        </View>

        <View style={styles.footerSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
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
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    headerIconButton: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    headerIconText: {
      fontSize: 20,
    },
    addButton: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: theme.colors.primary,
    },
    addButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    membersContainer: {
      paddingHorizontal: theme.spacing.base,
    },
    sectionTitle: {
      fontSize: 17,
      fontWeight: '700',
      marginBottom: 12,
      color: theme.colors.text,
    },
    footerSpacer: {
      height: 32,
    },
  });
