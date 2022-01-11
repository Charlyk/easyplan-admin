import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import IconClose from 'app/components/icons/iconClose';
import styles from './GlobalNotification.module.scss';

const GlobalNotificationView: React.FC = () => {
  return (
    <div className={styles.globalNotification}>
      <IconButton className={styles.closeIcon}>
        <IconClose fill='#ffffff' />
      </IconButton>
      <Typography className={styles.messageText}>
        New update will appear on 31 Jan 2022 at 16:00
      </Typography>
    </div>
  );
};

export default GlobalNotificationView;
