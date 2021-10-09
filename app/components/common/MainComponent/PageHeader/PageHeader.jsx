import React, { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import Image from 'next/image';
import { useDispatch } from 'react-redux';

import IconAvatar from '../../../icons/iconAvatar';
import IconEdit from '../../../icons/iconEdit';
import IconMore from '../../../icons/iconMore';
import IconNotifications from '../../../icons/iconNotifications';
import IconPlus from '../../../icons/iconPlus';
import IconTurnOff from '../../../icons/iconTurnOff';
import { setPaymentModal } from '../../../../../redux/actions/actions';
import { textForKey } from '../../../../utils/localization';
import InvoicesButton from '../../../dashboard/InvoicesButton';
import { Role } from "../../../../utils/constants";
import areComponentPropsEqual from "../../../../utils/areComponentPropsEqual";
import styles from './PageHeader.module.scss';

const ActionsSheet = dynamic(() => import('../../ActionsSheet'));

const actions = [
  {
    name: textForKey('Edit profile'),
    key: 'edit-profile',
    icon: <IconEdit/>,
    type: 'default',
  },
  {
    name: textForKey('Logout'),
    key: 'log-out',
    icon: <IconTurnOff/>,
    type: 'destructive',
  },
];

const PageHeader = (
  {
    title,
    titleComponent,
    isDoctor,
    onLogout,
    onEditProfile,
    user,
    currentClinic,
  }
) => {
  const dispatch = useDispatch();
  const actionsAnchor = useRef(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const userClinic = user.clinics.find(item => item.clinicId === currentClinic.id);
  const { canRegisterPayments } = userClinic;

  const handleActionsClose = () => setIsActionsOpen(false);

  const handleActionsOpen = () => setIsActionsOpen(true);

  const handleOpenPaymentModal = () =>
    dispatch(setPaymentModal({ open: true, isNew: true, invoice: null, schedule: null }));

  const handleActionSelected = (action) => {
    switch (action.key) {
      case 'log-out':
        onLogout();
        break;
      case 'edit-profile':
        onEditProfile();
        break;
    }
    setIsActionsOpen(false);
  };

  return (
    <div className={styles.pageHeader}>
      <ActionsSheet
        onClose={handleActionsClose}
        onSelect={handleActionSelected}
        open={isActionsOpen}
        actions={actions.filter((item) => isDoctor || item.key === 'log-out')}
        anchorEl={actionsAnchor.current}
        placement='bottom-end'
      />
      <div
        className={styles.title}
        style={{ marginTop: titleComponent != null ? 0 : '0.5rem' }}
      >
        {titleComponent || title}
      </div>
      {!isDoctor && canRegisterPayments && (
        <div className={styles.invoicesBtnWrapper}>
          <InvoicesButton
            currentUser={user}
            currentClinic={currentClinic}
          />
          <Tooltip title={textForKey('Add payment')}>
            <IconButton
              classes={{ root: styles.addInvoiceBtn }}
              onClick={handleOpenPaymentModal}
            >
              <IconPlus fill='#3A83DC'/>
            </IconButton>
          </Tooltip>
        </div>
      )}
      <div className={styles.actions}>
        <div className={styles.notifications}>
          <IconNotifications/>
        </div>
        <div className={styles.avatarContainer}>
          {user?.avatar ? (
            <img
              alt='Avatar'
              className={styles.avatarImage}
              src={user.avatar}
            />
          ) : (
            <IconAvatar/>
          )}
        </div>
        <div
          role='button'
          tabIndex={0}
          onClick={handleActionsOpen}
          className={styles.notifications}
          ref={actionsAnchor}
        >
          <IconMore/>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PageHeader, areComponentPropsEqual);

PageHeader.propTypes = {
  title: PropTypes.string,
  showLogo: PropTypes.bool,
  titleComponent: PropTypes.element,
  isDoctor: PropTypes.bool,
  user: PropTypes.shape({
    id: PropTypes.number,
    avatar: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    username: PropTypes.string,
    clinics: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        clinicName: PropTypes.string,
        clinicId: PropTypes.number,
        roleInClinic: PropTypes.oneOf([Role.doctor, Role.manager, Role.reception, Role.admin]),
        canRegisterPayments: PropTypes.bool,
        services: PropTypes.arrayOf(PropTypes.object)
      })
    )
  }),
  onSearch: PropTypes.func,
  onLogout: PropTypes.func,
  onEditProfile: PropTypes.func,
};

PageHeader.defaultProps = {
  onEditProfile: () => null,
};
