import {hp, wp} from '@/theme';
import React, {useEffect, useRef} from 'react';
import {
  StyleSheet,
  Animated,
  Dimensions,
  Image,
  useColorScheme,
} from 'react-native';

const {width, height} = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationEnd: () => void;
  isLoading?: boolean; // If true, it won't start the exit animation yet
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onAnimationEnd,
  isLoading = false,
}) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const splashImg = require('../../../assets/images/splash_screen.png');

  useEffect(() => {
    // If not loading anymore, trigger the exit animation
    if (!isLoading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onAnimationEnd();
      });
    }
  }, [isLoading, fadeAnim, scaleAnim, onAnimationEnd]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF',
        },
      ]}>
      <Animated.Image
        source={splashImg}
        resizeMode="cover"
        style={[
          styles.image,
          {
            transform: [{scale: scaleAnim}],
          },
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: wp(100),
    height: hp(100),
  },
});
