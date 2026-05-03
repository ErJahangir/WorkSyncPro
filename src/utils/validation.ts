/**
 * WorkSync Pro - Validation Utilities
 * Common validation helper functions using Yup
 */

import * as yup from 'yup';
// @ts-ignore
import debounce from 'lodash.debounce';

// ─── Reusable Schemas ─────────────────────────────────────

/**
 * Basic email schema
 */
export const emailSchema = yup
  .string()
  .email('Invalid email address')
  .required('Email is required');

/**
 * Strong password schema
 */
export const passwordSchema = yup
  .string()
  .min(8, 'Password must be at least 8 characters')
  .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
  .matches(/[0-9]/, 'Password must contain at least one number')
  .required('Password is required');

/**
 * Full name schema
 */
export const nameSchema = yup
  .string()
  .min(2, 'Name is too short')
  .required('Full name is required');

/**
 * URL schema
 */
export const urlSchema = yup.string().url('Invalid URL format');

// ─── Legacy Functions (Refactored to use Yup) ──────────────

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  return emailSchema.isValidSync(email);
};

/**
 * Validate password strength
 * Returns: {isValid, message}
 */
export const validatePassword = (
  password: string,
): {isValid: boolean; message: string} => {
  try {
    passwordSchema.validateSync(password);
    return {isValid: true, message: 'Password is strong'};
  } catch (error: any) {
    return {isValid: false, message: error.message};
  }
};

/**
 * Validate URL
 */
export const isValidUrl = (url: string): boolean => {
  return urlSchema.isValidSync(url);
};

/**
 * Check if string contains only alphanumeric characters
 */
export const isAlphanumeric = (str: string): boolean => {
  return yup
    .string()
    .matches(/^[a-zA-Z0-9]+$/)
    .isValidSync(str);
};

// ─── Other Utility Functions ──────────────────────────────

/**
 * Sanitize user input (basic XSS prevention)
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate file size
 */
export const isValidFileSize = (
  sizeInBytes: number,
  maxSizeInMB: number,
): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return sizeInBytes <= maxSizeInBytes;
};

/**
 * Validate file type
 */
export const isValidFileType = (
  fileType: string,
  allowedTypes: string[],
): boolean => {
  return allowedTypes.includes(fileType);
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Extract mentions from text (@username)
 */
export const extractMentions = (text: string): string[] => {
  const mentionRegex = /@(\w+)/g;
  const mentions: string[] = [];
  let match;
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }
  return mentions;
};

/**
 * Generate random ID
 */
export const generateRandomId = (length: number = 8): string => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Debounce function
 */
export {debounce};

/**
 * Throttle function
 */
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number,
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
