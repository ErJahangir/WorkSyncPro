/**
 * WorkSync Pro - About Screen
 * Application information and credits
 */

import React, {useMemo} from 'react';
import {View, StyleSheet, ScrollView, Image, Linking} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {Card, Divider, Button} from '@/components';
import {RNText} from '@/components/common';

export const AboutScreen: React.FC = () => {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {t} = useTranslation();

  const handleLink = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <RNText style={styles.logoEmoji}>🚀</RNText>
          </View>
          <RNText style={styles.appName}>WorkSync Pro</RNText>
          <RNText style={styles.version}>
            {t('profile.about.version', {version: '1.0.0', build: '102'})}
          </RNText>
        </View>

        <Card style={styles.descriptionCard}>
          <RNText style={styles.descriptionText}>
            {t('profile.about.description')}
          </RNText>
        </Card>

        <View style={styles.section}>
          <RNText style={styles.sectionTitle}>{t('profile.about.company')}</RNText>
          <Card padding={0}>
            <View style={styles.infoRow}>
              <RNText style={styles.infoLabel}>{t('profile.about.developer')}</RNText>
              <RNText style={styles.infoValue}>{t('profile.about.developerName')}</RNText>
            </View>
            <Divider />
            <View style={styles.infoRow}>
              <RNText style={styles.infoLabel}>{t('profile.about.website')}</RNText>
              <RNText
                style={[styles.infoValue, styles.link]}
                onPress={() => handleLink('https://worksyncpro.com')}>
                worksyncpro.com
              </RNText>
            </View>
            <Divider />
            <View style={styles.infoRow}>
              <RNText style={styles.infoLabel}>{t('profile.about.support')}</RNText>
              <RNText
                style={[styles.infoValue, styles.link]}
                onPress={() => handleLink('mailto:support@worksyncpro.com')}>
                support@worksyncpro.com
              </RNText>
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <RNText style={styles.sectionTitle}>{t('profile.about.followUs')}</RNText>
          <View style={styles.socialRow}>
            <Button
              title="Twitter"
              onPress={() => handleLink('https://twitter.com/worksyncpro')}
              variant="outline"
              size="sm"
              style={styles.socialBtn}
            />
            <Button
              title="LinkedIn"
              onPress={() => handleLink('https://linkedin.com/company/worksyncpro')}
              variant="outline"
              size="sm"
              style={styles.socialBtn}
            />
            <Button
              title="GitHub"
              onPress={() => handleLink('https://github.com/worksyncpro')}
              variant="outline"
              size="sm"
              style={styles.socialBtn}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <RNText style={styles.copyright}>
            {t('profile.about.copyright')}
          </RNText>
        </View>
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
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 30,
    },
    logoContainer: {
      width: 80,
      height: 80,
      borderRadius: 20,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      shadowColor: theme.colors.primary,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    logoEmoji: {
      fontSize: 40,
    },
    appName: {
      fontSize: 24,
      fontWeight: '800',
      color: theme.colors.text,
    },
    version: {
      fontSize: 14,
      color: theme.colors.textTertiary,
      marginTop: 4,
    },
    descriptionCard: {
      padding: 20,
    },
    descriptionText: {
      fontSize: 15,
      color: theme.colors.textSecondary,
      lineHeight: 22,
      textAlign: 'center',
    },
    section: {
      marginTop: 30,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.textTertiary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 10,
      marginLeft: 4,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 16,
    },
    infoLabel: {
      fontSize: 15,
      color: theme.colors.textSecondary,
    },
    infoValue: {
      fontSize: 15,
      color: theme.colors.text,
      fontWeight: '500',
    },
    link: {
      color: theme.colors.primary,
    },
    socialRow: {
      flexDirection: 'row',
      gap: 10,
    },
    socialBtn: {
      flex: 1,
    },
    footer: {
      marginTop: 50,
      alignItems: 'center',
    },
    copyright: {
      fontSize: 12,
      color: theme.colors.textTertiary,
      textAlign: 'center',
    },
  });
