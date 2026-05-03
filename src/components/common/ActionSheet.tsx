import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import RNText from './RNText';
import {SafeAreaView} from 'react-native-safe-area-context';

export interface ActionSheetOption {
  label: string;
  icon?: string;
  onPress: () => void;
  variant?: 'default' | 'danger';
}

interface ActionSheetProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  options: ActionSheetOption[];
}

export const ActionSheet = React.memo<ActionSheetProps>(({
  isVisible,
  onClose,
  title,
  options,
}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}
      backdropOpacity={0.5}
      useNativeDriver
      hideModalContentWhileAnimating>
      <SafeAreaView edges={['bottom']} style={styles.container}>
        <View style={styles.content}>
          <View style={styles.handle} />
          {title && <RNText style={styles.title}>{title}</RNText>}
          
          <View style={styles.optionsList}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={option.label}
                onPress={() => {
                  onClose();
                  // Small delay to allow modal to close before starting next action
                  setTimeout(option.onPress, 300);
                }}
                style={[
                  styles.option,
                  index === options.length - 1 && styles.lastOption,
                ]}>
                {option.icon && <RNText style={styles.optionIcon}>{option.icon}</RNText>}
                <RNText
                  style={[
                    styles.optionLabel,
                    option.variant === 'danger' && styles.dangerLabel,
                  ]}>
                  {option.label}
                </RNText>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
            <RNText style={styles.cancelText}>Cancel</RNText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
});

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    modal: {
      margin: 0,
      justifyContent: 'flex-end',
    },
    container: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
    },
    content: {
      paddingHorizontal: 20,
      paddingBottom: 20,
      paddingTop: 8,
    },
    handle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.colors.divider,
      alignSelf: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 16,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    optionsList: {
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 12,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
    },
    lastOption: {
      borderBottomWidth: 0,
    },
    optionIcon: {
      fontSize: 20,
      marginRight: 12,
    },
    optionLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text,
    },
    dangerLabel: {
      color: theme.colors.error,
    },
    cancelBtn: {
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: 'center',
    },
    cancelText: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.primary,
    },
  });
