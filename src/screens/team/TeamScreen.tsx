/**
 * WorkSync Pro - Team Screens
 */

import React, {useEffect, useState} from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  ScrollView, RefreshControl, TextInput,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTheme} from '@theme/ThemeProvider';
import {useAppDispatch, useAppSelector} from '@hooks/useAppSelector';
import {fetchTeams, fetchTeamMembers} from '@store/slices/teamSlice';
import {Card, Avatar, Badge, EmptyState} from '@components/common/index';
import {ROLE_LABELS} from '@constants/config';
import {TeamMember} from '@/types/index';
import {Button} from '@components/common/Button';

// ─── Team List Screen ─────────────────────────────────────

export const TeamScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(s => s.auth);
  const {teams, members, isLoading} = useAppSelector(s => s.team);

  useEffect(() => {
    if (user) {
      dispatch(fetchTeams(user.id));
      dispatch(fetchTeamMembers(user.id));
    }
  }, [user, dispatch]);

  return (
    <SafeAreaView style={[{flex: 1, backgroundColor: theme.colors.background}]} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => user && dispatch(fetchTeams(user.id))} tintColor={theme.colors.primary} />}>

        {/* Header */}
        <View style={[styles.header, {paddingHorizontal: theme.spacing.base}]}>
          <View>
            <Text style={[styles.title, {color: theme.colors.text}]}>Team</Text>
            <Text style={[styles.subtitle, {color: theme.colors.textSecondary}]}>
              {members.length} members
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('InviteMember', {teamId: 'default'})}
            style={[styles.addButton, {backgroundColor: theme.colors.primary}]}>
            <Text style={{color: '#fff', fontSize: 18, fontWeight: '600'}}>+ Invite</Text>
          </TouchableOpacity>
        </View>

        {/* Members */}
        <View style={{paddingHorizontal: theme.spacing.base}}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>Members</Text>
          {members.length === 0 && !isLoading ? (
            <EmptyState icon="👥" title="No team members" subtitle="Invite your teammates to get started" />
          ) : (
            members.map(member => (
              <Card
                key={member.id}
                style={{marginBottom: 10}}
                onPress={() => navigation.navigate('MemberProfile', {userId: member.user_id})}>
                <View style={styles.memberRow}>
                  <Avatar name={member.user?.name || '?'} uri={member.user?.avatar} size={48} showOnlineIndicator isOnline={Math.random() > 0.5} />
                  <View style={{flex: 1}}>
                    <Text style={[styles.memberName, {color: theme.colors.text}]}>
                      {member.user?.name || 'Unknown'}
                    </Text>
                    <Text style={[styles.memberEmail, {color: theme.colors.textSecondary}]}>
                      {member.user?.email || ''}
                    </Text>
                  </View>
                  <Badge
                    label={ROLE_LABELS[member.role] || member.role}
                    variant={member.role === 'admin' ? 'error' : member.role === 'manager' ? 'warning' : 'neutral'}
                    size="sm"
                  />
                </View>
              </Card>
            ))
          )}
        </View>

        <View style={{height: 32}} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Team Detail Screen ───────────────────────────────────

export const TeamDetailScreen: React.FC = () => {
  const {theme} = useTheme();
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background}}>
      <Text style={{color: theme.colors.text, fontSize: 24}}>Team Details</Text>
    </View>
  );
};

// ─── Invite Member Screen ─────────────────────────────────

