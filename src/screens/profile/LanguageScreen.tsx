/**
 * WorkSync Pro - Language Selection Screen
 * Change application language
 */

import React, {useMemo} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {Card, Divider, RNText} from '@/components';

const LANGUAGES = [
  {code: 'en', name: 'language.english', flag: '🇺🇸'},
  {code: 'es', name: 'language.spanish', flag: '🇪🇸'},
  {code: 'fr', name: 'language.french', flag: '🇫🇷'},
  {code: 'de', name: 'language.german', flag: '🇩🇪'},
  {code: 'it', name: 'language.italian', flag: '🇮🇹'},
  {code: 'pt', name: 'language.portuguese', flag: '🇵🇹'},
  {code: 'zh', name: 'language.chinese', flag: '🇨🇳'},
  {code: 'ja', name: 'language.japanese', flag: '🇯🇵'},
];

export const LanguageScreen: React.FC = () => {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {t, i18n} = useTranslation();

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <RNText style={styles.title}>{t('language.title')}</RNText>
          <RNText style={styles.subtitle}>{t('language.subtitle')}</RNText>
        </View>

        <Card padding={0}>
          {LANGUAGES.map((lang, index) => (
            <React.Fragment key={lang.code}>
              <TouchableOpacity
                style={styles.langItem}
                onPress={() => handleSelect(lang.code)}
                activeOpacity={0.6}>
                <View style={styles.langLeft}>
                  <RNText style={styles.flag}>{lang.flag}</RNText>
                  <RNText style={styles.langName}>{t(lang.name)}</RNText>
                </View>
                {i18n.language.startsWith(lang.code) && (
                  <RNText style={styles.checkIcon}>✓</RNText>
                )}
              </TouchableOpacity>
              {index < LANGUAGES.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      padding: theme.spacing.base,
      paddingBottom: 40,
    },
    header: {
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    langItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
    },
    langLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    flag: {
      fontSize: 20,
    },
    langName: {
      fontSize: 16,
      color: theme.colors.text,
      fontWeight: '500',
    },
    checkIcon: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.primary,
    },
  });
