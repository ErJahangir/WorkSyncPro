/**
 * WorkSync Pro - Language Selection Screen
 * Change application language
 */

import React, {useState, useMemo} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {Card, Divider} from '@/components';
import {RNText} from '@/components/common';

const LANGUAGES = [
  {code: 'en', name: 'English', flag: '🇺🇸'},
  {code: 'es', name: 'Español', flag: '🇪🇸'},
  {code: 'fr', name: 'Français', flag: '🇫🇷'},
  {code: 'de', name: 'Deutsch', flag: '🇩🇪'},
  {code: 'it', name: 'Italiano', flag: '🇮🇹'},
  {code: 'pt', name: 'Português', flag: '🇵🇹'},
  {code: 'zh', name: '中文', flag: '🇨🇳'},
  {code: 'ja', name: '日本語', flag: '🇯🇵'},
];

export const LanguageScreen: React.FC = () => {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleSelect = (code: string) => {
    setSelectedLanguage(code);
    // In a real app, this would trigger an i18n change
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <RNText style={styles.title}>Language</RNText>
          <RNText style={styles.subtitle}>
            Select your preferred language for the application.
          </RNText>
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
                  <RNText style={styles.langName}>{lang.name}</RNText>
                </View>
                {selectedLanguage === lang.code && (
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
