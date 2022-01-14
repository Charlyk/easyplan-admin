import React, { useCallback, useEffect } from 'react';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Router } from 'next/router';
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

  const handleRouteChangeStart = useCallback(() => {
    dispatch(hideNotification());
  }, [dispatch]);

  useEffect(() => {
    Router.events.on('routeChangeStart', handleRouteChangeStart);
    return () => {
      Router.events.off('routeChangeStart', handleRouteChangeStart);
    };
  }, [handleRouteChangeStart]);

  const handleCloseNotification = () => {
    dispatch(hideNotification());
  };

  const handleNotify = useCallback(
    (message: string) => {
      dispatch(
        showNotification({
          message,
          severity: NotificationSeverity.info,
        }),
      );
    },
    [dispatch],
  );

  const handleNotifyError = useCallback(
    (message: string) => {
      dispatch(
        showNotification({
          message,
          severity: NotificationSeverity.error,
        }),
      );
    },
    [dispatch],
  );

  const handleNotifySuccess = useCallback(
    (message: string) => {
      dispatch(
        showNotification({
          message,
          severity: NotificationSeverity.success,
        }),
      );
    },
    [dispatch],
  );

  const handleNotifyWarn = useCallback(
    (message: string) => {
      dispatch(
        showNotification({
          message,
          severity: NotificationSeverity.warning,
        }),
      );
    },
    [dispatch],
  );

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
        onClick={handleCloseNotification}
        style={{ userSelect: 'none', cursor: 'pointer' }}
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
