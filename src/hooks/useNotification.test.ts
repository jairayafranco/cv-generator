import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNotification } from './useNotification';

describe('useNotification', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should initialize with empty notifications', () => {
        const { result } = renderHook(() => useNotification());
        expect(result.current.notifications).toEqual([]);
    });

    it('should add a notification when showNotification is called', () => {
        const { result } = renderHook(() => useNotification());

        act(() => {
            result.current.showNotification('success', 'Test message');
        });

        expect(result.current.notifications).toHaveLength(1);
        expect(result.current.notifications[0].type).toBe('success');
        expect(result.current.notifications[0].message).toBe('Test message');
        expect(result.current.notifications[0].id).toBeDefined();
    });

    it('should add multiple notifications', () => {
        const { result } = renderHook(() => useNotification());

        act(() => {
            result.current.showNotification('success', 'Message 1');
            result.current.showNotification('error', 'Message 2');
            result.current.showNotification('warning', 'Message 3');
        });

        expect(result.current.notifications).toHaveLength(3);
        expect(result.current.notifications[0].message).toBe('Message 1');
        expect(result.current.notifications[1].message).toBe('Message 2');
        expect(result.current.notifications[2].message).toBe('Message 3');
    });

    it('should dismiss a notification manually', () => {
        const { result } = renderHook(() => useNotification());

        act(() => {
            result.current.showNotification('info', 'Test message');
        });

        const notificationId = result.current.notifications[0].id;

        act(() => {
            result.current.dismissNotification(notificationId);
        });

        expect(result.current.notifications).toHaveLength(0);
    });

    it('should auto-dismiss notification after duration', () => {
        const { result } = renderHook(() => useNotification());

        act(() => {
            result.current.showNotification('success', 'Test message', 3000);
        });

        expect(result.current.notifications).toHaveLength(1);

        act(() => {
            vi.advanceTimersByTime(3000);
        });

        expect(result.current.notifications).toHaveLength(0);
    });

    it('should use default duration of 5000ms', () => {
        const { result } = renderHook(() => useNotification());

        act(() => {
            result.current.showNotification('success', 'Test message');
        });

        expect(result.current.notifications).toHaveLength(1);

        act(() => {
            vi.advanceTimersByTime(4999);
        });

        expect(result.current.notifications).toHaveLength(1);

        act(() => {
            vi.advanceTimersByTime(1);
        });

        expect(result.current.notifications).toHaveLength(0);
    });

    it('should not auto-dismiss when duration is 0', () => {
        const { result } = renderHook(() => useNotification());

        act(() => {
            result.current.showNotification('success', 'Test message', 0);
        });

        expect(result.current.notifications).toHaveLength(1);

        act(() => {
            vi.advanceTimersByTime(10000);
        });

        expect(result.current.notifications).toHaveLength(1);
    });

    it('should handle all notification types', () => {
        const { result } = renderHook(() => useNotification());

        act(() => {
            result.current.showNotification('success', 'Success message');
            result.current.showNotification('error', 'Error message');
            result.current.showNotification('warning', 'Warning message');
            result.current.showNotification('info', 'Info message');
        });

        expect(result.current.notifications).toHaveLength(4);
        expect(result.current.notifications[0].type).toBe('success');
        expect(result.current.notifications[1].type).toBe('error');
        expect(result.current.notifications[2].type).toBe('warning');
        expect(result.current.notifications[3].type).toBe('info');
    });
});
