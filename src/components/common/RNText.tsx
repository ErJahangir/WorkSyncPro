import React from 'react';
import {Text, TextProps, StyleSheet, TextStyle} from 'react-native';

export type FontVariant = 'Inter' | 'Roboto' | 'Poppins';
export type FontWeight = 'Regular' | 'Medium' | 'Bold';

interface RNTextProps extends TextProps {
  variant?: FontVariant;
  weight?: FontWeight;
  color?: string;
  size?: number;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

const RNText: React.FC<RNTextProps> = ({
  style,
  variant = 'Inter',
  weight = 'Regular',
  color,
  size,
  align,
  children,
  ...props
}) => {
  const fontFamily = `${variant}-${weight}`;

  const customStyle: TextStyle = {
    fontFamily,
    ...(color && {color}),
    ...(size && {fontSize: size}),
    ...(align && {textAlign: align}),
  };

  return (
    <Text style={[customStyle, style]} {...props}>
      {children}
    </Text>
  );
};

export default RNText;
