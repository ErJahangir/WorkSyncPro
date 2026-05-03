import React from 'react';
import {StyleSheet, View} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {RNText} from '@/components/common';

interface DonutChartProps {
  percentage: number;
  color: string;
  size?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  percentage,
  color,
  size = 120,
}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);

  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (percentage / 100) * circumference;

  return (
    <View style={[styles.container, {width: size, height: size}]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.colors.surfaceVariant}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.textContainer}>
        <RNText style={styles.percentageText}>{Math.round(percentage)}%</RNText>
        <RNText style={styles.labelText}>Complete</RNText>
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    textContainer: {
      position: 'absolute',
      alignItems: 'center',
    },
    percentageText: {
      color: theme.colors.text,
      fontSize: 28,
      fontWeight: '800',
    },
    labelText: {
      color: theme.colors.textSecondary,
      fontSize: 11,
    },
  });
