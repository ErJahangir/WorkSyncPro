/**
 * WorkSync Pro - Onboarding Screen
 * Animated 3-step onboarding with swipe support
 */

import React, {useRef, useState} from 'react';
import {View, FlatList, TouchableOpacity, StyleSheet, Dimensions, Animated, ViewToken} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useTranslation} from 'react-i18next';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {useAppDispatch} from '@/hooks';
import {ONBOARDING_SLIDES, STORAGE_KEYS} from '@/constants';
import {setOnboardingDone} from '@/store/slices';
import {Button} from '@/components';
import {RNText} from '@/components/common';

const {width, height} = Dimensions.get('window');

export const OnboardingScreen: React.FC = () => {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const dispatch = useAppDispatch();
  const {t} = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleDone = async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_DONE, 'true');
    dispatch(setOnboardingDone());
  };

  const handleNext = () => {
    if (activeIndex < ONBOARDING_SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({index: activeIndex + 1});
    } else {
      handleDone();
    }
  };

  const handleSkip = () => handleDone();

  const onViewableItemsChanged = useRef(
    ({viewableItems}: {viewableItems: ViewToken[]}) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
  ).current;

  // Localized slides that combine constant IDs/icons with translated text
  const slides = ONBOARDING_SLIDES.map((slide, index) => {
    const translation = (t('auth.onboarding.slides', {returnObjects: true}) as any)[index];
    return {
      ...slide,
      title: translation.title,
      subtitle: translation.subtitle,
    };
  });

  return (
    <View style={styles.container}>
      {/* Skip button */}
      {activeIndex < slides.length - 1 && (
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <RNText style={styles.skipText}>{t('auth.onboarding.skip')}</RNText>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{viewAreaCoveragePercentThreshold: 50}}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false},
        )}
        renderItem={({item}) => (
          <View style={styles.slide}>
            {/* Illustration area */}
            <View style={styles.illustrationContainer}>
              <RNText style={styles.slideIcon}>{item.icon}</RNText>
              {/* Decorative circles */}
              <View style={styles.deco1} />
              <View style={styles.deco2} />
            </View>

            {/* Content */}
            <View style={styles.slideContent}>
              <RNText style={styles.slideTitle}>{item.title}</RNText>
              <RNText style={styles.slideSubtitle}>{item.subtitle}</RNText>
            </View>
          </View>
        )}
      />

      {/* Pagination dots */}
      <View style={styles.pagination}>
        {slides.map((_, i) => {
          const dotWidth = scrollX.interpolate({
            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });
          const dotOpacity = scrollX.interpolate({
            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity: dotOpacity,
                },
              ]}
            />
          );
        })}
      </View>

      {/* Bottom actions */}
      <View style={styles.bottomContainer}>
        <Button
          title={
            activeIndex === slides.length - 1
              ? t('auth.onboarding.getStarted')
              : t('auth.onboarding.next')
          }
          onPress={handleNext}
          fullWidth
          size="lg"
        />
        {activeIndex === slides.length - 1 && (
          <TouchableOpacity onPress={handleDone} style={styles.signInButton}>
            <RNText style={styles.signInText}>
              {t('auth.signup.haveAccount')}
              <RNText style={styles.signInHighlight}>{t('auth.signup.signIn')}</RNText>
            </RNText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    skipButton: {
      position: 'absolute',
      top: 56,
      right: 24,
      zIndex: 10,
      paddingVertical: 6,
      paddingHorizontal: 12,
    },
    skipText: {
      fontWeight: '500',
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.base,
    },
    slide: {
      width,
      flex: 1,
    },
    illustrationContainer: {
      height: height * 0.45,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: theme.colors.primaryLight,
    },
    slideIcon: {
      fontSize: 80,
      zIndex: 2,
    },
    deco1: {
      position: 'absolute',
      width: 240,
      height: 240,
      borderRadius: 120,
      borderWidth: 40,
      opacity: 0.5,
      borderColor: theme.colors.primary + '30',
    },
    deco2: {
      position: 'absolute',
      width: 340,
      height: 340,
      borderRadius: 170,
      borderWidth: 40,
      opacity: 0.3,
      borderColor: theme.colors.primary + '20',
    },
    slideContent: {
      paddingHorizontal: 32,
      paddingTop: 40,
      gap: 12,
    },
    slideTitle: {
      fontWeight: '800',
      lineHeight: 38,
      letterSpacing: -0.5,
      color: theme.colors.text,
      fontSize: theme.typography.fontSize['4xl'],
    },
    slideSubtitle: {
      lineHeight: 26,
      fontWeight: '400',
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.lg,
    },
    pagination: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      marginTop: 24,
      marginBottom: 8,
    },
    dot: {
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.primary,
    },
    bottomContainer: {
      paddingHorizontal: 24,
      paddingBottom: 48,
      paddingTop: 16,
    },
    signInButton: {marginTop: 12},
    signInText: {
      color: theme.colors.textSecondary,
      textAlign: 'center',
      fontSize: theme.typography.fontSize.base,
    },
    signInHighlight: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
  });
