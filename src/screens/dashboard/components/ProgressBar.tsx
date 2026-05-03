import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';

interface ProgressBarProps {
  progress: number;
  color: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({progress, color}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.progressTrack}>
      <View
        style={[
          styles.progressFill,
          {width: `${Math.min(progress, 100)}%`, backgroundColor: color},
        ]}
      />
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    progressTrack: {
      height: 8,
      borderRadius: 4,
      overflow: 'hidden',
      backgroundColor: theme.colors.surfaceVariant,
    },
    progressFill: {
      height: '100%',
      borderRadius: 4,
    },
  });
