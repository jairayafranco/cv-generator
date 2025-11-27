import { Notification } from '../types/CvStore';

interface NotificationContainerProps {
    notifications: Notification[];
    onDismiss: (id: string) => void;
}

export function NotificationContainer({ notifications, onDismiss }: NotificationContainerProps) {
    if (notifications.length === 0) {
        return null;
    }

    const getAlertClass = (type: Notification['type']): string => {
        switch (type) {
            case 'success':
                return 'alert-success';
            case 'error':
                return 'alert-error';
            case 'warning':
                return 'alert-warning';
            case 'info':
                return 'alert-info';
            default:
                return 'alert-info';
        }
    };

    return (
        <div 
            className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md"
            role="region"
            aria-label="Notifications"
            aria-live="polite"
        >
            {notifications.map(notification => (
                <div
                    key={notification.id}
                    className={`alert ${getAlertClass(notification.type)} shadow-lg`}
                    role="alert"
                >
                    <div className="flex-1">
                        <span>{notification.message}</span>
                    </div>
                    <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => onDismiss(notification.id)}
                        aria-label="Dismiss notification"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
}
