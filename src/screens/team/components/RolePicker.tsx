import {useTranslation} from 'react-i18next';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {RNText} from '@/components/common';

interface RolePickerProps {
  selectedRole: 'admin' | 'manager' | 'user';
  onSelect: (role: 'admin' | 'manager' | 'user') => void;
}

export const RolePicker: React.FC<RolePickerProps> = ({
  selectedRole,
  onSelect,
}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const {t} = useTranslation();

  const roles = [
    {key: 'user', icon: '👤'},
    {key: 'manager', icon: '🎯'},
    {key: 'admin', icon: '👑'},
  ] as const;

  return (
    <View style={styles.container}>
      {roles.map(r => {
        const isSelected = selectedRole === r.key;
        return (
          <TouchableOpacity
            key={r.key}
            onPress={() => onSelect(r.key)}
            activeOpacity={0.75}
            style={[
              styles.roleItem,
              {
                borderColor: isSelected
                  ? theme.colors.primary
                  : theme.colors.border,
                backgroundColor: isSelected
                  ? theme.colors.primaryLight
                  : 'transparent',
              },
            ]}>
            <RNText style={styles.roleIcon}>{r.icon}</RNText>
            <RNText
              style={[
                styles.roleLabel,
                {
                  color: isSelected
                    ? theme.colors.primary
                    : theme.colors.textSecondary,
                },
              ]}>
              {t(`roles.${r.key}`)}
            </RNText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 32,
    },
    roleItem: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1.5,
    },
    roleIcon: {
      fontSize: 18,
      marginBottom: 4,
    },
    roleLabel: {
      fontSize: 12,
      fontWeight: '600',
    },
  });
