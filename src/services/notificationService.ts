/**
 * WorkSync Pro - Notification Service
 * Pure Firebase Cloud Messaging (FCM) integration with Supabase
 */

import messaging from '@react-native-firebase/messaging';
import {Platform, PermissionsAndroid} from 'react-native';
import {db} from './supabase';
import {formatTimeForDB} from '@/utils';

/**
 * Request notification permissions for Android 13+ and iOS
 */
export const requestUserPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  return enabled;
};

/**
 * Get the FCM device token and optionally save it to Supabase
 */
export const getFCMToken = async (
  userId?: string,
  reminderEnabled?: boolean,
  reminderTime?: Date,
) => {
  try {
    // Required for iOS to register for remote messages before getting the token
    if (
      Platform.OS === 'ios' &&
      !messaging().isDeviceRegisteredForRemoteMessages
    ) {
      await messaging().registerDeviceForRemoteMessages();
    }

    const token = await messaging().getToken();

    if (userId && token) {
      const platform = Platform.OS === 'ios' ? 'ios' : 'android';
      const timeString = reminderTime ? formatTimeForDB(reminderTime) : undefined;

      const {error} = await db.saveFCMToken(
        userId,
        token,
        platform,
        reminderEnabled,
        timeString,
      );
    }

    return token;
  } catch (error) {
    return null;
  }
};

/**
 * Main setup function to initialize notification listeners
 */
export const setupNotifications = async (
  userId?: string,
  reminderEnabled?: boolean,
  reminderTime?: Date,
) => {
  // 1. Request Permission
  const hasPermission = await requestUserPermission();
  if (!hasPermission) {
    return;
  }

  // 2. Get Token & Save to DB
  await getFCMToken(userId, reminderEnabled, reminderTime);

  // 3. Handle Foreground Messages
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    // Note: FCM does not show banners in foreground by default.
    // To show a banner, you would typically use an in-app alert or @notifee/react-native.
  });

  // 4. Handle Notification Open from Background/Quit state
  messaging().onNotificationOpenedApp(remoteMessage => {
    handleNotificationTap(remoteMessage);
  });

  // Check if app was opened from a quit state via notification
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        handleNotificationTap(remoteMessage);
      }
    });

  return unsubscribe;
};

/**
 * Notification tap handler
 */
const handleNotificationTap = (remoteMessage: any) => {
  const {type, taskId, teamId} = remoteMessage.data || {};
  // TODO: Implement navigation logic using navigationRef
};

/**
 * Background message handler (registered in index.js)
 */
export const backgroundMessageHandler = async (remoteMessage: any) => {};
