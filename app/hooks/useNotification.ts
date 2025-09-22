import { useState } from 'react';
import type { NotificationState } from '~/components/board/types';

export function useNotification() {
    const [notification, setNotification] = useState<NotificationState | null>(null);

    const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
        setNotification({ message, type });
    };

    const clearNotification = () => {
        setNotification(null);
    };

    return {
        notification,
        showNotification,
        clearNotification,
    };
}
