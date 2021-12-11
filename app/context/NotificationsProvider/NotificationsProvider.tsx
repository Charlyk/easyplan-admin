import React from 'react';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { globalNotificationsSelector } from 'redux/selectors/globalNotificationsSelector';
import {
  hideNotification,
  showNotification,
} from 'redux/slices/globalNotificationsSlice';
import { NotificationSeverity } from 'types';
import NotificationsContext from '../notificationsContext';

const NotificationsProvider: React.FC = ({ children }) => {
  const dispatch = useDispatch();
  const { message, severity } = useSelector(globalNotificationsSelector);
  const isVisible = message != null && message.length > 0;

  const handleCloseNotification = () => {
    dispatch(hideNotification());
  };

  const handleNotify = (message: string) => {
    dispatch(
      showNotification({
        message,
        severity: NotificationSeverity.info,
      }),
    );
  };

  const handleNotifyError = (message: string) => {
    dispatch(
      showNotification({
        message,
        severity: NotificationSeverity.error,
      }),
    );
  };

  const handleNotifySuccess = (message: string) => {
    dispatch(
      showNotification({
        message,
        severity: NotificationSeverity.success,
      }),
    );
  };

  const handleNotifyWarn = (message: string) => {
    dispatch(
      showNotification({
        message,
        severity: NotificationSeverity.warning,
      }),
    );
  };

  return (
    <NotificationsContext.Provider
      value={{
        show: handleNotify,
        error: handleNotifyError,
        warn: handleNotifyWarn,
        success: handleNotifySuccess,
      }}
    >
      <Snackbar
        open={isVisible}
        autoHideDuration={1500}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={handleCloseNotification}
      >
        <Alert severity={severity} style={{ width: '100%' }}>
          {message ?? ''}
        </Alert>
      </Snackbar>
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsProvider;
