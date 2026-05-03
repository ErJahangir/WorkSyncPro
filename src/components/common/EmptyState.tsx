import {useTheme} from '@/theme';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import RNText from './RNText';

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
      <RNText style={styles.emptyIcon}>{icon}</RNText>
      <RNText
        style={[
          styles.emptyTitle,
          {color: theme.colors.text, fontSize: theme.typography.fontSize.xl},
        ]}>
        {title}
      </RNText>
      {subtitle && (
        <RNText
          style={[
            styles.emptySubtitle,
            {
              color: theme.colors.textSecondary,
              fontSize: theme.typography.fontSize.base,
            },
          ]}>
          {subtitle}
        </RNText>
      )}
      {action && (
        <TouchableOpacity
          onPress={action.onPress}
          activeOpacity={0.8}
          style={[
            styles.emptyAction,
            {backgroundColor: theme.colors.primaryLight},
          ]}>
          <RNText
            style={{
              color: theme.colors.primary,
              fontWeight: '600',
              fontSize: theme.typography.fontSize.base,
            }}>
            {action.label}
          </RNText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
