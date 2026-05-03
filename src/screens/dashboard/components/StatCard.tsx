import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {Dimensions} from 'react-native';
import {RNText} from '@/components/common';

const {width} = Dimensions.get('window');

interface StatCardProps {
  label: string;
  value: number | string;
  icon: string;
  color: string;
  bgColor: string;
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  color,
  bgColor,
  trend,
}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.statCard}>
      <View style={[styles.statIconBg, {backgroundColor: bgColor}]}>
        <RNText style={styles.statIcon}>{icon}</RNText>
      </View>
      <RNText style={styles.statValue}>{value}</RNText>
      <RNText style={styles.statLabel}>{label}</RNText>
      {trend && <RNText style={[styles.trend, {color}]}>{trend}</RNText>}
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    statCard: {
      width: (width - 48 - 12) / 2,
      padding: 14,
      borderRadius: 16,
      gap: 6,
      borderWidth: 1,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.borderLight,
    },
    statIconBg: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    statIcon: {
      fontSize: 20,
    },
    statValue: {
      fontSize: 26,
      fontWeight: '800',
      letterSpacing: -1,
      marginTop: 4,
      color: theme.colors.text,
    },
    statLabel: {
      fontSize: 12,
      fontWeight: '500',
      color: theme.colors.textSecondary,
    },
    trend: {
      fontSize: 11,
      fontWeight: '600',
      marginTop: 2,
    },
  });