export const InviteMemberScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'manager' | 'user'>('user');
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.goBack();
    }, 1000);
  };

  return (
    <View style={[{flex: 1, backgroundColor: theme.colors.background}]}>
      <View style={[styles.modalHeader, {borderBottomColor: theme.colors.border}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{color: theme.colors.textSecondary, fontSize: 15}}>Cancel</Text>
        </TouchableOpacity>
        <Text style={[styles.modalTitle, {color: theme.colors.text}]}>Invite Member</Text>
        <View style={{width: 60}} />
      </View>

      <ScrollView contentContainerStyle={{paddingHorizontal: 24, paddingTop: 24}} keyboardShouldPersistTaps="handled">
        <Text style={{fontSize: 32, textAlign: 'center', marginBottom: 16}}>📧</Text>
        <Text style={[styles.inviteDesc, {color: theme.colors.textSecondary}]}>
          Enter the email address of the person you'd like to invite to your team.
        </Text>

        <Text style={[styles.fieldLabel, {color: theme.colors.textSecondary}]}>Email Address</Text>
        <View style={[styles.emailInput, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="colleague@company.com"
            placeholderTextColor={theme.colors.textTertiary}
            keyboardType="email-address"
            autoCapitalize="none"
            style={{flex: 1, color: theme.colors.text, fontSize: 14, padding: 14}}
          />
        </View>

        <Text style={[styles.fieldLabel, {color: theme.colors.textSecondary, marginTop: 16}]}>Role</Text>
        <View style={{flexDirection: 'row', gap: 8, marginBottom: 32}}>
          {(['user', 'manager', 'admin'] as const).map(r => (
            <TouchableOpacity key={r} onPress={() => setRole(r)} activeOpacity={0.75}
              style={{
                flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center',
                borderWidth: 1.5, borderColor: role === r ? theme.colors.primary : theme.colors.border,
                backgroundColor: role === r ? theme.colors.primaryLight : 'transparent',
              }}>
              <Text style={{fontSize: 18, marginBottom: 4}}>{r === 'admin' ? '👑' : r === 'manager' ? '🎯' : '👤'}</Text>
              <Text style={{fontSize: 12, fontWeight: '600', color: role === r ? theme.colors.primary : theme.colors.textSecondary}}>
                {ROLE_LABELS[r]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button title="Send Invitation" onPress={handleInvite} loading={loading} fullWidth size="lg" />
      </ScrollView>
    </View>
  );
};

// ─── Member Profile Screen ────────────────────────────────

export const MemberProfileScreen: React.FC = () => {
  const {theme} = useTheme();
  const route = useRoute<any>();
  const {members} = useAppSelector(s => s.team);
  const member = members.find(m => m.user_id === route.params?.userId);

  return (
    <ScrollView style={{flex: 1, backgroundColor: theme.colors.background}}
      contentContainerStyle={{paddingBottom: 40}}>
      <View style={[styles.profileHero, {backgroundColor: theme.colors.primaryLight}]}>
        <Avatar name={member?.user?.name || '?'} uri={member?.user?.avatar} size={80} />
        <Text style={[styles.profileName, {color: theme.colors.text}]}>
          {member?.user?.name || 'Team Member'}
        </Text>
        <Text style={[styles.profileEmail, {color: theme.colors.textSecondary}]}>
          {member?.user?.email || ''}
        </Text>
        {member && (
          <Badge label={ROLE_LABELS[member.role]} variant={member.role === 'admin' ? 'error' : 'primary'} />
        )}
      </View>

      <View style={{paddingHorizontal: 16, marginTop: 16}}>
        <Card>
          <Text style={{color: theme.colors.textSecondary, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 12}}>
            Activity
          </Text>
          {[
            {label: 'Tasks Assigned', value: '12'},
            {label: 'Tasks Completed', value: '8'},
            {label: 'Completion Rate', value: '67%'},
            {label: 'Member Since', value: member ? new Date(member.joined_at).toLocaleDateString() : '—'},
          ].map(item => (
            <View key={item.label} style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: theme.colors.divider}}>
              <Text style={{color: theme.colors.textSecondary, fontSize: 14}}>{item.label}</Text>
              <Text style={{color: theme.colors.text, fontSize: 14, fontWeight: '600'}}>{item.value}</Text>
            </View>
          ))}
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, paddingBottom: 20},
  title: {fontSize: 26, fontWeight: '800', letterSpacing: -0.5},
  subtitle: {fontSize: 13, marginTop: 2},
  addButton: {paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12},
  sectionTitle: {fontSize: 17, fontWeight: '700', marginBottom: 12},
  memberRow: {flexDirection: 'row', alignItems: 'center', gap: 12},
  memberName: {fontSize: 15, fontWeight: '600'},
  memberEmail: {fontSize: 12, marginTop: 1},
  modalHeader: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1},
  modalTitle: {fontSize: 17, fontWeight: '700'},
  inviteDesc: {fontSize: 14, lineHeight: 22, textAlign: 'center', marginBottom: 24},
  fieldLabel: {fontSize: 12, fontWeight: '600', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.4},
  emailInput: {borderRadius: 12, borderWidth: 1.5, overflow: 'hidden'},
  profileHero: {alignItems: 'center', paddingVertical: 40, gap: 8},
  profileName: {fontSize: 22, fontWeight: '800'},
  profileEmail: {fontSize: 14},
});
