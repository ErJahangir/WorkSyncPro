/**
 * WorkSync Pro - Splash Screen
 * Animated logo shown during app initialization
 */

import React, {useEffect, useRef} from 'react';
import {View, Text, Animated, StyleSheet, Dimensions} from 'react-native';
import {useTheme} from '@theme/ThemeProvider';

const {width} = Dimensions.get('window');

export const SplashScreen: React.FC = () => {
  const {theme} = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const taglineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(taglineAnim, {
        toValue: 1,
        duration: 1000,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, taglineAnim]);

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* Background gradient circles */}
      <View
        style={[styles.bgCircle1, {backgroundColor: theme.colors.primaryLight}]}
      />
      <View
        style={[styles.bgCircle2, {backgroundColor: theme.colors.primaryLight}]}
      />

      <Animated.View
        style={[
          styles.logoContainer,
          {opacity: fadeAnim, transform: [{scale: scaleAnim}]},
        ]}>
        {/* Logo Icon */}
        <View
          style={[styles.logoIcon, {backgroundColor: theme.colors.primary}]}>
          <Text style={styles.logoEmoji}>⚡</Text>
        </View>

        {/* App Name */}
        <Text style={[styles.appName, {color: theme.colors.text}]}>
          WorkSync <Text style={{color: theme.colors.primary}}>Pro</Text>
        </Text>
      </Animated.View>

      {/* Tagline */}
      <Animated.Text
        style={[
          styles.tagline,
          {
            color: theme.colors.textSecondary,
            opacity: taglineAnim,
          },
        ]}>
        Team productivity, redefined
      </Animated.Text>

      {/* Loading dots */}
      <View style={styles.dotsContainer}>
        {[0, 1, 2].map(i => (
          <View
            key={i}
            style={[
              styles.dot,
              {backgroundColor: theme.colors.primary, opacity: 0.4 + i * 0.2},
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgCircle1: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    top: -80,
    right: -100,
    opacity: 0.4,
  },
  bgCircle2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    bottom: -60,
    left: -80,
    opacity: 0.3,
  },
  logoContainer: {
    alignItems: 'center',
    gap: 16,
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  logoEmoji: {
    fontSize: 42,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 16,
    marginTop: 8,
    letterSpacing: 0.3,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 6,
    position: 'absolute',
    bottom: 60,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
