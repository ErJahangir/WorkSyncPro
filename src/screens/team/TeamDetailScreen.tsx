/**
 * WorkSync Pro - Team Detail Screen
 * Displays detailed information about a team
 */

import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {RNText} from '@/components/common';

export const TeamDetailScreen: React.FC = () => {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <RNText style={styles.title}>{t('teamDetail.title')}</RNText>
      <RNText style={styles.subtitle}>{t('teamDetail.comingSoon')}</RNText>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
    },
    title: {
      color: theme.colors.text,
      fontSize: 24,
      fontWeight: '700',
    },
    subtitle: {
      color: theme.colors.textSecondary,
      fontSize: 16,
      marginTop: 8,
    },
  });
