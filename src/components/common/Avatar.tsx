import React from 'react';
import {Image, StyleSheet, View, ViewStyle} from 'react-native';
import RNText from './RNText';

interface AvatarProps {
  name: string;
  uri?: string;
  size?: number;
  style?: ViewStyle;
  showOnlineIndicator?: boolean;
  isOnline?: boolean;
}

const AVATAR_COLORS = [
  '#6366F1',
  '#8B5CF6',
  '#EC4899',
  '#EF4444',
  '#F59E0B',
  '#10B981',
  '#3B82F6',
  '#14B8A6',
];

const getAvatarColor = (name: string = ''): string => {
  const safeName = name || 'User';
  let hash = 0;
  for (let i = 0; i < safeName.length; i++) {
    hash = safeName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

export const Avatar: React.FC<AvatarProps> = ({
  name,
  uri,
  size = 40,
  style,
  showOnlineIndicator,
  isOnline,
}) => {
  const initialName = name || 'User';
  const initials = initialName
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const bgColor = getAvatarColor(initialName);
  const fontSize = size * 0.38;

  return (
    <View style={[{width: size, height: size}, style]}>
      {uri ? (
        <Image
          source={{uri}}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
          }}
        />
      ) : (
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: bgColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <RNText
            style={{
              color: '#fff',
              fontSize,
              fontWeight: '700',
            }}>
            {initials}
          </RNText>
        </View>
      )}
      {showOnlineIndicator && (
        <View
          style={[
            styles.onlineIndicator,
            {
              backgroundColor: isOnline ? '#10B981' : '#9CA3AF',
              width: size * 0.28,
              height: size * 0.28,
              borderRadius: size * 0.14,
              bottom: 0,
              right: 0,
              borderWidth: 2,
              borderColor: '#fff',
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  onlineIndicator: {
    position: 'absolute',
  },
});
