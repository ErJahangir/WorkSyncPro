import {useTheme} from '@/theme';
import React from 'react';
import {TouchableOpacity, View, ViewStyle} from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  padding?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  padding,
}) => {
  const {theme} = useTheme();
  const cardStyle: ViewStyle = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: padding ?? theme.spacing.base,
    ...theme.shadows.md,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onPress}
        style={[cardStyle, style]}>
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={[cardStyle, style]}>{children}</View>;
};
