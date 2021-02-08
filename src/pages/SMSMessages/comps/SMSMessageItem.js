import React, { useRef, useState } from 'react';

import {
  Box,
  ClickAwayListener,
  IconButton,
  Menu,
  MenuItem,
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';

import IconMore from '../../../assets/icons/iconMore';
import { getAppLanguage, textForKey } from '../../../utils/localization';

const SMSMessageItem = ({ message, onEdit, onDisable, onDelete }) => {
  const menuAnchor = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const handleMoreClick = () => {
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleDeleteItem = () => {
    onDelete(message);
  };

  const handleDisableItem = () => {
    onDisable(message);
  };

  const handleEditItem = () => {
    onEdit(message);
  };

  const moreMenu = (
    <Menu
      open={isMenuOpen}
      anchorEl={menuAnchor.current}
      classes={{ list: 'message-menu' }}
    >
      <MenuItem classes={{ root: 'menu-item' }} onClick={handleEditItem}>
        <Typography classes={{ root: 'item-text' }}>
          {textForKey('edit')}
        </Typography>
      </MenuItem>
      <MenuItem classes={{ root: 'menu-item' }} onClick={handleDisableItem}>
        <Typography classes={{ root: 'item-text' }}>
          {message.disabled ? textForKey('enable') : textForKey('disable')}
        </Typography>
      </MenuItem>
      <MenuItem classes={{ root: 'menu-item' }} onClick={handleDeleteItem}>
        <Typography classes={{ root: 'item-text' }}>
          {textForKey('delete')}
        </Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <TableRow classes={{ root: clsx({ disabled: message.disabled }) }}>
      {moreMenu}
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
      <TableCell classes={{ root: 'actions' }}>
        <Box
          display='flex'
          width='100%'
          height='100%'
          alignItems='center'
          justifyContent='center'
        >
          <ClickAwayListener onClickAway={handleCloseMenu}>
            <IconButton
              classes={{ root: 'more-btn' }}
              ref={menuAnchor}
              onClick={handleMoreClick}
            >
              <IconMore />
            </IconButton>
          </ClickAwayListener>
        </Box>
      </TableCell>
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
    disabled: PropTypes.bool,
  }),
  onEdit: PropTypes.func,
  onDisable: PropTypes.func,
  onDelete: PropTypes.func,
};

SMSMessageItem.defaultProps = {
  onEdit: () => null,
  onDisable: () => null,
  onDelete: () => null,
};
