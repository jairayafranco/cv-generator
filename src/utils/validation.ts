/**
 * Validation utility functions for CV Generator
 * Requirements: 2.2, 2.3, 2.4, 2.5
 */

/**
 * Validates email format
 * Requirement 2.2: Email validation
 */
export const validateEmail = (value: string): string | null => {
  if (!value || value.trim() === '') {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value) ? null : 'Invalid email format';
};

/**
 * Validates URL format
 * Requirement 2.3: URL validation
 */
export const validateUrl = (value: string): string | null => {
  if (!value || value.trim() === '') {
    return null; // URLs are typically optional
  }
  try {
    new URL(value.startsWith('http') ? value : `https://${value}`);
    return null;
  } catch {
    return 'Invalid URL format';
  }
};

/**
 * Validates date range
 * Requirement 2.4: Date range validation
 */
export const validateDateRange = (startDate: string, endDate: string): string | null => {
  if (!startDate || !endDate) {
    return null; // If either date is missing, skip validation
  }
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 'Invalid date format';
  }
  
  if (start > end) {
    return 'End date must be after start date';
  }
  
  return null;
};

/**
 * Validates file size
 * Requirement 2.5: File size validation
 */
export const validateFileSize = (file: File | null, maxSizeMB: number = 5): string | null => {
  if (!file) {
    return 'File is required';
  }
  
  const maxBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxBytes ? null : `File size must be less than ${maxSizeMB}MB`;
};

/**
 * Validates image file type
 * Requirement 2.5: Image type validation
 */
export const validateImageType = (file: File | null): string | null => {
  if (!file) {
    return 'File is required';
  }
  
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type) ? null : 'File must be an image (JPEG, PNG, GIF, or WebP)';
};

/**
 * Combined image validation (type and size)
 * Requirement 2.5: Complete image validation
 */
export const validateImage = (file: File | null, maxSizeMB: number = 5): string | null => {
  const typeError = validateImageType(file);
  if (typeError) return typeError;
  
  const sizeError = validateFileSize(file, maxSizeMB);
  if (sizeError) return sizeError;
  
  return null;
};
