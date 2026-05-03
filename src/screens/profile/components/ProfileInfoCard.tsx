import React, {useState} from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {Card, Input, Button} from '@/components';
import {RNText} from '@/components/common';

interface ProfileInfoCardProps {
  user: any;
  onSave: (name: string, bio: string) => Promise<void>;
}

export const ProfileInfoCard = React.memo<ProfileInfoCardProps>(({
  user,
  onSave,
}) => {
  const {theme} = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(name, bio);
    setSaving(false);
    setEditMode(false);
  };

  if (editMode) {
    return (
      <Card>
        <View style={styles.editForm}>
          <Input
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Your name"
          />
          <View>
            <RNText style={styles.inputLabel}>Bio</RNText>
            <View style={styles.bioInputContainer}>
              <TextInput
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself..."
                placeholderTextColor={theme.colors.textTertiary}
                multiline
                numberOfLines={3}
                style={styles.bioInput}
              />
            </View>
          </View>
          <View style={styles.editActions}>
            <Button
              title="Cancel"
              onPress={() => setEditMode(false)}
              variant="outline"
              style={styles.flexOne}
            />
            <Button
              title="Save"
              onPress={handleSave}
              loading={saving}
              style={styles.flexOne}
            />
          </View>
        </View>
      </Card>
    );
  }

  return (
    <Card>
      <View style={styles.infoRow}>
        <View style={styles.flexOne}>
          <RNText style={styles.userName}>{user?.name || 'User'}</RNText>
          <RNText style={styles.userEmail}>{user?.email || ''}</RNText>
          {user?.bio && <RNText style={styles.userBio}>{user.bio}</RNText>}
        </View>
        <TouchableOpacity
          onPress={() => setEditMode(true)}
          style={styles.editBtn}>
          <RNText style={styles.editBtnText}>Edit</RNText>
        </TouchableOpacity>
      </View>
    </Card>
  );
});

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    editForm: {gap: 8},
    inputLabel: {
      color: theme.colors.textSecondary,
      fontSize: 12,
      fontWeight: '500',
      marginBottom: 8,
    },
    bioInputContainer: {
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 12,
      padding: 12,
      minHeight: 80,
    },
    bioInput: {
      color: theme.colors.text,
      fontSize: 14,
      textAlignVertical: 'top',
    },
    editActions: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 8,
    },
    flexOne: {flex: 1},
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    userName: {
      fontSize: 20,
      fontWeight: '800',
      letterSpacing: -0.3,
      color: theme.colors.text,
    },
    userEmail: {
      fontSize: 13,
      marginTop: 2,
      color: theme.colors.textSecondary,
    },
    userBio: {
      fontSize: 14,
      marginTop: 8,
      lineHeight: 20,
      color: theme.colors.textSecondary,
    },
    editBtn: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      backgroundColor: theme.colors.primaryLight,
    },
    editBtnText: {
      color: theme.colors.primary,
      fontSize: 12,
      fontWeight: '600',
    },
  });
