/**
 * WorkSync Pro - Input Component
 * Form input with label, error state, icons, and validation
 */

import React, {useState, forwardRef} from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import {useTheme} from '@/theme';
import RNText from './RNText';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  required?: boolean;
  showPasswordToggle?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      onRightIconPress,
      containerStyle,
      required,
      showPasswordToggle,
      secureTextEntry,
      ...rest
    },
    ref,
  ) => {
    const {theme} = useTheme();
    const {colors, borderRadius, spacing, typography} = theme;
    const [isFocused, setIsFocused] = useState(false);
    const [isSecure, setIsSecure] = useState(secureTextEntry);

    const borderColor = error
      ? colors.error
      : isFocused
      ? colors.primary
      : colors.border;

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <View style={styles.labelRow}>
            <RNText
              style={[
                styles.label,
                {color: colors.textSecondary, fontSize: typography.fontSize.sm},
              ]}>
              {label}
              {required && <RNText style={{color: colors.error}}> *</RNText>}
            </RNText>
          </View>
        )}

        <View
          style={[
            styles.inputWrapper,
            {
              borderColor,
              borderRadius: borderRadius.lg,
              backgroundColor: colors.surface,
              borderWidth: isFocused ? 2 : 1.5,
            },
          ]}>
          {leftIcon && (
            <View style={[styles.iconContainer, {paddingLeft: spacing.md}]}>
              {leftIcon}
            </View>
          )}

          <TextInput
            ref={ref}
            style={[
              styles.input,
              {
                color: colors.text,
                fontSize: typography.fontSize.base,
                paddingHorizontal: leftIcon ? spacing.sm : spacing.base,
                paddingRight:
                  rightIcon || showPasswordToggle ? spacing.sm : spacing.base,
              },
            ]}
            placeholderTextColor={colors.textTertiary}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            secureTextEntry={showPasswordToggle ? isSecure : secureTextEntry}
            {...rest}
          />

          {showPasswordToggle && (
            <TouchableOpacity
              onPress={() => setIsSecure(v => !v)}
              style={[styles.iconContainer, {paddingRight: spacing.md}]}>
              <RNText style={{fontSize: 18}}>{isSecure ? '👁️' : '🙈'}</RNText>
            </TouchableOpacity>
          )}

          {rightIcon && !showPasswordToggle && (
            <TouchableOpacity
              onPress={onRightIconPress}
              style={[styles.iconContainer, {paddingRight: spacing.md}]}>
              {rightIcon}
            </TouchableOpacity>
          )}
        </View>

        {error ? (
          <RNText
            style={[
              styles.helperText,
              {color: colors.error, fontSize: typography.fontSize.xs},
            ]}>
            ⚠️ {error}
          </RNText>
        ) : hint ? (
          <RNText
            style={[
              styles.helperText,
              {color: colors.textTertiary, fontSize: typography.fontSize.xs},
            ]}>
            {hint}
          </RNText>
        ) : null}
      </View>
    );
  },
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelRow: {
    marginBottom: 6,
  },
  label: {
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    overflow: 'hidden',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    includeFontPadding: false,
  },
  helperText: {
    marginTop: 4,
    marginLeft: 2,
  },
});
