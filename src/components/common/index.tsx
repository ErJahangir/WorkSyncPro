/**
 * WorkSync Pro - Common UI Components
 * Card, Badge, Avatar, EmptyState, SkeletonLoader, Divider
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Image,
} from 'react-native';
import {useTheme} from '@theme/ThemeProvider';

// ─── Card ─────────────────────────────────────────────────

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

// ─── Badge ────────────────────────────────────────────────

type BadgeVariant =
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
      <Text
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
      </Text>
    </View>
  );
};

// ─── Avatar ───────────────────────────────────────────────

interface AvatarProps {
  name: string;
  uri?: string;
  size?: number;
  style?: ViewStyle;
  showOnlineIndicator?: boolean;
  isOnline?: boolean;
}

const AVATAR_COLORS = [
  '#6366F1',
  '#8B5CF6',
  '#EC4899',
  '#EF4444',
  '#F59E0B',
  '#10B981',
  '#3B82F6',
  '#14B8A6',
];

const getAvatarColor = (name: string = ''): string => {
  const safeName = name || 'User';
  let hash = 0;
  for (let i = 0; i < safeName.length; i++) {
    hash = safeName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

export const Avatar: React.FC<AvatarProps> = ({
  name,
  uri,
  size = 40,
  style,
  showOnlineIndicator,
  isOnline,
}) => {
  const initialName = name || 'User';
  const initials = initialName
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const bgColor = getAvatarColor(initialName);
  const fontSize = size * 0.38;

  return (
    <View style={[{width: size, height: size}, style]}>
      {uri ? (
        <Image
          source={{uri}}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
          }}
        />
      ) : (
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: bgColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: '#fff',
              fontSize,
              fontWeight: '700',
            }}>
            {initials}
          </Text>
        </View>
      )}
      {showOnlineIndicator && (
        <View
          style={[
            styles.onlineIndicator,
            {
              backgroundColor: isOnline ? '#10B981' : '#9CA3AF',
              width: size * 0.28,
              height: size * 0.28,
              borderRadius: size * 0.14,
              bottom: 0,
              right: 0,
              borderWidth: 2,
              borderColor: '#fff',
            },
          ]}
        />
      )}
    </View>
  );
};

// ─── EmptyState ───────────────────────────────────────────

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  action?: {label: string; onPress: () => void};
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📭',
  title,
  subtitle,
  action,
}) => {
  const {theme} = useTheme();

  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>{icon}</Text>
      <Text
        style={[
          styles.emptyTitle,
          {color: theme.colors.text, fontSize: theme.typography.fontSize.xl},
        ]}>
        {title}
      </Text>
      {subtitle && (
        <Text
          style={[
            styles.emptySubtitle,
            {
              color: theme.colors.textSecondary,
              fontSize: theme.typography.fontSize.base,
            },
          ]}>
          {subtitle}
        </Text>
      )}
      {action && (
        <TouchableOpacity
          onPress={action.onPress}
          activeOpacity={0.8}
          style={[
            styles.emptyAction,
            {backgroundColor: theme.colors.primaryLight},
          ]}>
          <Text
            style={{
              color: theme.colors.primary,
              fontWeight: '600',
              fontSize: theme.typography.fontSize.base,
            }}>
            {action.label}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ─── SkeletonLoader ───────────────────────────────────────

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
          width: width as number,
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

// ─── Divider ──────────────────────────────────────────────

export const Divider: React.FC<{style?: ViewStyle}> = ({style}) => {
  const {theme} = useTheme();
  return (
    <View
      style={[
        {height: 1, backgroundColor: theme.colors.divider, marginVertical: 4},
        style,
      ]}
    />
  );
};

// ─── LoadingScreen ────────────────────────────────────────

export const LoadingScreen: React.FC = () => {
  const {theme} = useTheme();
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background,
      }}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
};

// ─── NetworkBanner ────────────────────────────────────────

export const NetworkBanner: React.FC = () => {
  const {theme} = useTheme();
  const {isNetworkAvailable} = {isNetworkAvailable: true}; // from store in real usage

  if (isNetworkAvailable) return null;

  return (
    <View
      style={{
        backgroundColor: theme.colors.error,
        padding: 8,
        alignItems: 'center',
      }}>
      <Text style={{color: '#fff', fontSize: 12, fontWeight: '600'}}>
        📡 No internet connection — showing cached data
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {},
  onlineIndicator: {
    position: 'absolute',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyTitle: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyAction: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
  },
});
