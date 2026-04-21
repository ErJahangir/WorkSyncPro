/**
 * WorkSync Pro - Design Tokens
 * Central source of truth for all visual styling
 */

export const palette = {
  // Brand
  indigo50: '#EEF2FF',
  indigo100: '#E0E7FF',
  indigo500: '#6366F1',
  indigo600: '#4F46E5',
  indigo700: '#4338CA',

  // Accents
  violet500: '#8B5CF6',
  emerald400: '#34D399',
  emerald500: '#10B981',
  amber400: '#FBBF24',
  amber500: '#F59E0B',
  rose400: '#FB7185',
  rose500: '#F43F5E',
  sky400: '#38BDF8',
  sky500: '#0EA5E9',

  // Neutrals
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  gray950: '#030712',

  // Dark mode surfaces
  dark100: '#1E1E2E',
  dark200: '#181825',
  dark300: '#11111B',
  dark400: '#0D0D17',
};

export type ColorPalette = typeof palette;

export const lightColors = {
  primary: palette.indigo600,
  primaryLight: palette.indigo50,
  primaryDark: palette.indigo700,
  accent: palette.violet500,

  background: palette.gray50,
  surface: palette.white,
  surfaceVariant: palette.gray100,
  card: palette.white,

  text: palette.gray900,
  textSecondary: palette.gray500,
  textTertiary: palette.gray400,
  textInverse: palette.white,

  border: palette.gray200,
  borderLight: palette.gray100,
  divider: palette.gray200,

  success: palette.emerald500,
  successLight: '#D1FAE5',
  warning: palette.amber500,
  warningLight: '#FEF3C7',
  error: palette.rose500,
  errorLight: '#FFE4E6',
  info: palette.sky500,
  infoLight: '#E0F2FE',

  // Priority colors
  priorityLow: palette.emerald500,
  priorityMedium: palette.amber500,
  priorityHigh: palette.rose500,

  // Status colors
  statusTodo: palette.sky500,
  statusInProgress: palette.amber500,
  statusCompleted: palette.emerald500,

  overlay: 'rgba(0,0,0,0.5)',
  shadow: 'rgba(0,0,0,0.08)',

  // Tab bar
  tabBarBackground: palette.white,
  tabBarActive: palette.indigo600,
  tabBarInactive: palette.gray400,
};

export const darkColors: typeof lightColors = {
  primary: palette.indigo500,
  primaryLight: '#2D2B55',
  primaryDark: palette.indigo700,
  accent: palette.violet500,

  background: palette.dark300,
  surface: palette.dark100,
  surfaceVariant: palette.dark200,
  card: palette.dark100,

  text: palette.gray50,
  textSecondary: palette.gray400,
  textTertiary: palette.gray600,
  textInverse: palette.gray900,

  border: '#2A2A3E',
  borderLight: '#1E1E2E',
  divider: '#2A2A3E',

  success: palette.emerald400,
  successLight: '#064E3B',
  warning: palette.amber400,
  warningLight: '#78350F',
  error: palette.rose400,
  errorLight: '#881337',
  info: palette.sky400,
  infoLight: '#075985',

  priorityLow: palette.emerald400,
  priorityMedium: palette.amber400,
  priorityHigh: palette.rose400,

  statusTodo: palette.sky400,
  statusInProgress: palette.amber400,
  statusCompleted: palette.emerald400,

  overlay: 'rgba(0,0,0,0.7)',
  shadow: 'rgba(0,0,0,0.3)',

  tabBarBackground: palette.dark100,
  tabBarActive: palette.indigo500,
  tabBarInactive: palette.gray600,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
} as const;

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 11,
    sm: 12,
    base: 14,
    md: 15,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
    '5xl': 32,
    '6xl': 36,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
    extraBold: '800' as const,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const borderRadius = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 10,
  },
};

export type Theme = {
  colors: typeof lightColors;
  spacing: typeof spacing;
  typography: typeof typography;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  isDark: boolean;
};

export const lightTheme: Theme = {
  colors: lightColors,
  spacing,
  typography,
  borderRadius,
  shadows,
  isDark: false,
};

export const darkTheme: Theme = {
  colors: darkColors,
  spacing,
  typography,
  borderRadius,
  shadows,
  isDark: true,
};
