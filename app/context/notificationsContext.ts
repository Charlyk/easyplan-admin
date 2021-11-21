import React from 'react';
import { NotificationsProviderValue } from './NotificationsProvider/NotificationsProvider.types';

const NotificationsContext = React.createContext<NotificationsProviderValue>({
  show: (message) => message,
  error: (message) => message,
  success: (message) => message,
  warn: (message) => message,
});

export default NotificationsContext;
