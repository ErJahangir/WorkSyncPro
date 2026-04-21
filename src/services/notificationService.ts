/**
 * WorkSync Pro - Notification Service
 * Push notifications setup and handlers
 */

import PushNotification from 'react-native-push-notification';
import {Platform} from 'react-native';

export const setupNotifications = () => {
  PushNotification.configure({
    onRegister: (token) => {
      console.log('📱 Push token:', token);
      // TODO: Send token to backend
    },

    onNotification: (notification) => {
      console.log('📬 Notification received:', notification);
      
      // Handle notification tap
      if (notification.userInteraction) {
        handleNotificationTap(notification);
      }
    },

    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    popInitialNotification: true,
    requestPermissions: Platform.OS === 'ios',
  });

  // Create notification channels (Android)
  if (Platform.OS === 'android') {
    PushNotification.createChannel(
      {
        channelId: 'worksync-default',
        channelName: 'WorkSync Notifications',
        channelDescription: 'Task updates and team activity',
        playSound: true,
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`Channel created: ${created}`),
    );
  }
};

const handleNotificationTap = (notification: any) => {
  // Navigate based on notification type
  const {type, taskId, teamId} = notification.data || {};
  
  // TODO: Use navigationRef to navigate
  console.log('Navigate to:', {type, taskId, teamId});
};

export const scheduleLocalNotification = (
  title: string,
  message: string,
  date: Date,
  data?: object,
) => {
  PushNotification.localNotificationSchedule({
    channelId: 'worksync-default',
    title,
    message,
    date,
    userInfo: data,
    playSound: true,
    soundName: 'default',
  });
};

export const cancelAllNotifications = () => {
  PushNotification.cancelAllLocalNotifications();
};

export const showInstantNotification = (title: string, message: string) => {
  PushNotification.localNotification({
    channelId: 'worksync-default',
    title,
    message,
    playSound: true,
    soundName: 'default',
  });
};
