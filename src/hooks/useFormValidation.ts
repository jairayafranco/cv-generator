import { useState, useCallback, useRef } from 'react';

/**
 * Form validation hook for CV Generator
 * Requirements: 2.1, 2.6, 2.7
 */

export interface ValidationRule {
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  custom?: (value: unknown, data?: Record<string, unknown>) => string | null;
}

export interface ValidationSchema {
  [field: string]: ValidationRule;
}

export interface UseFormValidationReturn {
  errors: Record<string, string>;
  validate: (field: string, value: unknown) => boolean;
  validateAll: (data: Record<string, unknown>) => boolean;
  clearError: (field: string) => void;
  clearAllErrors: () => void;
}

/**
 * Custom hook for form validation with debouncing support
 * 
 * @param schema - Validation schema defining rules for each field
 * @returns Validation methods and error state
 * 
 * Requirements:
 * - 2.1: Prevent submission with empty required fields
 * - 2.6: Display clear error messages
 * - 2.7: Remove errors in real-time as fields become valid
 */
export function useFormValidation(schema: ValidationSchema): UseFormValidationReturn {
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Validates a single field value against its schema rules
   * 
   * @param field - Field name to validate
   * @param value - Field value to validate
   * @returns true if valid, false if invalid
   */
  const validate = useCallback((field: string, value: unknown): boolean => {
    const rule = schema[field];
    
    if (!rule) {
      return true; // No validation rule defined
    }

    let errorMessage: string | null = null;

    // Check required
    if (rule.required) {
      if (value === undefined || value === null || value === '') {
        errorMessage = `${field} is required`;
      } else if (typeof value === 'string' && value.trim() === '') {
        errorMessage = `${field} is required`;
      }
    }

    // If required check failed, return early
    if (errorMessage) {
      setErrors(prev => ({ ...prev, [field]: errorMessage! }));
      return false;
    }

    // Skip other validations if value is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      return true;
    }

    // Check pattern
    if (rule.pattern && typeof value === 'string') {
      if (!rule.pattern.test(value)) {
        errorMessage = `${field} format is invalid`;
      }
    }

    // Check minLength
    if (rule.minLength && typeof value === 'string') {
      if (value.length < rule.minLength) {
        errorMessage = `${field} must be at least ${rule.minLength} characters`;
      }
    }

    // Check maxLength
    if (rule.maxLength && typeof value === 'string') {
      if (value.length > rule.maxLength) {
        errorMessage = `${field} must be at most ${rule.maxLength} characters`;
      }
    }

    // Check custom validation
    if (rule.custom && !errorMessage) {
      errorMessage = rule.custom(value);
    }

    // Update errors state
    if (errorMessage) {
      setErrors(prev => ({ ...prev, [field]: errorMessage! }));
      return false;
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      return true;
    }
  }, [schema]);

  /**
   * Validates all fields in the provided data object
   * 
   * @param data - Object containing all form field values
   * @returns true if all fields are valid, false if any field is invalid
   */
  const validateAll = useCallback((data: Record<string, unknown>): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Validate each field in the schema
    Object.keys(schema).forEach(field => {
      const rule = schema[field];
      const value = data[field];
      let errorMessage: string | null = null;

      // Check required
      if (rule.required) {
        if (value === undefined || value === null || value === '') {
          errorMessage = `${field} is required`;
        } else if (typeof value === 'string' && value.trim() === '') {
          errorMessage = `${field} is required`;
        }
      }

      // If required check failed, skip other validations
      if (errorMessage) {
        newErrors[field] = errorMessage;
        isValid = false;
        return;
      }

      // Skip other validations if value is empty and not required
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return;
      }

      // Check pattern
      if (rule.pattern && typeof value === 'string') {
        if (!rule.pattern.test(value)) {
          errorMessage = `${field} format is invalid`;
        }
      }

      // Check minLength
      if (rule.minLength && typeof value === 'string') {
        if (value.length < rule.minLength) {
          errorMessage = `${field} must be at least ${rule.minLength} characters`;
        }
      }

      // Check maxLength
      if (rule.maxLength && typeof value === 'string') {
        if (value.length > rule.maxLength) {
          errorMessage = `${field} must be at most ${rule.maxLength} characters`;
        }
      }

      // Check custom validation
      if (rule.custom && !errorMessage) {
        errorMessage = rule.custom(value, data);
      }

      if (errorMessage) {
        newErrors[field] = errorMessage;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [schema]);

  /**
   * Clears the error message for a specific field
   * 
   * @param field - Field name to clear error for
   */
  const clearError = useCallback((field: string): void => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  /**
   * Clears all error messages
   */
  const clearAllErrors = useCallback((): void => {
    setErrors({});
  }, []);

  return {
    errors,
    validate,
    validateAll,
    clearError,
    clearAllErrors,
  };
}

/**
 * Debounced validation wrapper
 * Delays validation execution by specified milliseconds
 * 
 * @param validateFn - Validation function to debounce
 * @param delay - Delay in milliseconds (default: 300ms per requirement 2.7)
 * @returns Debounced validation function
 */
export function useDebouncedValidation(
  validateFn: (field: string, value: unknown) => boolean,
  delay: number = 300
): (field: string, value: unknown) => void {
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});

  return useCallback((field: string, value: unknown) => {
    // Clear existing timer for this field
    if (debounceTimers.current[field]) {
      clearTimeout(debounceTimers.current[field]);
    }

    // Set new timer
    debounceTimers.current[field] = setTimeout(() => {
      validateFn(field, value);
      delete debounceTimers.current[field];
    }, delay);
  }, [validateFn, delay]);
}
