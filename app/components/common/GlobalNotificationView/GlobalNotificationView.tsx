import React, { useEffect, useMemo } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { useDispatch, useSelector } from 'react-redux';
import IconClose from 'app/components/icons/iconClose';
import { appLanguageSelector } from 'redux/selectors/appDataSelector';
import styles from './GlobalNotification.module.scss';
import {
  dispatchFetchUnreadNotification,
  dispatchMarkNotificationAsRead,
} from './GlobalNotificationView.reducer';
import { appNotificationSelector } from './GlobalNotificationView.selector';

const GlobalNotificationView: React.FC = () => {
  const dispatch = useDispatch();
  const { notification, isLoading } = useSelector(appNotificationSelector);
  const appLanguage = useSelector(appLanguageSelector);

  useEffect(() => {
    dispatch(dispatchFetchUnreadNotification());
  }, []);

  const notificationMessage = useMemo(() => {
    if (notification == null) {
      return '';
    }
    try {
      return JSON.parse(notification.message);
    } catch (error) {
      return notification.message;
    }
  }, [notification]);

  const handleCloseNotification = () => {
    if (notification == null) {
      return;
    }

    dispatch(dispatchMarkNotificationAsRead(notification.id));
  };

  if (notification == null || isLoading || notificationMessage == null) {
    return null;
  }

  return (
    <div
      className={styles.globalNotification}
      style={{ backgroundColor: notification.color ?? '#157BFA' }}
    >
      <IconButton
        className={styles.closeIcon}
        onClick={handleCloseNotification}
      >
        <IconClose fill='#ffffff' />
      </IconButton>
      <Typography className={styles.messageText}>
        {notificationMessage?.[appLanguage] ?? notificationMessage}
      </Typography>
    </div>
  );
};

export default GlobalNotificationView;
