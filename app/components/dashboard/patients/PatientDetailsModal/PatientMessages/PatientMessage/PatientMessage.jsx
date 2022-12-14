import React, { useEffect, useState } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-polyglot';
import { useSelector } from 'react-redux';
import IconError from 'app/components/icons/iconError';
import IconPending from 'app/components/icons/IconPending';
import IconSuccess from 'app/components/icons/iconSuccess';
import { updateSMSMessageStatusSelector } from 'redux/selectors/patientSelector';
import styles from './PatientMessage.module.scss';

const PatientMessage = ({ message }) => {
  const textForKey = useTranslate();
  const updateMessage = useSelector(updateSMSMessageStatusSelector);
  const [messageStatus, setMessageStatus] = useState(message.status);

  useEffect(() => {
    if (updateMessage != null && updateMessage.id === message.id) {
      setMessageStatus(updateMessage.status);
    }
  }, [updateMessage]);

  const sentByLabel = () => {
    if (message.sentByFirstName == null && message.sentByLastName == null) {
      return textForKey('system');
    }
    return `${message.sentByFirstName} ${message.sentByLastName}`;
  };

  const statusText = () => {
    switch (messageStatus) {
      case 'Success':
        return textForKey('delivered successfully');
      case 'Submit':
        return textForKey('pending delivery');
      case 'Failure':
        return textForKey('message not delivered');
      default:
        return textForKey('unknown delivery status');
    }
  };

  const statusIcon = () => {
    switch (messageStatus) {
      case 'Success':
        return <IconSuccess fill='#00E987' />;
      case 'Submit':
        return <IconPending fill='#ffb902' />;
      case 'Failure':
        return <IconError />;
      default:
        return null;
    }
  };

  return (
    <div className={styles['patient-message']}>
      <Tooltip title={statusText()}>
        <div className={styles['status-container']}>{statusIcon()}</div>
      </Tooltip>
      <Typography classes={{ root: styles['message-text'] }}>
        {message.messageText}
      </Typography>
      <Typography classes={{ root: styles['sent-by-label'] }}>
        {textForKey('sent by')}: {sentByLabel()} {textForKey('at')}{' '}
        {moment(message.created).format('DD.MM.YYYY HH:mm')}
      </Typography>
    </div>
  );
};

export default PatientMessage;

PatientMessage.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.number,
    messageText: PropTypes.string,
    status: PropTypes.oneOf([
      'Success',
      'Failure',
      'Buffered',
      'Submit',
      'Rejected',
      'Unknown',
    ]),
    created: PropTypes.string,
    sentByFirstName: PropTypes.string,
    sentByLastName: PropTypes.string,
  }),
};
