/**
 * WorkSync Pro - Profile Screen
 * User profile, settings, preferences, logout
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@/theme/ThemeProvider';
import {useAppDispatch, useAppSelector} from '@/hooks/useAppSelector';
import {logoutUser, updateUserProfile} from '@/store/slices/authSlice';
import {Avatar, Card, Divider} from '@/components/common';
import {Input} from '@/components/common/Input';
import {Button} from '@/components/common/Button';
import {getFCMToken} from '@services/notificationService';
import DatePicker from 'react-native-date-picker';
import {selectTaskStats} from '@/store/slices/tasksSlice';

export const ProfileScreen: React.FC = () => {
  const {theme, toggleTheme, isDark} = useTheme();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(s => s.auth);
  console.log('user', user);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);
  const taskStats = useAppSelector(selectTaskStats);

  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const handleSave = async () => {
    console.log('handleSave', user);
    if (!user) return;
    setSaving(true);
    await dispatch(updateUserProfile({userId: user.id, updates: {name, bio}}));
    setSaving(false);
    setEditMode(false);
  };

  const handleReminderToggle = (value: boolean) => {
    setReminderEnabled(value);
    if (value) {
      setDatePickerOpen(true);
    } else {
      // Sync disabled status to Supabase
      if (user) {
        getFCMToken(user.id, false, reminderTime);
      }
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => dispatch(logoutUser()),
      },
    ]);
  };

  return (
    <SafeAreaView
      style={[{flex: 1, backgroundColor: theme.colors.background}]}
      edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View
          style={[
            styles.profileHeader,
            {backgroundColor: theme.colors.primaryLight},
          ]}>
          <View style={{alignItems: 'center', gap: 12}}>
            <Avatar name={user?.name || 'User'} uri={user?.avatar} size={90} />
            <TouchableOpacity
              style={[
                styles.editAvatarBtn,
                {backgroundColor: theme.colors.primary},
              ]}>
              <Text style={{color: '#fff', fontSize: 11, fontWeight: '600'}}>
                Change Photo
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Info */}
        <View style={{paddingHorizontal: theme.spacing.base, marginTop: -30}}>
          <Card>
            {editMode ? (
              <View style={{gap: 8}}>
                <Input
                  label="Full Name"
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                />
                <View>
                  <Text
                    style={{
                      color: theme.colors.textSecondary,
                      fontSize: 12,
                      fontWeight: '500',
                      marginBottom: 8,
                    }}>
                    Bio
                  </Text>
                  <View
                    style={{
                      backgroundColor: theme.colors.surfaceVariant,
                      borderRadius: 12,
                      padding: 12,
                      minHeight: 80,
                    }}>
                    <TextInput
                      value={bio}
                      onChangeText={setBio}
                      placeholder="Tell us about yourself..."
                      placeholderTextColor={theme.colors.textTertiary}
                      multiline
                      numberOfLines={3}
                      style={{
                        color: theme.colors.text,
                        fontSize: 14,
                        textAlignVertical: 'top',
                      }}
                    />
                  </View>
                </View>
                <View style={{flexDirection: 'row', gap: 8, marginTop: 8}}>
                  <Button
                    title="Cancel"
                    onPress={() => setEditMode(false)}
                    variant="outline"
                    style={{flex: 1}}
                  />
                  <Button
                    title="Save"
                    onPress={handleSave}
                    loading={saving}
                    style={{flex: 1}}
                  />
                </View>
              </View>
            ) : (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}>
                  <View style={{flex: 1}}>
                    <Text style={[styles.userName, {color: theme.colors.text}]}>
                      {user?.name || 'User'}
                    </Text>
                    <Text
                      style={[
                        styles.userEmail,
                        {color: theme.colors.textSecondary},
                      ]}>
                      {user?.email || ''}
                    </Text>
                    {user?.bio && (
                      <Text
                        style={[
                          styles.userBio,
                          {color: theme.colors.textSecondary},
                        ]}>
                        {user.bio}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => setEditMode(true)}
                    style={[
                      styles.editBtn,
                      {backgroundColor: theme.colors.primaryLight},
                    ]}>
                    <Text
                      style={{
                        color: theme.colors.primary,
                        fontSize: 12,
                        fontWeight: '600',
                      }}>
                      Edit
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Card>
        </View>

        {/* Settings */}
        <View
          style={{
            paddingHorizontal: theme.spacing.base,
            marginTop: theme.spacing.base,
          }}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Settings
          </Text>

          <Card>
            {/* Dark Mode */}
            <View style={styles.settingRow}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  flex: 1,
                }}>
                <Text style={{fontSize: 20}}>🌙</Text>
                <View>
                  <Text
                    style={[styles.settingLabel, {color: theme.colors.text}]}>
                    Dark Mode
                  </Text>
                  <Text
                    style={[
                      styles.settingDesc,
                      {color: theme.colors.textSecondary},
                    ]}>
                    Toggle dark theme
                  </Text>
                </View>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary,
                }}
                thumbColor="#fff"
              />
            </View>

            <Divider />

            {/* Daily Reminder */}
            <View style={styles.settingRow}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  flex: 1,
                }}>
                <Text style={{fontSize: 20}}>⏰</Text>
                <View>
                  <Text
                    style={[styles.settingLabel, {color: theme.colors.text}]}>
                    Daily Task Reminder
                  </Text>
                  <Text
                    style={[
                      styles.settingDesc,
                      {color: theme.colors.textSecondary},
                    ]}>
                    {reminderEnabled
                      ? `Scheduled for ${reminderTime.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}`
                      : 'Get notified about pending tasks'}
                  </Text>
                </View>
              </View>
              <Switch
                value={reminderEnabled}
                onValueChange={handleReminderToggle}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary,
                }}
                thumbColor="#fff"
              />
            </View>
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
            
            // Sync to Supabase
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
        <View
          style={{
            paddingHorizontal: theme.spacing.base,
            marginTop: theme.spacing.base,
          }}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Account
          </Text>

          <Card padding={0}>
            {[
              {icon: '🔒', label: 'Change Password', onPress: () => {}},
              {icon: '📧', label: 'Email Preferences', onPress: () => {}},
              {icon: '🌐', label: 'Language', onPress: () => {}},
              {icon: 'ℹ️', label: 'About WorkSync Pro', onPress: () => {}},
              {icon: '📄', label: 'Privacy Policy', onPress: () => {}},
              {icon: '📜', label: 'Terms of Service', onPress: () => {}},
            ].map((item, i, arr) => (
              <React.Fragment key={i}>
                <TouchableOpacity
                  onPress={item.onPress}
                  style={[
                    styles.menuItem,
                    {
                      borderBottomWidth: i < arr.length - 1 ? 1 : 0,
                      borderBottomColor: theme.colors.divider,
                    },
                  ]}>
                  <Text style={{fontSize: 18}}>{item.icon}</Text>
                  <Text style={[styles.menuLabel, {color: theme.colors.text}]}>
                    {item.label}
                  </Text>
                  <Text
                    style={{color: theme.colors.textTertiary, fontSize: 16}}>
                    ›
                  </Text>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </Card>
        </View>

        {/* Logout */}
        <View
          style={{
            paddingHorizontal: theme.spacing.base,
            marginTop: theme.spacing.base,
            marginBottom: 40,
          }}>
          <Button
            title="Sign Out"
            onPress={handleLogout}
            variant="danger"
            fullWidth
            size="lg"
          />
          <Text
            style={{
              color: theme.colors.textTertiary,
              fontSize: 11,
              textAlign: 'center',
              marginTop: 12,
            }}>
            WorkSync Pro v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  profileHeader: {paddingTop: 40, paddingBottom: 60, alignItems: 'center'},
  editAvatarBtn: {paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999},
  userName: {fontSize: 20, fontWeight: '800', letterSpacing: -0.3},
  userEmail: {fontSize: 13, marginTop: 2},
  userBio: {fontSize: 14, marginTop: 8, lineHeight: 20},
  editBtn: {paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8},
  sectionTitle: {fontSize: 15, fontWeight: '700', marginBottom: 10},
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLabel: {fontSize: 15, fontWeight: '600'},
  settingDesc: {fontSize: 12, marginTop: 1},
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuLabel: {flex: 1, fontSize: 15, fontWeight: '500'},
});
