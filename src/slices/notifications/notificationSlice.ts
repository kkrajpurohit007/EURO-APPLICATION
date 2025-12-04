import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { NotificationState, Notification, AddNotificationPayload } from './types';

const initialState: NotificationState = {
    notifications: [],
};

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<AddNotificationPayload>) => {
            const notification: Notification = {
                id: uuidv4(),
                type: action.payload.type,
                title: action.payload.title,
                message: action.payload.message,
                duration: action.payload.duration ?? 3000, // Default 3s like TenantRentalConfig
                dismissible: action.payload.dismissible ?? true,
            };

            // Limit to max 5 notifications
            if (state.notifications.length >= 5) {
                state.notifications.shift(); // Remove oldest
            }

            state.notifications.push(notification);
        },

        removeNotification: (state, action: PayloadAction<string>) => {
            state.notifications = state.notifications.filter(
                (notification) => notification.id !== action.payload
            );
        },

        clearAllNotifications: (state) => {
            state.notifications = [];
        },
    },
});

export const { addNotification, removeNotification, clearAllNotifications } = notificationSlice.actions;

// Selectors
export const selectNotifications = (state: { Notifications: NotificationState }) =>
    state.Notifications.notifications;

export default notificationSlice.reducer;
