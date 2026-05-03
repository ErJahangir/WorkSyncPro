import {useTheme} from '@/theme';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import RNText from './RNText';

export type BadgeVariant =
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  dot,
}) => {
  const {theme} = useTheme();
  const {colors} = theme;

  const colorMap: Record<BadgeVariant, {bg: string; text: string}> = {
    primary: {bg: colors.primaryLight, text: colors.primary},
    success: {bg: colors.successLight, text: colors.success},
    warning: {bg: colors.warningLight, text: colors.warning},
    error: {bg: colors.errorLight, text: colors.error},
    info: {bg: colors.infoLight, text: colors.info},
    neutral: {bg: colors.surfaceVariant, text: colors.textSecondary},
  };

  const {bg, text} = colorMap[variant];
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bg,
          paddingHorizontal: isSmall ? 6 : 10,
          paddingVertical: isSmall ? 2 : 4,
          borderRadius: 999,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
        },
      ]}>
      {dot && (
        <View
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: text,
          }}
        />
      )}
      <RNText
        style={[
          {
            color: text,
            fontSize: isSmall ? 10 : 11,
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          },
        ]}>
        {label}
      </RNText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {},
});
