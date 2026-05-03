import React from 'react';
import {StyleSheet, Switch, View} from 'react-native';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {RNText} from '@/components/common';

interface SettingRowProps {
  icon: string;
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export const SettingRow = React.memo<SettingRowProps>(({
  icon,
  label,
  description,
  value,
  onValueChange,
}) => {
  const {theme} = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <RNText style={styles.settingIcon}>{icon}</RNText>
        <View>
          <RNText style={styles.settingLabel}>{label}</RNText>
          <RNText style={styles.settingDesc}>{description}</RNText>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: theme.colors.border,
          true: theme.colors.primary,
        }}
        thumbColor="#fff"
      />
    </View>
  );
});

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
    },
    settingInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flex: 1,
    },
    settingIcon: {fontSize: 20},
    settingLabel: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.colors.text,
    },
    settingDesc: {
      fontSize: 12,
      marginTop: 1,
      color: theme.colors.textSecondary,
    },
  });
