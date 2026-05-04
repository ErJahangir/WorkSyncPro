/**
 * WorkSync Pro - Date Utilities
 * Date formatting, relative time, deadline helpers
 */

import {
  format,
  formatDistanceToNow,
  isPast,
  isToday,
  isTomorrow,
  differenceInDays,
} from 'date-fns';
import {enUS, es} from 'date-fns/locale';
import i18n from '@/language/i18n';

/**
 * Get the current date-fns locale based on i18n language
 */
const getLocale = () => {
  const lang = i18n.language || 'en';
  return lang.startsWith('es') ? es : enUS;
};

/**
 * Format a date as relative time (e.g., "2 hours ago", "yesterday")
 */
export const formatRelativeTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: getLocale(),
    });
  } catch {
    return i18n.t('dates.unknown');
  }
};

/**
 * Format deadline in a user-friendly way
 */
export const formatDeadline = (dateString: string): string => {
  try {
    const date = new Date(dateString);

    if (isToday(date)) {
      return i18n.t('dates.today');
    }
    if (isTomorrow(date)) {
      return i18n.t('dates.tomorrow');
    }

    const daysUntil = differenceInDays(date, new Date());
    if (daysUntil > 0 && daysUntil <= 7) {
      return i18n.t('dates.inDays', {count: daysUntil});
    }

    return format(date, 'MMM d, yyyy', {locale: getLocale()});
  } catch {
    return i18n.t('dates.unknown');
  }
};

/**
 * Check if a deadline is overdue
 */
export const isOverdue = (dateString: string): boolean => {
  try {
    return isPast(new Date(dateString)) && !isToday(new Date(dateString));
  } catch {
    return false;
  }
};

/**
 * Format date for display (e.g., "Jan 15, 2024")
 */
export const formatDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'MMM d, yyyy', {locale: getLocale()});
  } catch {
    return i18n.t('dates.invalidDate');
  }
};

/**
 * Format date with time (e.g., "Jan 15, 2024 at 3:30 PM")
 */
export const formatDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const datePart = format(date, 'MMM d, yyyy', {locale: getLocale()});
    const timePart = format(date, 'h:mm a', {locale: getLocale()});
    return `${datePart} ${i18n.t('dates.at')} ${timePart}`;
  } catch {
    return i18n.t('dates.invalidDate');
  }
};

/**
 * Get days remaining until a deadline
 */
export const getDaysRemaining = (dateString: string): number => {
  try {
    return differenceInDays(new Date(dateString), new Date());
  } catch {
    return 0;
  }
};

/**
 * Format a Date object as a time string for UI (e.g., "09:00 AM")
 */
export const formatTime = (date: Date): string => {
  try {
    return format(date, 'hh:mm a', {locale: getLocale()});
  } catch {
    return '--:--';
  }
};

/**
 * Format a Date object for database storage (e.g., "09:00:00")
 */
export const formatTimeForDB = (date: Date): string => {
  try {
    return format(date, 'HH:mm:ss');
  } catch {
    return '00:00:00';
  }
};
