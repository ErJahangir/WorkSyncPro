import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {RNText} from '@/components/common';

interface BarChartProps {
  data: Array<{label: string; value: number; color: string}>;
  maxValue: number;
}

export const BarChart: React.FC<BarChartProps> = ({data, maxValue}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.chartArea}>
        {data.map((item, i) => {
          const heightPercent =
            maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          return (
            <View key={i} style={styles.barContainer}>
              <View style={styles.valueContainer}>
                {item.value > 0 && (
                  <RNText style={styles.valueText}>{item.value}</RNText>
                )}
              </View>
              <View
                style={[
                  styles.bar,
                  {
                    height: `${heightPercent}%`,
                    backgroundColor: item.color,
                    minHeight: item.value > 0 ? 4 : 0,
                  },
                ]}
              />
              <RNText style={styles.label}>{item.label}</RNText>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      height: 200,
      justifyContent: 'flex-end',
    },
    chartArea: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-around',
      height: 180,
      gap: 4,
    },
    barContainer: {
      alignItems: 'center',
      flex: 1,
    },
    valueContainer: {
      alignItems: 'center',
      marginBottom: 4,
    },
    valueText: {
      color: theme.colors.textSecondary,
      fontSize: 10,
      fontWeight: '600',
    },
    bar: {
      width: '90%',
      borderRadius: 6,
    },
    label: {
      color: theme.colors.textTertiary,
      fontSize: 10,
      marginTop: 6,
      fontWeight: '500',
    },
  });
