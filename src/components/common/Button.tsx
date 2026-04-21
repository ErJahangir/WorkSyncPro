/**
 * WorkSync Pro - Button Component
 * Production-grade button with variants, loading states, icons
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import {useTheme} from '@theme/ThemeProvider';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
}) => {
  const {theme} = useTheme();
  const {colors, borderRadius, spacing, typography} = theme;

  const getContainerStyle = (): ViewStyle => {
    const base: ViewStyle = {
      borderRadius: borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: spacing.sm,
      opacity: disabled || loading ? 0.6 : 1,
      ...(fullWidth && {width: '100%'}),
    };

    const sizeMap: Record<ButtonSize, ViewStyle> = {
      sm: {paddingVertical: spacing.sm, paddingHorizontal: spacing.md},
      md: {paddingVertical: 14, paddingHorizontal: spacing.xl},
      lg: {paddingVertical: spacing.base, paddingHorizontal: spacing['2xl']},
    };

    const variantMap: Record<ButtonVariant, ViewStyle> = {
      primary: {backgroundColor: colors.primary},
      secondary: {backgroundColor: colors.primaryLight},
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: colors.primary,
      },
      ghost: {backgroundColor: 'transparent'},
      danger: {backgroundColor: colors.error},
    };

    return {...base, ...sizeMap[size], ...variantMap[variant]};
  };

  const getTextStyle = (): TextStyle => {
    const sizeMap: Record<ButtonSize, TextStyle> = {
      sm: {fontSize: typography.fontSize.sm},
      md: {fontSize: typography.fontSize.base},
      lg: {fontSize: typography.fontSize.lg},
    };

    const variantMap: Record<ButtonVariant, TextStyle> = {
      primary: {color: '#fff'},
      secondary: {color: colors.primary},
      outline: {color: colors.primary},
      ghost: {color: colors.primary},
      danger: {color: '#fff'},
    };

    return {
      fontWeight: typography.fontWeight.semiBold,
      ...sizeMap[size],
      ...variantMap[variant],
    };
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[getContainerStyle(), style]}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? '#fff' : colors.primary}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </TouchableOpacity>
  );
};
