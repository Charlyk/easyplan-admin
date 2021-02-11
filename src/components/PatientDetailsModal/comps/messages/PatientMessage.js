import React from 'react';

import { Typography } from '@material-ui/core';
import moment from 'moment';
import PropTypes from 'prop-types';

import { textForKey } from '../../../../utils/localization';

const PatientMessage = ({ message }) => {
  const sentByLabel = () => {
    if (message.sentByFirstName == null && message.sentByLastName == null) {
      return textForKey('System');
    }
    return `${message.sentByFirstName} ${message.sentByLastName}`;
  };

  return (
    <div className='patients-messages-list__item'>
      <Typography classes={{ root: 'message-text' }}>
        {message.messageText}
      </Typography>
      <Typography classes={{ root: 'sent-by-label' }}>
        {textForKey('Sent by')}: {sentByLabel()} {textForKey('at')}{' '}
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
    status: PropTypes.string,
    created: PropTypes.string,
    sentByFirstName: PropTypes.string,
    sentByLastName: PropTypes.string,
  }),
};
