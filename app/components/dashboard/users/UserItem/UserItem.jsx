import React from 'react';
import clsx from 'clsx';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import IconButton from "@material-ui/core/IconButton";
import IconLockOpen from '@material-ui/icons/LockOpen';
import IconLockClosed from '@material-ui/icons/Lock';
import Tooltip from "@material-ui/core/Tooltip";
import upperFirst from 'lodash/upperFirst';
import PropTypes from 'prop-types';

import { Role } from '../../../../utils/constants';
import urlToLambda from '../../../../utils/urlToLambda';
import { textForKey } from '../../../../utils/localization';
import IconAppointmentCalendar from "../../../icons/iconAppointmentCalendar";
import IconAvatar from '../../../icons/iconAvatar';
import IconDelete from '../../../icons/iconDelete';
import IconEdit from '../../../icons/iconEdit';
import IconEmail from '../../../icons/iconEmail';
import IconPhone from '../../../icons/iconPhone';
import IconRefresh from '../../../icons/iconRefresh';
import LoadingButton from '../../../common/LoadingButton';
import SwitchButton from "../../../common/SwitchButton";
import styles from './UserItem.module.scss';
import EASImage from "../../../common/EASImage";

const UserItem = (
  {
    user,
    isInvitation,
    isInviting,
    onDelete,
    onEdit,
    onResend,
    onRestore,
    onCashierChange,
    onCalendarChange,
    onAccessToggle,
  }
) => {
  const handleDeleteUser = event => {
    onDelete(event, user, isInvitation);
  };

  const handleRestoreUser = event => {
    onRestore(event, user);
  };

  const handleEditUser = event => {
    onEdit(event, user);
  };

  const handleResendInvitation = event => {
    onResend(event, user);
  };

  const handleCashierChange = (enabled) => {
    onCashierChange(user, enabled);
  }

  const handleCalendarChange = () => {
    onCalendarChange?.(user);
  }

  const handleAccessToggle = () => {
    onAccessToggle?.(user, !user.accessBlocked);
  }

  const rootClasses = clsx(styles.userItem, user.isHidden ? styles.fired : styles.active);

  return (
    <TableRow className={rootClasses}>
      {!isInvitation && (
        <TableCell
          valign='middle'
          className={clsx(styles.nameAndAvatar, styles.tableCell)}
        >
          <div className={styles.flexContainer} style={{ height: '100%' }}>
            <div
              className={clsx(
                styles.statusIndicator,
                user.isHidden ? styles.fired : styles.active,
              )}
            />
            <EASImage
              src={user.avatar}
              placeholder={<IconAvatar/>}
              className={styles.avatarRoot}
            />
            <Typography className={styles.name}>
              {upperFirst(user.firstName.toLowerCase())}{' '}
              {upperFirst(user.lastName.toLowerCase())}
            </Typography>
          </div>
        </TableCell>
      )}
      {!isInvitation && (
        <TableCell valign='middle' className={clsx(styles.contact, styles.tableCell)}>
          <div className={styles.flexContainer}>
            <IconPhone/>
            <Typography className={styles.contactLabel}>
              {user.phoneNumber
                ? user.phoneNumber
                : textForKey('No phone number')}
            </Typography>
          </div>
        </TableCell>
      )}
      <TableCell
        valign='middle'
        colSpan={isInvitation ? 3 : 1}
        className={clsx(styles.contact, styles.tableCell)}
      >
        <div className={styles.flexContainer}>
          <IconEmail/>
          <Typography classes={{ root: styles.contactLabel }}>
            {user.email}
          </Typography>
        </div>
      </TableCell>
      <TableCell valign='middle' className={styles.tableCell}>
        <div className={styles.actionButtons}>
          {(user.status === 'Pending' || isInvitation) && (
            <LoadingButton
              isLoading={isInviting}
              className={styles.resendButton}
              onClick={handleResendInvitation}
            >
              {textForKey('Invite')} <IconRefresh fill='#FDC534'/>
            </LoadingButton>
          )}
          {user.roleInClinic === Role.doctor && !isInvitation && (
            <Tooltip
              title={
                user.showInCalendar
                  ? textForKey('Hide from calendar')
                  : textForKey('Show in calendar')
              }
            >
              <IconButton
                className={clsx(styles.iconButton, !user.showInCalendar && styles.hidden)}
                onClick={handleCalendarChange}
              >
                <IconAppointmentCalendar fill="#3A83DC"/>
              </IconButton>
            </Tooltip>
          )}
          {user.roleInClinic === Role.doctor && !isInvitation && (
            <Tooltip title={textForKey('Edit')}>
              <IconButton className={styles.iconButton} onClick={handleEditUser}>
                <IconEdit fill="#3A83DC"/>
              </IconButton>
            </Tooltip>
          )}
          {user.roleInClinic === Role.reception && !isInvitation && (
            <div className={styles.cashierSwitchWrapper}>
              <Typography className={styles.cashierSwitchTitle}>
                {textForKey('Cashier')}
              </Typography>
              <SwitchButton
                isChecked={user.canRegisterPayments}
                onChange={handleCashierChange}
              />
            </div>
          )}
          {user.roleInClinic !== Role.admin && (
            <Tooltip title={user.accessBlocked ? textForKey('allow_access') : textForKey('block_access')}>
              <IconButton className={styles.iconButton} onClick={handleAccessToggle}>
                {user.accessBlocked ? (
                  <IconLockClosed className={styles.blueIcon}/>
                ) : (
                  <IconLockOpen className={styles.blueIcon}/>
                )}
              </IconButton>
            </Tooltip>
          )}
          {user.isHidden ? (
            <Tooltip title={textForKey('Restore')}>
              <IconButton className={styles.iconButton} onClick={handleRestoreUser}>
                <IconRefresh fill='#00E987'/>
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title={textForKey('Delete')}>
              <IconButton className={styles.iconButton} onClick={handleDeleteUser}>
                <IconDelete fill="#ec3276"/>
              </IconButton>
            </Tooltip>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default UserItem;

UserItem.propTypes = {
  isInviting: PropTypes.bool,
  isInvitation: PropTypes.bool,
  user: PropTypes.shape({
    id: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    phoneNumber: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
    roleInClinic: PropTypes.string,
    status: PropTypes.string,
    isHidden: PropTypes.bool,
    canRegisterPayments: PropTypes.bool,
    showInCalendar: PropTypes.bool,
    accessBlocked: PropTypes.bool,
  }).isRequired,
  onResend: PropTypes.func,
  onDelete: PropTypes.func,
  onRestore: PropTypes.func,
  onEdit: PropTypes.func,
  onCashierChange: PropTypes.func,
  onCalendarChange: PropTypes.func,
  onAccessToggle: PropTypes.func,
};

UserItem.defaultProps = {
  onDelete: () => null,
  onEdit: () => null,
  onCashierChange: () => null,
  isInvitation: false,
};
