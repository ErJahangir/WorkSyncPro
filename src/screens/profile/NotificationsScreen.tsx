/**
 * WorkSync Pro - Notifications Screen
 * View and manage app notifications
 */

import React, {useEffect, useMemo} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {useAppDispatch, useAppSelector} from '@/hooks';
import {fetchNotifications, markAsRead, markAllRead} from '@/store/slices';
import {Card, Divider, Button} from '@/components';
import {RNText} from '@/components/common';
import type {Notification} from '@/types';
import {formatDistanceToNow} from 'date-fns';

export const NotificationsScreen: React.FC = () => {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const dispatch = useAppDispatch();
  const {t} = useTranslation();
  const {user} = useAppSelector(state => state.auth);
  const {notifications, unreadCount, isLoading} = useAppSelector(
    state => state.notifications,
  );

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchNotifications(user.id));
    }
  }, [user?.id, dispatch]);

  const onRefresh = () => {
    if (user?.id) {
      dispatch(fetchNotifications(user.id));
    }
  };

  const handleMarkAllRead = () => {
    dispatch(markAllRead());
  };

  const handleNotificationPress = (id: string, isRead: boolean) => {
    if (!isRead) {
      dispatch(markAsRead(id));
    }
  };

  const renderNotification = ({item}: {item: Notification}) => (
    <TouchableOpacity
      onPress={() => handleNotificationPress(item.id, item.is_read)}
      activeOpacity={0.7}>
      <Card style={[styles.notificationCard, !item.is_read && styles.unreadCard]}>
        <View style={styles.notificationHeader}>
          <View style={styles.titleRow}>
            {!item.is_read && <View style={styles.unreadDot} />}
            <RNText style={styles.notificationTitle}>{item.title}</RNText>
          </View>
          <RNText style={styles.notificationTime}>
            {formatDistanceToNow(new Date(item.created_at), {addSuffix: true})}
          </RNText>
        </View>
        <RNText style={styles.notificationBody}>{item.body}</RNText>
      </Card>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <RNText style={styles.emptyText}>🔔</RNText>
      <RNText style={styles.emptyTitle}>{t('notifications.noNotifications')}</RNText>
      <RNText style={styles.emptySubtitle}>
        {t('notifications.emptySubtitle')}
      </RNText>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <RNText style={styles.headerTitle}>{t('notifications.title')}</RNText>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={handleMarkAllRead}>
            <RNText style={styles.markAllRead}>{t('notifications.markAllAsRead')}</RNText>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor={theme.colors.primary} />
        }
        ListEmptyComponent={!isLoading ? renderEmpty : null}
        ListFooterComponent={<View style={{height: 20}} />}
      />
    </SafeAreaView>
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
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.base,
      paddingVertical: 15,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text,
    },
    markAllRead: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '600',
    },
    listContent: {
      paddingHorizontal: theme.spacing.base,
      paddingBottom: 20,
    },
    notificationCard: {
      marginBottom: 12,
      borderLeftWidth: 4,
      borderLeftColor: 'transparent',
    },
    unreadCard: {
      borderLeftColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + '08', // 5% opacity
    },
    notificationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 6,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.primary,
      marginRight: 8,
    },
    notificationTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.colors.text,
      flex: 1,
    },
    notificationTime: {
      fontSize: 11,
      color: theme.colors.textTertiary,
      marginLeft: 8,
    },
    notificationBody: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 100,
    },
    emptyText: {
      fontSize: 60,
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: 14,
      color: theme.colors.textTertiary,
      textAlign: 'center',
      paddingHorizontal: 40,
    },
  });
