import {useTheme} from '@/theme';
import React from 'react';
import {View, ViewStyle} from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius = 8,
  style,
}) => {
  const {theme} = useTheme();

  return (
    <View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: theme.isDark ? '#2A2A3E' : '#E5E7EB',
          overflow: 'hidden',
        },
        style,
      ]}
    />
  );
};

export const TaskCardSkeleton: React.FC = () => {
  const {theme} = useTheme();
  return (
    <View
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.base,
        marginBottom: theme.spacing.md,
        gap: 10,
        borderWidth: 1,
        borderColor: theme.colors.borderLight,
      }}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Skeleton width="60%" height={16} />
        <Skeleton width={50} height={20} borderRadius={10} />
      </View>
      <Skeleton height={12} />
      <Skeleton width="80%" height={12} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 4,
        }}>
        <Skeleton width={80} height={12} />
        <Skeleton width={60} height={24} borderRadius={12} />
      </View>
    </View>
  );
};
