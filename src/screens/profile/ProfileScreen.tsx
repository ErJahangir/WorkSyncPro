/**
 * WorkSync Pro - Profile Screen
 * User profile, settings, preferences, logout
 */

import React, {useState, useCallback, useMemo} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {SafeAreaView} from 'react-native-safe-area-context';

import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {getFCMToken, storage} from '@/services';
import {useAppDispatch, useAppSelector} from '@/hooks';
import {logoutUser, updateUserProfile} from '@/store/slices';
import {Avatar, Card, Divider, Button, ActionSheet} from '@/components';
import {ProfileInfoCard, SettingRow, AccountMenuItem} from './components';
import {RNText} from '@/components/common';
import {pickImageFromLibrary, takePhotoWithCamera, formatTime} from '@/utils';

export const ProfileScreen: React.FC = () => {
  const {theme, toggleTheme, isDark} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(s => s.auth);

  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageSheetVisible, setImageSheetVisible] = useState(false);

  const handleImageSelected = useCallback(
    async (asset: any) => {
      if (!user || !asset.uri) return;
      setUploadingImage(true);

      try {
        const {url, error} = await storage.uploadAvatar(
          user.id,
          asset.uri,
          asset.type || 'image/jpeg',
          asset.base64,
        );
        console.log('ProfileScreen Upload Result:', {url, error});
        console.log(error, url, '====');

        if (error) throw error;

        if (url) {
          await dispatch(
            updateUserProfile({userId: user.id, updates: {avatar: url}}),
          );
        }
      } catch (err: any) {
        console.log(err);

        Alert.alert(
          'Upload Failed',
          err.message || 'Could not update profile image',
        );
      } finally {
        setUploadingImage(false);
      }
    },
    [user, dispatch],
  );

  const handleCameraCapture = useCallback(async () => {
    const asset = await takePhotoWithCamera();
    if (asset) handleImageSelected(asset);
  }, [handleImageSelected]);

  const handleGalleryPick = useCallback(async () => {
    const asset = await pickImageFromLibrary();
    if (asset) handleImageSelected(asset);
  }, [handleImageSelected]);

  const handleUpdateProfile = useCallback(
    async (name: string, bio: string) => {
      if (!user) return;
      await dispatch(
        updateUserProfile({userId: user.id, updates: {name, bio}}),
      );
    },
    [user, dispatch],
  );

  const handleReminderToggle = useCallback(
    (value: boolean) => {
      setReminderEnabled(value);
      if (value) {
        setDatePickerOpen(true);
      } else {
        if (user) {
          getFCMToken(user.id, false, reminderTime);
        }
      }
    },
    [user, reminderTime],
  );

  const handleLogout = useCallback(() => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => dispatch(logoutUser()),
      },
    ]);
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Avatar name={user?.name || 'User'} uri={user?.avatar} size={90} />
            <TouchableOpacity
              onPress={() => setImageSheetVisible(true)}
              disabled={uploadingImage}
              style={[
                styles.editAvatarBtn,
                uploadingImage && styles.disabledBtn,
              ]}>
              <RNText style={styles.editAvatarText}>
                {uploadingImage ? 'Uploading...' : 'Change Photo'}
              </RNText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Info Card */}
        <View style={styles.sectionOverlap}>
          <ProfileInfoCard user={user} onSave={handleUpdateProfile} />
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <RNText style={styles.sectionTitle}>Settings</RNText>

          <Card>
            <SettingRow
              icon="🌙"
              label="Dark Mode"
              description="Toggle dark theme"
              value={isDark}
              onValueChange={toggleTheme}
            />
            <Divider />
            <SettingRow
              icon="⏰"
              label="Daily Task Reminder"
              description={
                reminderEnabled
                  ? `Scheduled for ${formatTime(reminderTime)}`
                  : 'Get notified about pending tasks'
              }
              value={reminderEnabled}
              onValueChange={handleReminderToggle}
            />
          </Card>
        </View>

        <DatePicker
          modal
          open={datePickerOpen}
          date={reminderTime}
          mode="time"
          onConfirm={date => {
            setDatePickerOpen(false);
            setReminderTime(date);
            if (user) {
              getFCMToken(user.id, true, date);
            }
          }}
          onCancel={() => {
            setDatePickerOpen(false);
            if (reminderEnabled) setReminderEnabled(false);
          }}
        />

        {/* Account Section */}
        <View style={styles.section}>
          <RNText style={styles.sectionTitle}>Account</RNText>

          <Card padding={0}>
            {[
              {icon: '🔒', label: 'Change Password', onPress: () => {}},
              {icon: '📧', label: 'Email Preferences', onPress: () => {}},
              {icon: '🌐', label: 'Language', onPress: () => {}},
              {icon: 'ℹ️', label: 'About WorkSync Pro', onPress: () => {}},
              {icon: '📄', label: 'Privacy Policy', onPress: () => {}},
              {icon: '📜', label: 'Terms of Service', onPress: () => {}},
            ].map((item, i, arr) => (
              <AccountMenuItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                onPress={item.onPress}
                isLast={i === arr.length - 1}
              />
            ))}
          </Card>
        </View>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <Button
            title="Sign Out"
            onPress={handleLogout}
            variant="danger"
            fullWidth
            size="lg"
          />
          <RNText style={styles.versionText}>WorkSync Pro v1.0.0</RNText>
        </View>
      </ScrollView>

      <ActionSheet
        isVisible={imageSheetVisible}
        onClose={() => setImageSheetVisible(false)}
        title="Profile Photo"
        options={[
          {
            label: 'Take Photo',
            icon: '📸',
            onPress: handleCameraCapture,
          },
          {
            label: 'Choose from Gallery',
            icon: '🖼️',
            onPress: handleGalleryPick,
          },
        ]}
      />
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    profileHeader: {
      paddingTop: 40,
      paddingBottom: 60,
      alignItems: 'center',
      backgroundColor: theme.colors.primaryLight,
    },
    avatarContainer: {
      alignItems: 'center',
      gap: 12,
    },
    editAvatarBtn: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: theme.colors.primary,
    },
    disabledBtn: {
      opacity: 0.7,
      backgroundColor: theme.colors.textTertiary,
    },
    editAvatarText: {
      color: '#fff',
      fontSize: 11,
      fontWeight: '600',
    },
    sectionOverlap: {
      paddingHorizontal: theme.spacing.base,
      marginTop: -30,
    },
    section: {
      paddingHorizontal: theme.spacing.base,
      marginTop: theme.spacing.base,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: '700',
      marginBottom: 10,
      color: theme.colors.text,
    },
    logoutSection: {
      paddingHorizontal: theme.spacing.base,
      marginTop: theme.spacing.base,
      marginBottom: 40,
    },
    versionText: {
      color: theme.colors.textTertiary,
      fontSize: 11,
      textAlign: 'center',
      marginTop: 12,
    },
  });
