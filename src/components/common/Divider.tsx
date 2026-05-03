import {useTheme} from '@/theme';
import React from 'react';
import {View, ViewStyle} from 'react-native';

export const Divider: React.FC<{style?: ViewStyle}> = ({style}) => {
  const {theme} = useTheme();
  return (
    <View
      style={[
        {height: 1, backgroundColor: theme.colors.divider, marginVertical: 4},
        style,
      ]}
    />
  );
};
