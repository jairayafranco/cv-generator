import { useState, useCallback } from 'react';
import { Notification, NotificationType } from '../types/CvStore';

interface UseNotificationReturn {
    notifications: Notification[];
    showNotification: (type: NotificationType, message: string, duration?: number) => void;
    dismissNotification: (id: string) => void;
}

export function useNotification(): UseNotificationReturn {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const dismissNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const showNotification = useCallback((
        type: NotificationType,
        message: string,
        duration: number = 5000
    ) => {
        const id = crypto.randomUUID();
        const notification: Notification = {
            id,
            type,
            message,
            duration
        };

        setNotifications(prev => [...prev, notification]);

        // Auto-dismiss after duration
        if (duration > 0) {
            setTimeout(() => {
                dismissNotification(id);
            }, duration);
        }
    }, [dismissNotification]);

    return {
        notifications,
        showNotification,
        dismissNotification
    };
}
