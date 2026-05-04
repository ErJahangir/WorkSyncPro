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

import {useTranslation} from 'react-i18next';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {getFCMToken, storage} from '@/services';
import {useAppDispatch, useAppSelector} from '@/hooks';
import {logoutUser, updateUserProfile} from '@/store/slices';
import {Avatar, Card, Divider, Button, ActionSheet} from '@/components';
import {ProfileInfoCard, SettingRow, AccountMenuItem} from './components';
import {RNText} from '@/components/common';
import {pickImageFromLibrary, takePhotoWithCamera, formatTime} from '@/utils';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ProfileStackParamList} from '@/types';

export const ProfileScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const {theme, toggleTheme, isDark} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const dispatch = useAppDispatch();
  const {t} = useTranslation();
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

        if (error) throw error;

        if (url) {
          await dispatch(
            updateUserProfile({userId: user.id, updates: {avatar: url}}),
          );
        }
      } catch (err: any) {
        Alert.alert(
          t('profile.uploadFailed'),
          err.message || 'Could not update profile image',
        );
      } finally {
        setUploadingImage(false);
      }
    },
    [user, dispatch, t],
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
    Alert.alert(t('profile.logout'), t('profile.signOutConfirm'), [
      {text: t('profile.cancel'), style: 'cancel'},
      {
        text: t('profile.signOutBtn'),
        style: 'destructive',
        onPress: () => dispatch(logoutUser()),
      },
    ]);
  }, [dispatch, t]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Avatar
              name={user?.name || t('profile.defaultName')}
              uri={user?.avatar}
              size={90}
            />
            <TouchableOpacity
              onPress={() => setImageSheetVisible(true)}
              disabled={uploadingImage}
              style={[
                styles.editAvatarBtn,
                uploadingImage && styles.disabledBtn,
              ]}>
              <RNText style={styles.editAvatarText}>
                {uploadingImage
                  ? t('profile.uploading')
                  : t('profile.changePhoto')}
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
          <RNText style={styles.sectionTitle}>{t('profile.settings')}</RNText>

          <Card>
            <SettingRow
              icon="🌙"
              label={t('profile.darkMode')}
              description={t('profile.darkModeDesc')}
              value={isDark}
              onValueChange={toggleTheme}
            />
            <Divider />
            <SettingRow
              icon="⏰"
              label={t('profile.dailyReminder')}
              description={
                reminderEnabled
                  ? t('profile.scheduledFor', {time: formatTime(reminderTime)})
                  : t('profile.dailyReminderDesc')
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
          <RNText style={styles.sectionTitle}>{t('profile.account')}</RNText>

          <Card padding={0}>
            {[
              {
                icon: '🔔',
                label: t('profile.notificationsLabel'),
                onPress: () => navigation.navigate('Notifications'),
              },
              {
                icon: '🔒',
                label: t('profile.changePasswordLabel'),
                onPress: () => navigation.navigate('ChangePassword'),
              },
              {
                icon: '📧',
                label: t('profile.emailPreferencesLabel'),
                onPress: () => navigation.navigate('EmailPreferences'),
              },
              {
                icon: '🌐',
                label: t('profile.languageLabel'),
                onPress: () => navigation.navigate('Language'),
              },
              {
                icon: 'ℹ️',
                label: t('profile.aboutLabel'),
                onPress: () => navigation.navigate('About'),
              },
              {
                icon: '📄',
                label: t('profile.privacyPolicyLabel'),
                onPress: () => navigation.navigate('PrivacyPolicy'),
              },
              {
                icon: '📜',
                label: t('profile.termsOfServiceLabel'),
                onPress: () => navigation.navigate('TermsOfService'),
              },
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
            title={t('profile.logout')}
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
        title={t('profile.profilePhoto')}
        options={[
          {
            label: t('profile.takePhoto'),
            icon: '📸',
            onPress: handleCameraCapture,
          },
          {
            label: t('profile.chooseGallery'),
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
