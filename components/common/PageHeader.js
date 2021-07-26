import React, { useRef, useState } from 'react';

import { IconButton, Tooltip } from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Button, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import IconAvatar from '../icons/iconAvatar';
import IconEdit from '../icons/iconEdit';
import IconMore from '../icons/iconMore';
import IconNotifications from '../icons/iconNotifications';
import IconPlus from '../icons/iconPlus';
import IconTurnOff from '../icons/iconTurnOff';
import { setPaymentModal } from '../../redux/actions/actions';
import { setIsExchangeRatesModalOpen } from '../../redux/actions/exchangeRatesActions';
import { textForKey } from '../../utils/localization';
import ActionsSheet from './ActionsSheet';
import InvoicesButton from '../../app/components/dashboard/InvoicesButton';
import styles from '../../styles/PageHeader.module.scss';
import { isExchangeRatesUpdateRequiredSelector } from "../../redux/selectors/clinicSelector";
import { Role } from "../../app/utils/constants";

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
  const isExchangeUpdateRequired = useSelector(isExchangeRatesUpdateRequiredSelector);
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

  const handleOpenExchangeRatesModal = () => {
    dispatch(setIsExchangeRatesModalOpen(true));
  };

  return (
    <div className={styles['page-header']}>
      <ActionsSheet
        onClose={handleActionsClose}
        onSelect={handleActionSelected}
        open={isActionsOpen}
        actions={actions.filter((item) => isDoctor || item.key === 'log-out')}
        anchorEl={actionsAnchor.current}
        placement='bottom-end'
      />
      <div
        className={styles['page-header__title']}
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
              classes={{ root: styles['add-invoice-btn'] }}
              onClick={handleOpenPaymentModal}
            >
              <IconPlus fill='#3A83DC'/>
            </IconButton>
          </Tooltip>
        </div>
      )}
      <div className={styles['page-header__actions']}>
        {!isDoctor && canRegisterPayments && (
          <Button
            onClick={handleOpenExchangeRatesModal}
            className={clsx(styles['exchange-rate-btn'], {
              [styles.upcoming]: isExchangeUpdateRequired,
            })}
            variant='outline-primary'
          >
            {textForKey('Exchange rate')}
          </Button>
        )}
        <div className={styles['page-header__notifications']}>
          <IconNotifications/>
        </div>
        <div className={styles['avatar-container']}>
          {user?.avatar ? (
            <Image roundedCircle className={styles['avatar-image']} src={user.avatar}/>
          ) : (
            <IconAvatar/>
          )}
        </div>
        <div
          role='button'
          tabIndex={0}
          onClick={handleActionsOpen}
          className={styles['page-header__notifications']}
          ref={actionsAnchor}
        >
          <IconMore/>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;

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
