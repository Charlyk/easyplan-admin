import React, { useRef, useState } from 'react';
import Box from '@material-ui/core/Box';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';

import IconMore from '../../../../icons/iconMore';
import { getAppLanguage, textForKey } from '../../../../../../utils/localization';
import styles from './SMSMessageItem.module.scss';

const SMSMessageItem = ({ message, onEdit, onDisable, onDelete }) => {
  const menuAnchor = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const messageText = () => {
    const textObject = JSON.parse(message.messageText);
    return textObject[getAppLanguage()] || '';
  };

  const messageTime = () => {
    switch (message.messageType) {
      case 'ScheduleNotification':
      case 'BirthdayCongrats':
        return message.hourToSendAt;
      case 'HolidayCongrats':
      case 'PromotionalMessage':
        return `${moment(message.dateToSend).format('DD MMMM')} ${message.hourToSendAt}`;
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
      classes={{ list: styles['message-menu'] }}
    >
      <MenuItem classes={{ root: styles['menu-item'] }} onClick={handleEditItem}>
        <Typography classes={{ root: styles['item-text'] }}>
          {textForKey('edit')}
        </Typography>
      </MenuItem>
      <MenuItem classes={{ root: styles['menu-item'] }} onClick={handleDisableItem}>
        <Typography classes={{ root: styles['item-text'] }}>
          {message.disabled ? textForKey('enable') : textForKey('disable')}
        </Typography>
      </MenuItem>
      <MenuItem classes={{ root: styles['menu-item'] }} onClick={handleDeleteItem}>
        <Typography classes={{ root: styles['item-text'] }}>
          {textForKey('delete')}
        </Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <TableRow classes={{ root: clsx(styles['message-item-row'], { [styles.disabled]: message.disabled }) }}>
      {moreMenu}
      <TableCell classes={{ root: styles['message-title'] }}>
        <Typography noWrap classes={{ root: styles['message-title'] }}>
          {message.messageTitle}
        </Typography>
      </TableCell>
      <TableCell classes={{ root: styles['message-text'] }}>
        <Typography noWrap classes={{ root: styles['message-text'] }}>
          {messageText()}
        </Typography>
      </TableCell>
      <TableCell>{textForKey(message.messageType)}</TableCell>
      <TableCell>{messageTime()}</TableCell>
      <TableCell classes={{ root: styles.actions }}>
        <Box
          display='flex'
          width='100%'
          height='100%'
          alignItems='center'
          justifyContent='center'
        >
          <ClickAwayListener onClickAway={handleCloseMenu}>
            <IconButton
              classes={{ root: styles['more-btn'] }}
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
    messageTitle: PropTypes.string,
    messageText: PropTypes.string,
    messageType: PropTypes.oneOf([
      'ScheduleNotification',
      'BirthdayCongrats',
      'HolidayCongrats',
      'PromotionalMessage',
      'OnetimeMessage',
    ]),
    hourToSendAt: PropTypes.string,
    dateToSend: PropTypes.string,
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
