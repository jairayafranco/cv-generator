import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFormValidation, useDebouncedValidation, ValidationSchema } from './useFormValidation';

describe('useFormValidation', () => {
  describe('validate - single field validation', () => {
    it('should validate required fields', () => {
      const schema: ValidationSchema = {
        name: { required: true },
      };

      const { result } = renderHook(() => useFormValidation(schema));

      act(() => {
        result.current.validate('name', '');
      });

      expect(result.current.errors.name).toBe('name is required');
    });

    it('should pass validation for valid required field', () => {
      const schema: ValidationSchema = {
        name: { required: true },
      };

      const { result } = renderHook(() => useFormValidation(schema));

      act(() => {
        result.current.validate('name', 'John Doe');
      });

      expect(result.current.errors.name).toBeUndefined();
    });

    it('should validate pattern matching', () => {
      const schema: ValidationSchema = {
        email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      };

      const { result } = renderHook(() => useFormValidation(schema));

      act(() => {
        result.current.validate('email', 'invalid-email');
      });

      expect(result.current.errors.email).toBe('email format is invalid');
    });

    it('should pass validation for valid pattern', () => {
      const schema: ValidationSchema = {
        email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      };

      const { result } = renderHook(() => useFormValidation(schema));

      act(() => {
        result.current.validate('email', 'test@example.com');
      });

      expect(result.current.errors.email).toBeUndefined();
    });

    it('should validate minLength', () => {
      const schema: ValidationSchema = {
        password: { minLength: 8 },
      };

      const { result } = renderHook(() => useFormValidation(schema));

      act(() => {
        result.current.validate('password', 'short');
      });

      expect(result.current.errors.password).toBe('password must be at least 8 characters');
    });

    it('should validate maxLength', () => {
      const schema: ValidationSchema = {
        bio: { maxLength: 100 },
      };

      const { result } = renderHook(() => useFormValidation(schema));

      act(() => {
        result.current.validate('bio', 'a'.repeat(101));
      });

      expect(result.current.errors.bio).toBe('bio must be at most 100 characters');
    });

    it('should validate custom validation function', () => {
      const schema: ValidationSchema = {
        age: {
          custom: (value) => {
            const num = parseInt(value as string);
            if (isNaN(num) || num < 18) {
              return 'Must be 18 or older';
            }
            return null;
          },
        },
      };

      const { result } = renderHook(() => useFormValidation(schema));

      act(() => {
        result.current.validate('age', '15');
      });

      expect(result.current.errors.age).toBe('Must be 18 or older');
    });

    it('should clear error when field becomes valid', () => {
      const schema: ValidationSchema = {
        name: { required: true },
      };

      const { result } = renderHook(() => useFormValidation(schema));

      // First, make it invalid
      act(() => {
        result.current.validate('name', '');
      });
      expect(result.current.errors.name).toBe('name is required');

      // Then, make it valid
      act(() => {
        result.current.validate('name', 'John');
      });
      expect(result.current.errors.name).toBeUndefined();
    });
  });

  describe('validateAll - complete form validation', () => {
    it('should validate all fields and return false if any invalid', () => {
      const schema: ValidationSchema = {
        name: { required: true },
        email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      };

      const { result } = renderHook(() => useFormValidation(schema));

      let isValid: boolean = true;
      act(() => {
        isValid = result.current.validateAll({
          name: '',
          email: 'invalid',
        });
      });

      expect(isValid).toBe(false);
      expect(result.current.errors.name).toBe('name is required');
      expect(result.current.errors.email).toBe('email format is invalid');
    });

    it('should return true if all fields are valid', () => {
      const schema: ValidationSchema = {
        name: { required: true },
        email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      };

      const { result } = renderHook(() => useFormValidation(schema));

      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validateAll({
          name: 'John Doe',
          email: 'john@example.com',
        });
      });

      expect(isValid).toBe(true);
      expect(Object.keys(result.current.errors)).toHaveLength(0);
    });

    it('should handle multiple validation errors', () => {
      const schema: ValidationSchema = {
        name: { required: true },
        email: { required: true },
        password: { required: true, minLength: 8 },
      };

      const { result } = renderHook(() => useFormValidation(schema));

      act(() => {
        result.current.validateAll({
          name: '',
          email: '',
          password: 'short',
        });
      });

      expect(Object.keys(result.current.errors)).toHaveLength(3);
      expect(result.current.errors.name).toBeDefined();
      expect(result.current.errors.email).toBeDefined();
      expect(result.current.errors.password).toBeDefined();
    });
  });

  describe('clearError', () => {
    it('should clear error for specific field', () => {
      const schema: ValidationSchema = {
        name: { required: true },
        email: { required: true },
      };

      const { result } = renderHook(() => useFormValidation(schema));

      act(() => {
        result.current.validateAll({ name: '', email: '' });
      });

      expect(result.current.errors.name).toBeDefined();
      expect(result.current.errors.email).toBeDefined();

      act(() => {
        result.current.clearError('name');
      });

      expect(result.current.errors.name).toBeUndefined();
      expect(result.current.errors.email).toBeDefined();
    });
  });

  describe('clearAllErrors', () => {
    it('should clear all errors', () => {
      const schema: ValidationSchema = {
        name: { required: true },
        email: { required: true },
      };

      const { result } = renderHook(() => useFormValidation(schema));

      act(() => {
        result.current.validateAll({ name: '', email: '' });
      });

      expect(Object.keys(result.current.errors)).toHaveLength(2);

      act(() => {
        result.current.clearAllErrors();
      });

      expect(Object.keys(result.current.errors)).toHaveLength(0);
    });
  });

  describe('edge cases', () => {
    it('should handle whitespace-only strings as empty for required fields', () => {
      const schema: ValidationSchema = {
        name: { required: true },
      };

      const { result } = renderHook(() => useFormValidation(schema));

      act(() => {
        result.current.validate('name', '   ');
      });

      expect(result.current.errors.name).toBe('name is required');
    });

    it('should skip validation for fields not in schema', () => {
      const schema: ValidationSchema = {
        name: { required: true },
      };

      const { result } = renderHook(() => useFormValidation(schema));

      act(() => {
        result.current.validate('unknownField', '');
      });

      expect(result.current.errors.unknownField).toBeUndefined();
    });

    it('should handle null and undefined values', () => {
      const schema: ValidationSchema = {
        name: { required: true },
      };

      const { result } = renderHook(() => useFormValidation(schema));

      act(() => {
        result.current.validate('name', null);
      });

      expect(result.current.errors.name).toBe('name is required');

      act(() => {
        result.current.validate('name', undefined);
      });

      expect(result.current.errors.name).toBe('name is required');
    });
  });
});

