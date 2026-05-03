import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView, TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {Button} from '@/components';
import {RNText} from '@/components/common';
import {RootState, AppDispatch} from '@/store';
import {createTeam} from '@/store/slices/teamSlice';
import {showToast} from '@/utils';

export const CreateTeamScreen: React.FC = () => {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      showToast('error', 'Please enter a team name');
      return;
    }
    if (!user) return;

    setLoading(true);
    try {
      const resultAction = await dispatch(
        createTeam({
          name: name.trim(),
          description: description.trim(),
          userId: user.id,
        }),
      );

      if (createTeam.fulfilled.match(resultAction)) {
        navigation.goBack();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <RNText style={styles.cancelText}>Cancel</RNText>
        </TouchableOpacity>
        <RNText style={styles.headerTitle}>Create New Team</RNText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <RNText style={styles.heroIcon}>🏗️</RNText>
        <RNText style={styles.description}>
          Teams help you organize tasks and collaborate with your colleagues in
          one shared workspace.
        </RNText>

        <RNText style={styles.fieldLabel}>Team Name</RNText>
        <View style={styles.inputWrapper}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Design Team, Project Phoenix"
            placeholderTextColor={theme.colors.textTertiary}
            style={styles.input}
          />
        </View>

        <RNText style={styles.fieldLabel}>Description (Optional)</RNText>
        <View style={styles.inputWrapper}>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="What is this team about?"
            placeholderTextColor={theme.colors.textTertiary}
            multiline
            numberOfLines={4}
            style={[styles.input, styles.textArea]}
          />
        </View>

        <Button
          title="Create Team"
          onPress={handleCreate}
          loading={loading}
          style={styles.submitButton}
        />
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
    cancelText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    headerSpacer: {
      width: 50,
    },
    scrollContent: {
      padding: 24,
      alignItems: 'center',
    },
    heroIcon: {
      fontSize: 60,
      marginBottom: 16,
    },
    description: {
      fontSize: 16,
      textAlign: 'center',
      color: theme.colors.textSecondary,
      marginBottom: 32,
      lineHeight: 22,
    },
    fieldLabel: {
      alignSelf: 'flex-start',
      fontSize: 15,
      fontWeight: '600',
      marginBottom: 8,
      color: theme.colors.text,
    },
    inputWrapper: {
      width: '100%',
      backgroundColor: theme.colors.surface,
      borderRadius: 14,
      marginBottom: 24,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    input: {
      paddingVertical: 14,
      fontSize: 16,
      color: theme.colors.text,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    submitButton: {
      marginTop: 8,
      width: '100%',
    },
  });
