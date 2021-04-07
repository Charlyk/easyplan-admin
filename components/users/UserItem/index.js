import React from 'react';

import { TableCell, TableRow, Typography } from '@material-ui/core';
import clsx from 'clsx';
import upperFirst from 'lodash/upperFirst';
import PropTypes from 'prop-types';
import { Button, Image } from 'react-bootstrap';

import IconAvatar from '../../icons/iconAvatar';
import IconDelete from '../../icons/iconDelete';
import IconEdit from '../../icons/iconEdit';
import IconEmail from '../../icons/iconEmail';
import IconPhone from '../../icons/iconPhone';
import IconRefresh from '../../icons/iconRefresh';
import LoadingButton from '../../common/LoadingButton';
import { Role } from '../../../utils/constants';
import { urlToLambda } from '../../../utils/helperFuncs';
import { textForKey } from '../../../utils/localization';
import styles from '../../../styles/UserItem.module.scss';
import SwitchButton from "../../common/SwitchButton";

const UserItem = ({
  user,
  isInvitation,
  isInviting,
  onDelete,
  onEdit,
  onResend,
  onRestore,
  onCashierChange,
}) => {
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

  const rootClasses = clsx(styles['user-item'], user.isHidden ? styles.fired : styles.active);

  return (
    <TableRow classes={{ root: rootClasses }}>
      {!isInvitation && (
        <TableCell
          valign='middle'
          classes={{ root: styles['user-item__name-and-avatar'] }}
        >
          <div className={styles.flexContainer} style={{ height: '100%' }}>
            <div
              className={clsx(
                styles['status-indicator'],
                user.isHidden ? styles.fired : styles.active,
              )}
            />
            <div className={styles['user-item__avatar']}>
              {user.avatar ? (
                <Image
                  className={styles['user-item__avatar']}
                  roundedCircle
                  src={urlToLambda(user.avatar)}
                />
              ) : (
                <IconAvatar />
              )}
            </div>
            <Typography classes={{ root: styles['user-item__name'] }}>
              {upperFirst(user.firstName.toLowerCase())}{' '}
              {upperFirst(user.lastName.toLowerCase())}
            </Typography>
          </div>
        </TableCell>
      )}
      {!isInvitation && (
        <TableCell valign='middle' classes={{ root: styles['user-item__contact'] }}>
          <div className={styles.flexContainer}>
            <IconPhone />
            <Typography classes={{ root: styles['contact-label'] }}>
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
        classes={{ root: styles['user-item__contact'] }}
      >
        <div className={styles.flexContainer}>
          <IconEmail />
          <Typography classes={{ root: styles['contact-label'] }}>
            {user.email}
          </Typography>
        </div>
      </TableCell>
      <TableCell valign='middle'>
        <div className={styles['user-item__action-buttons']}>
          {user.status === 'Pending' ||
            (isInvitation && (
              <LoadingButton
                isLoading={isInviting}
                className={styles['user-item__resend-button']}
                onClick={handleResendInvitation}
              >
                {textForKey('Invite')} <IconRefresh fill='#FDC534' />
              </LoadingButton>
            ))}
          {user.roleInClinic === Role.doctor && !isInvitation && (
            <Button className={styles['user-item__edit-button']} onClick={handleEditUser}>
              {textForKey('Edit')} <IconEdit />
            </Button>
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
          {user.isHidden ? (
            <Button
              className={styles['user-item__restore-button']}
              onClick={handleRestoreUser}
            >
              {textForKey('Restore')} <IconRefresh fill='#00E987' />
            </Button>
          ) : (
            <Button
              className={styles['user-item__delete-button']}
              onClick={handleDeleteUser}
            >
              {textForKey('Delete')} <IconDelete />
            </Button>
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
  }).isRequired,
  onResend: PropTypes.func,
  onDelete: PropTypes.func,
  onRestore: PropTypes.func,
  onEdit: PropTypes.func,
  onCashierChange: PropTypes.func,
};

UserItem.defaultProps = {
  onDelete: () => null,
  onEdit: () => null,
  onCashierChange: () => null,
  isInvitation: false,
};