describe('useDebouncedValidation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should debounce validation calls', () => {
    const mockValidate = vi.fn(() => true);
    const { result } = renderHook(() => useDebouncedValidation(mockValidate, 300));

    act(() => {
      result.current('email', 'test1');
      result.current('email', 'test2');
      result.current('email', 'test3');
    });

    // Should not have called yet
    expect(mockValidate).not.toHaveBeenCalled();

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Should have called only once with the last value
    expect(mockValidate).toHaveBeenCalledTimes(1);
    expect(mockValidate).toHaveBeenCalledWith('email', 'test3');
  });

  it('should handle multiple fields independently', () => {
    const mockValidate = vi.fn(() => true);
    const { result } = renderHook(() => useDebouncedValidation(mockValidate, 300));

    act(() => {
      result.current('email', 'test@example.com');
      result.current('name', 'John Doe');
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(mockValidate).toHaveBeenCalledTimes(2);
    expect(mockValidate).toHaveBeenCalledWith('email', 'test@example.com');
    expect(mockValidate).toHaveBeenCalledWith('name', 'John Doe');
  });

  it('should use default delay of 300ms', () => {
    const mockValidate = vi.fn(() => true);
    const { result } = renderHook(() => useDebouncedValidation(mockValidate));

    act(() => {
      result.current('email', 'test@example.com');
    });

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(mockValidate).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(mockValidate).toHaveBeenCalledTimes(1);
  });
});
