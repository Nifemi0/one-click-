// Notification toast component for displaying messages

'use client';

import React, { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useNotifications, useStoreActions } from '@/lib/store';
import { cn } from '@/lib/utils';
import { NOTIFICATION_TYPES } from '@/lib/constants';

const notificationIcons = {
  [NOTIFICATION_TYPES.SUCCESS]: (
    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  [NOTIFICATION_TYPES.ERROR]: (
    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  ),
  [NOTIFICATION_TYPES.WARNING]: (
    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  ),
  [NOTIFICATION_TYPES.INFO]: (
    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
  ),
};

const notificationStyles = {
  [NOTIFICATION_TYPES.SUCCESS]: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200',
  [NOTIFICATION_TYPES.ERROR]: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200',
  [NOTIFICATION_TYPES.WARNING]: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200',
  [NOTIFICATION_TYPES.INFO]: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200',
};

export default function NotificationToast() {
  const notifications = useNotifications();
  const { removeNotification } = useStoreActions();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-4 max-w-sm w-full">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}

interface NotificationItemProps {
  notification: {
    id: string;
    type: string;
    title: string;
    message: string;
    createdAt: Date;
  };
  onRemove: () => void;
}

function NotificationItem({ notification, onRemove }: NotificationItemProps) {
  const { type, title, message } = notification;

  useEffect(() => {
    // Auto-remove notification after 5 seconds
    const timer = setTimeout(() => {
      onRemove();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onRemove]);

  return (
    <div
      className={cn(
        'flex items-start p-4 rounded-lg border shadow-lg transition-all duration-300 ease-in-out transform',
        notificationStyles[type as keyof typeof notificationStyles] || notificationStyles[NOTIFICATION_TYPES.INFO]
      )}
      role="alert"
    >
      <div className="flex-shrink-0 mt-0.5">
        {notificationIcons[type as keyof typeof notificationIcons] || notificationIcons[NOTIFICATION_TYPES.INFO]}
      </div>
      
      <div className="ml-3 flex-1 min-w-0">
        {title && (
          <p className="text-sm font-medium leading-5">
            {title}
          </p>
        )}
        {message && (
          <p className="text-sm leading-5 mt-1">
            {message}
          </p>
        )}
      </div>
      
      <div className="ml-4 flex-shrink-0">
        <button
          type="button"
          className={cn(
            'inline-flex rounded-md p-1.5 transition-colors',
            type === NOTIFICATION_TYPES.SUCCESS && 'text-green-400 hover:text-green-600 hover:bg-green-100 dark:hover:bg-green-800/30',
            type === NOTIFICATION_TYPES.ERROR && 'text-red-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-800/30',
            type === NOTIFICATION_TYPES.WARNING && 'text-yellow-400 hover:text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-800/30',
            type === NOTIFICATION_TYPES.INFO && 'text-blue-400 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-800/30'
          )}
          onClick={onRemove}
          aria-label="Close notification"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// Hook for easy notification creation
export function useNotification() {
  const { addNotification } = useStoreActions();

  const showNotification = (
    type: keyof typeof NOTIFICATION_TYPES,
    title: string,
    message?: string,
    duration?: number
  ) => {
    addNotification({
      type,
      title,
      message: message || '',
      duration,
    });
  };

  return {
    showSuccess: (title: string, message?: string, duration?: number) =>
      showNotification(NOTIFICATION_TYPES.SUCCESS, title, message, duration),
    showError: (title: string, message?: string, duration?: number) =>
      showNotification(NOTIFICATION_TYPES.ERROR, title, message, duration),
    showWarning: (title: string, message?: string, duration?: number) =>
      showNotification(NOTIFICATION_TYPES.WARNING, title, message, duration),
    showInfo: (title: string, message?: string, duration?: number) =>
      showNotification(NOTIFICATION_TYPES.INFO, title, message, duration),
  };
}