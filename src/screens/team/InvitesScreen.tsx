import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {RNText} from '@/components/common';
import {RootState, AppDispatch} from '@/store';
import {acceptInvite} from '@/store/slices/teamSlice';
import {db} from '@/services';
import {EmptyState} from '@/components';

export const InvitesScreen: React.FC = () => {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const {t} = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);

  const [invites, setInvites] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInvites = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const {data} = await db.getInvites(user.email);
      setInvites(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, [user]);

  const handleAccept = async (inviteId: string) => {
    if (!user) return;
    const resultAction = await dispatch(
      acceptInvite({inviteId, userId: user.id}),
    );

    if (acceptInvite.fulfilled.match(resultAction)) {
      fetchInvites();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <RNText style={styles.backButton}>←</RNText>
        </TouchableOpacity>
        <RNText style={styles.headerTitle}>{t('invites.title')}</RNText>
        <View style={{width: 40}} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchInvites} />
        }>
        {invites.length === 0 && !loading ? (
          <EmptyState
            icon="✉️"
            title={t('invites.noInvitesTitle')}
            subtitle={t('invites.noInvitesSubtitle')}
          />
        ) : (
          invites.map(invite => (
            <View key={invite.id} style={styles.inviteCard}>
              <View style={styles.inviteInfo}>
                <RNText style={styles.teamName}>{invite.team?.name}</RNText>
                <RNText style={styles.inviteRole}>{t('invites.role', {role: invite.role})}</RNText>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.acceptButton]}
                  onPress={() => handleAccept(invite.id)}>
                  <RNText style={styles.buttonText}>{t('invites.accept')}</RNText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.rejectButton]}>
                  <RNText
                    style={[styles.buttonText, {color: theme.colors.error}]}>
                    {t('invites.decline')}
                  </RNText>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
    },
    backButton: {
      fontSize: 24,
      color: theme.colors.text,
    },
    scrollContent: {
      padding: 20,
    },
    inviteCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    inviteInfo: {
      marginBottom: 20,
    },
    teamName: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 4,
    },
    inviteRole: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textTransform: 'capitalize',
    },
    actions: {
      flexDirection: 'row',
      gap: 12,
    },
    actionButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    acceptButton: {
      backgroundColor: theme.colors.primary,
    },
    rejectButton: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    buttonText: {
      fontSize: 15,
      fontWeight: '600',
      color: '#fff',
    },
  });
