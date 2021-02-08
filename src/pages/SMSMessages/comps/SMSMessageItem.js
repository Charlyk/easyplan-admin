import React from 'react';

import { TableCell, TableRow, Typography } from '@material-ui/core';
import moment from 'moment';
import PropTypes from 'prop-types';

import { getAppLanguage, textForKey } from '../../../utils/localization';

const SMSMessageItem = ({ message }) => {
  const messageText = () => {
    const textObject = JSON.parse(message.message);
    return textObject[getAppLanguage()] || '';
  };

  const messageTime = () => {
    switch (message.type) {
      case 'ScheduleNotification':
        if (message.sendTime > 1 || message.sendTime < 1) {
          return `${message.sendTime} ${textForKey(message.timeType + 's')}`;
        } else {
          return `${message.sendTime} ${textForKey(message.timeType)}`;
        }
      case 'HolidayCongrats':
      case 'PromotionalMessage':
        return moment(message.sendDate).format('DD MMMM');
      default:
        return '-';
    }
  };

  return (
    <TableRow>
      <TableCell classes={{ root: 'message-title' }}>
        <Typography noWrap classes={{ root: 'message-title' }}>
          {message.title}
        </Typography>
      </TableCell>
      <TableCell classes={{ root: 'message-text' }}>
        <Typography noWrap classes={{ root: 'message-text' }}>
          {messageText()}
        </Typography>
      </TableCell>
      <TableCell>{textForKey(message.type)}</TableCell>
      <TableCell>{messageTime()}</TableCell>
    </TableRow>
  );
};

export default SMSMessageItem;

SMSMessageItem.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    message: PropTypes.string,
    type: PropTypes.oneOf([
      'ScheduleNotification',
      'BirthdayCongrats',
      'HolidayCongrats',
      'PromotionalMessage',
      'OnetimeMessage',
    ]),
    timeType: PropTypes.oneOf(['Hour', 'Minute']),
    sendTime: PropTypes.number,
    sendDate: PropTypes.string,
  }),
};
