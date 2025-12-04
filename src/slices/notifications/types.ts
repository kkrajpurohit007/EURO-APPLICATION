// Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
    id: string;
    type: NotificationType;
    title?: string;
    message: string;
    duration?: number; // Auto-hide duration in ms, 0 = no auto-hide
    dismissible?: boolean;
}

export interface NotificationState {
    notifications: Notification[];
}

export interface AddNotificationPayload {
    type: NotificationType;
    title?: string;
    message: string;
    duration?: number;
    dismissible?: boolean;
}
