import React, { useEffect } from 'react';
import { Alert } from 'reactstrap';
import { Notification as NotificationType } from '../../../slices/notifications/types';

interface FlashNotificationProps {
    notification: NotificationType;
    onDismiss: (id: string) => void;
}

// Icon mapping based on TenantRentalConfig pattern
const getNotificationIcon = (type: string): string => {
    switch (type) {
        case 'success':
            return 'ri-check-line';
        case 'error':
            return 'ri-error-warning-line';
        case 'warning':
            return 'ri-alert-line';
        case 'info':
            return 'ri-information-line';
        default:
            return 'ri-information-line';
    }
};

// Color mapping for reactstrap Alert
const getAlertColor = (type: string): string => {
    switch (type) {
        case 'success':
            return 'success';
        case 'error':
            return 'danger';
        case 'warning':
            return 'warning';
        case 'info':
            return 'info';
        default:
            return 'info';
    }
};

const FlashNotification: React.FC<FlashNotificationProps> = ({
    notification,
    onDismiss,
}) => {
    useEffect(() => {
        if (notification.duration && notification.duration > 0) {
            const timer = setTimeout(() => {
                onDismiss(notification.id);
            }, notification.duration);

            return () => clearTimeout(timer);
        }
    }, [notification.id, notification.duration, onDismiss]);

    return (
        <Alert
            color={getAlertColor(notification.type)}
            className="alert-dismissible fade show mb-2"
            style={{
                animation: 'fadeIn 0.3s ease-in',
            }}
        >
            <i className={`${getNotificationIcon(notification.type)} me-2`}></i>
            {notification.title && <strong>{notification.title}: </strong>}
            {notification.message}
            {notification.dismissible && (
                <button
                    type="button"
                    className="btn-close"
                    onClick={() => onDismiss(notification.id)}
                    aria-label="Close"
                ></button>
            )}
        </Alert>
    );
};

export default FlashNotification;
