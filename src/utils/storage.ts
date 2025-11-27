/**
 * Storage utility functions for CV Generator
 * Requirements: 1.1, 1.2
 */

/**
 * Saves data to localStorage
 * Requirement 1.1: Persist data to Local Storage
 * 
 * @param key - The storage key
 * @param data - The data to store
 * @returns true if successful, false otherwise
 */
export const save = (key: string, data: unknown): boolean => {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    return false;
  }
};

/**
 * Loads data from localStorage
 * Requirement 1.2: Load data from Local Storage
 * 
 * @param key - The storage key
 * @param defaultValue - The default value if key doesn't exist or parsing fails
 * @returns The parsed data or default value
 */
export const load = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Removes data from localStorage
 * 
 * @param key - The storage key
 * @returns true if successful, false otherwise
 */
export const remove = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
    return false;
  }
};

/**
 * Checks if localStorage is available
 * 
 * @returns true if localStorage is available, false otherwise
 */
export const isAvailable = (): boolean => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

/**
 * Storage utility object for easy access
 */
export const storage = {
  save,
  load,
  remove,
  isAvailable,
};
