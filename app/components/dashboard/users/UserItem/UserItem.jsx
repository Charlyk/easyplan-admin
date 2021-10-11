import React from 'react';
import clsx from 'clsx';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import upperFirst from 'lodash/upperFirst';
import PropTypes from 'prop-types';

import { Role } from '../../../../utils/constants';
import urlToLambda from '../../../../utils/urlToLambda';
import { textForKey } from '../../../../utils/localization';
import IconAvatar from '../../../icons/iconAvatar';
import IconDelete from '../../../icons/iconDelete';
import IconEdit from '../../../icons/iconEdit';
import IconEmail from '../../../icons/iconEmail';
import IconPhone from '../../../icons/iconPhone';
import IconRefresh from '../../../icons/iconRefresh';
import LoadingButton from '../../../common/LoadingButton';
import SwitchButton from "../../../common/SwitchButton";
import styles from './UserItem.module.scss';

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
            <div className={styles.avatar}>
              {user.avatar ? (
                <img
                  alt="Avatar"
                  className={styles.avatar}
                  src={urlToLambda(user.avatar)}
                />
              ) : (
                <IconAvatar/>
              )}
            </div>
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
            <Button
              variant="outlined"
              classes={{
                root: styles.editBtn,
                outlined: styles.outlinedBtnBlue,
                label: styles.buttonLabel,
              }}
              onClick={handleEditUser}
            >
              {textForKey('Edit')} <IconEdit/>
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
              variant="outlined"
              classes={{
                root: styles.restoreBtn,
                outlined: styles.outlinedBtnGreen,
                label: styles.buttonLabel,
              }}
              onClick={handleRestoreUser}
            >
              {textForKey('Restore')} <IconRefresh fill='#00E987'/>
            </Button>
          ) : (
            <Button
              variant="outlined"
              onClick={handleDeleteUser}
              classes={{
                root: styles.deleteBtn,
                outlined: styles.outlinedBtnRed,
                label: styles.buttonLabel,
              }}
            >
              {textForKey('Delete')} <IconDelete/>
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
