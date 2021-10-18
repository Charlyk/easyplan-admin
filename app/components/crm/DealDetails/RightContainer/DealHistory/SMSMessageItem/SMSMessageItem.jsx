import React, { useMemo } from "react";
import PropTypes from 'prop-types';
import moment from "moment-timezone";
import SmsIcon from '@material-ui/icons/Sms';
import Typography from "@material-ui/core/Typography";
import { textForKey } from "../../../../../../utils/localization";
import styles from './SMSMessageItem.module.scss';

const SMSMessageItem = ({ message }) => {
  const { sentBy, smsMessage, created } = message;
  const sentByName = useMemo(() => {
    if (sentBy != null) {
      return `${sentBy.firstName} ${sentBy.lastName}`;
    }
    return textForKey('System')
  }, [sentBy]);

  return (
    <div className={styles.smsMessageItem}>
      <SmsIcon />
      <div className={styles.dataWrapper}>
        <Typography className={styles.dateText}>
          {moment(created).format('DD.MM.YYYY HH:mm')}{' '}
          {sentByName}
        </Typography>
        <Typography className={styles.messageText}>
          {smsMessage.messageText}
        </Typography>
      </div>
    </div>
  );
};

export default SMSMessageItem;

SMSMessageItem.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.number,
    created: PropTypes.string,
    sentBy: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
    smsMessage: PropTypes.shape({
      id: PropTypes.number,
      messageText: PropTypes.string,
      sendStatus: PropTypes.string,
    }),
  }),
};
