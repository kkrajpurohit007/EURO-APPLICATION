import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FlashNotification from './index';
import { selectNotifications, removeNotification } from '../../../slices/notifications/notificationSlice';

const FlashContainer: React.FC = () => {
    const notifications = useSelector(selectNotifications);
    const dispatch = useDispatch();

    const handleDismiss = (id: string) => {
        dispatch(removeNotification(id));
    };

    if (notifications.length === 0) {
        return null;
    }

    return (
        <div
            style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 1050,
                maxWidth: '400px',
                width: '100%',
            }}
        >
            {notifications.map((notification) => (
                <FlashNotification
                    key={notification.id}
                    notification={notification}
                    onDismiss={handleDismiss}
                />
            ))}
        </div>
    );
};

export default FlashContainer;
