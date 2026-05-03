import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {RNText} from '@/components/common';

interface AccountMenuItemProps {
  icon: string;
  label: string;
  onPress: () => void;
  isLast?: boolean;
}

export const AccountMenuItem = React.memo<AccountMenuItemProps>(({
  icon,
  label,
  onPress,
  isLast,
}) => {
  const {theme} = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.menuItem, !isLast && styles.menuItemBorder]}>
      <RNText style={styles.menuIcon}>{icon}</RNText>
      <RNText style={styles.menuLabel}>{label}</RNText>
      <RNText style={styles.menuArrow}>›</RNText>
    </TouchableOpacity>
  );
});

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    menuItemBorder: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
    },
    menuIcon: {fontSize: 18},
    menuLabel: {
      flex: 1,
      fontSize: 15,
      fontWeight: '500',
      color: theme.colors.text,
    },
    menuArrow: {
      color: theme.colors.textTertiary,
      fontSize: 16,
    },
  });
