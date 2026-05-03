/**
 * WorkSync Pro - Storage Utilities
 * Helper functions for AsyncStorage operations
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Save data to AsyncStorage
 */
export const saveData = async <T>(key: string, value: T): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error saving data:', error);
    throw error;
  }
};

/**
 * Get data from AsyncStorage
 */
export const getData = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error getting data:', error);
    return null;
  }
};

/**
 * Remove data from AsyncStorage
 */
export const removeData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing data:', error);
    throw error;
  }
};

/**
 * Clear all data from AsyncStorage
 */
export const clearAll = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
};

/**
 * Get multiple items from AsyncStorage
 */
export const getMultiple = async (
  keys: string[],
): Promise<Record<string, unknown>> => {
  try {
    const values = await AsyncStorage.multiGet(keys);
    const result: Record<string, unknown> = {};
    values.forEach(([key, value]) => {
      if (value) {
        result[key] = JSON.parse(value);
      }
    });
    return result;
  } catch (error) {
    console.error('Error getting multiple items:', error);
    return {};
  }
};

/**
 * Save multiple items to AsyncStorage
 */
export const setMultiple = async (
  items: Array<[string, unknown]>,
): Promise<void> => {
  try {
    const pairs = items.map(
      ([key, value]) => [key, JSON.stringify(value)] as [string, string],
    );
    await AsyncStorage.multiSet(pairs);
  } catch (error) {
    console.error('Error setting multiple items:', error);
    throw error;
  }
};

/**
 * Check if key exists in AsyncStorage
 */
export const hasKey = async (key: string): Promise<boolean> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return keys.includes(key);
  } catch (error) {
    console.error('Error checking key:', error);
    return false;
  }
};

/**
 * Get all keys from AsyncStorage
 */
export const getAllKeys = async (): Promise<string[]> => {
  try {
    const res = await AsyncStorage.getAllKeys();
    return res ?? [];
  } catch (error) {
    console.error('Error getting all keys:', error);
    return [];
  }
};

/**
 * Merge existing value with new value
 */
export const mergeData = async <T extends object>(
  key: string,
  value: Partial<T>,
): Promise<void> => {
  try {
    const existing = await getData<T>(key);
    const merged = {...existing, ...value};
    await saveData(key, merged);
  } catch (error) {
    console.error('Error merging data:', error);
    throw error;
  }
};
