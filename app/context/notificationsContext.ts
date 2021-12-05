import React from 'react';
import { NotificationsProviderValue } from './NotificationsProvider';

const NotificationsContext = React.createContext<NotificationsProviderValue>({
  show: (message) => message,
  error: (message) => message,
  success: (message) => message,
  warn: (message) => message,
});

export default NotificationsContext;
