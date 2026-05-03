import {useTheme} from '@/theme';
import React from 'react';
import {View} from 'react-native';
import RNText from './RNText';

export const NetworkBanner: React.FC = () => {
  const {theme} = useTheme();
  const {isNetworkAvailable} = {isNetworkAvailable: true}; // from store in real usage

  if (isNetworkAvailable) return null;

  return (
    <View
      style={{
        backgroundColor: theme.colors.error,
        padding: 8,
        alignItems: 'center',
      }}>
      <RNText style={{color: '#fff', fontSize: 12, fontWeight: '600'}}>
        📡 No internet connection — showing cached data
      </RNText>
    </View>
  );
};
