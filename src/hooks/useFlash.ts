import { useDispatch } from 'react-redux';
import { addNotification, clearAllNotifications } from '../slices/notifications/notificationSlice';
import { NotificationType } from '../slices/notifications/types';

interface FlashOptions {
    duration?: number;
    dismissible?: boolean;
}

export const useFlash = () => {
    const dispatch = useDispatch();

    const showNotification = (
        type: NotificationType,
        message: string,
        title?: string,
        options?: FlashOptions
    ) => {
        dispatch(
            addNotification({
                type,
                message,
                title,
                duration: options?.duration,
                dismissible: options?.dismissible,
            })
        );
    };

    return {
        showSuccess: (message: string, title?: string, options?: FlashOptions) =>
            showNotification('success', message, title, options),

        showError: (message: string, title?: string, options?: FlashOptions) =>
            showNotification('error', message, title, options),

        showWarning: (message: string, title?: string, options?: FlashOptions) =>
            showNotification('warning', message, title, options),

        showInfo: (message: string, title?: string, options?: FlashOptions) =>
            showNotification('info', message, title, options),

        clearAll: () => dispatch(clearAllNotifications()),
    };
};
