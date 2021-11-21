import React, { useReducer } from 'react';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import NotificationsContext from '../notificationsContext';
import reducer, {
  initialState,
  closeNotification,
  setNotification,
} from './NotificationsProvider.slice';

const NotificationsProvider: React.FC = ({ children }) => {
  const [{ isVisible, message, severity }, localDispatch] = useReducer(
    reducer,
    initialState,
  );

  const handleCloseNotification = () => {
    localDispatch(closeNotification());
  };

  const handleNotify = (message: any) => {
    localDispatch(
      setNotification({
        show: true,
        message: message,
        severity: 'info',
      }),
    );
  };

  const handleNotifyError = (message: any) => {
    localDispatch(
      setNotification({
        show: true,
        message: message,
        severity: 'error',
      }),
    );
  };

  const handleNotifySuccess = (message: any) => {
    localDispatch(
      setNotification({
        show: true,
        message: message,
        severity: 'success',
      }),
    );
  };

  const handleNotifyWarn = (message: any) => {
    localDispatch(
      setNotification({
        show: true,
        message: message,
        severity: 'warning',
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
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={handleCloseNotification}
      >
        <Alert severity={severity} style={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsProvider;
