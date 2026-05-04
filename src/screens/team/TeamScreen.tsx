/**
 * WorkSync Pro - Team List Screen
 * Displays members and allows inviting new ones
 */

import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {useAppDispatch, useAppSelector} from '@/hooks';
import {fetchTeams, fetchTeamMembers, setSelectedTeam} from '@/store/slices';
import {EmptyState} from '@/components';
import {TeamMemberRow} from './components';
import {RNText} from '@/components/common';
import {useTranslation} from 'react-i18next';

export const TeamScreen: React.FC = () => {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const {t} = useTranslation();
  const {user} = useAppSelector(s => s.auth);
  const {teams, members, selectedTeam, isLoading} = useAppSelector(s => s.team);

  useEffect(() => {
    if (user) {
      dispatch(fetchTeams(user.id));
    }
  }, [user, dispatch]);

  useEffect(() => {
    // If we have teams but none selected, select the first one
    if (teams.length > 0 && !selectedTeam) {
      dispatch(setSelectedTeam(teams[0]));
    }
  }, [teams, selectedTeam, dispatch]);

  useEffect(() => {
    if (selectedTeam) {
      dispatch(fetchTeamMembers(selectedTeam.id));
    }
  }, [selectedTeam, dispatch]);

  const onRefresh = () => {
    if (user) {
      dispatch(fetchTeams(user.id));
      if (selectedTeam) {
        dispatch(fetchTeamMembers(selectedTeam.id));
      }
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
            <RNText style={styles.title}>{t('team.title')}</RNText>
            <RNText style={styles.subtitle}>
              {t('team.membersCount', {count: members.length})}
            </RNText>
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
                navigation.navigate('InviteMember', {
                  teamId: selectedTeam?.id || 'default',
                })
              }
              style={styles.addButton}>
              <RNText style={styles.addButtonText}>{t('team.invite')}</RNText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Teams List */}
        <View style={styles.section}>
          <RNText style={styles.sectionTitle}>{t('team.yourTeams')}</RNText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.teamsList}>
            {teams.map(team => {
              const isSelected = selectedTeam?.id === team.id;
              return (
                <TouchableOpacity
                  key={team.id}
                  onPress={() => dispatch(setSelectedTeam(team))}
                  style={[
                    styles.teamCard,
                    isSelected && styles.selectedTeamCard,
                  ]}>
                  <View style={styles.teamAvatar}>
                    <RNText style={styles.teamAvatarText}>
                      {team.name.substring(0, 2).toUpperCase()}
                    </RNText>
                  </View>
                  <RNText
                    style={[
                      styles.teamName,
                      isSelected && styles.selectedTeamName,
                    ]}>
                    {team.name}
                  </RNText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Members */}
        <View style={styles.membersContainer}>
          <RNText style={styles.sectionTitle}>{t('team.members')}</RNText>
          {members.length === 0 && !isLoading ? (
            <EmptyState
              icon="👥"
              title={t('team.noMembersTitle')}
              subtitle={t('team.noMembersSubtitle')}
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
    section: {
      paddingVertical: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.text,
      paddingHorizontal: 20,
      marginBottom: 12,
    },
    teamsList: {
      paddingHorizontal: 20,
      gap: 12,
    },
    teamCard: {
      width: 100,
      alignItems: 'center',
      padding: 12,
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    selectedTeamCard: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primaryLight,
    },
    teamAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    teamAvatarText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '700',
    },
    teamName: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    selectedTeamName: {
      color: theme.colors.primary,
    },
    membersContainer: {
      flex: 1,
      paddingTop: 10,
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
    // membersContainer: {
    //   paddingHorizontal: theme.spacing.base,
    // },
    // sectionTitle: {
    //   fontSize: 17,
    //   fontWeight: '700',
    //   marginBottom: 12,
    //   color: theme.colors.text,
    // },
    footerSpacer: {
      height: 32,
    },
  });
