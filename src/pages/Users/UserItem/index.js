import React from 'react';

import { Box, TableCell, TableRow, Typography } from '@material-ui/core';
import clsx from 'clsx';
import upperFirst from 'lodash/upperFirst';
import PropTypes from 'prop-types';
import { Button, Image } from 'react-bootstrap';

import IconAvatar from '../../../../components/icons/iconAvatar';
import IconDelete from '../../../../components/icons/iconDelete';
import IconEdit from '../../../../components/icons/iconEdit';
import IconEmail from '../../../../components/icons/iconEmail';
import IconPhone from '../../../../components/icons/iconPhone';
import IconRefresh from '../../../../components/icons/iconRefresh';
import LoadingButton from '../../../../components/LoadingButton';
import { Role } from '../../../../utils/constants';
import { urlToLambda } from '../../../../utils/helperFuncs';
import { textForKey } from '../../../../utils/localization';
import styles from './UserItem.module.scss';

const UserItem = ({
  user,
  isInvitation,
  isInviting,
  onDelete,
  onEdit,
  onResend,
  onRestore,
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

  const rootClasses = clsx(styles['user-item'], user.isHidden ? styles.fired : styles.active);

  return (
    <TableRow classes={{ root: rootClasses }}>
      {!isInvitation && (
        <TableCell
          valign='middle'
          classes={{ root: styles['user-item__name-and-avatar'] }}
        >
          <Box height='100%' display='flex' alignItems='center'>
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
          </Box>
        </TableCell>
      )}
      {!isInvitation && (
        <TableCell valign='middle' classes={{ root: styles['user-item__contact'] }}>
          <Box display='flex' alignItems='center'>
            <IconPhone />
            <Typography classes={{ root: styles['contact-label'] }}>
              {user.phoneNumber
                ? user.phoneNumber
                : textForKey('No phone number')}
            </Typography>
          </Box>
        </TableCell>
      )}
      <TableCell
        valign='middle'
        colSpan={isInvitation ? 3 : 1}
        classes={{ root: styles['user-item__contact'] }}
      >
        <Box display='flex' alignItems='center'>
          <IconEmail />
          <Typography classes={{ root: styles['contact-label'] }}>
            {user.email}
          </Typography>
        </Box>
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
  }).isRequired,
  onResend: PropTypes.func,
  onDelete: PropTypes.func,
  onRestore: PropTypes.func,
  onEdit: PropTypes.func,
};

UserItem.defaultProps = {
  onDelete: () => null,
  onEdit: () => null,
  onResend: () => null,
  onRestore: () => null,
  isInvitation: false,
};
