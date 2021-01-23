import React, { useRef, useState } from 'react';

import './styles.scss';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Button, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import IconAvatar from '../../assets/icons/iconAvatar';
import IconEdit from '../../assets/icons/iconEdit';
import IconMore from '../../assets/icons/iconMore';
import IconNotifications from '../../assets/icons/iconNotifications';
import IconTurnOff from '../../assets/icons/iconTurnOff';
import { setIsExchangeRatesModalOpen } from '../../redux/actions/exchangeRatesActions';
import { clinicDetailsSelector } from '../../redux/selectors/clinicSelector';
import { userSelector } from '../../redux/selectors/rootSelector';
import { textForKey } from '../../utils/localization';
import ActionsSheet from '../ActionsSheet';
import InvoicesButton from '../InvoicesButton';

const actions = [
  {
    name: textForKey('Edit profile'),
    key: 'edit-profile',
    icon: <IconEdit />,
    type: 'default',
  },
  {
    name: textForKey('Logout'),
    key: 'log-out',
    icon: <IconTurnOff />,
    type: 'destructive',
  },
];

const PageHeader = ({
  title,
  titleComponent,
  isDoctor,
  onLogout,
  onEditProfile,
}) => {
  const dispatch = useDispatch();
  const actionsAnchor = useRef(null);
  const user = useSelector(userSelector);
  const currentClinic = useSelector(clinicDetailsSelector);
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const handleActionsClose = () => setIsActionsOpen(false);

  const handleActionsOpen = () => setIsActionsOpen(true);

  const handleActionSelected = action => {
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
    <div className='page-header'>
      <ActionsSheet
        onClose={handleActionsClose}
        onSelect={handleActionSelected}
        open={isActionsOpen}
        actions={actions.filter(item => isDoctor || item.key === 'log-out')}
        anchorEl={actionsAnchor.current}
        placement='bottom-end'
      />
      <div
        className='page-header__title'
        style={{ marginTop: titleComponent != null ? 0 : '0.5rem' }}
      >
        {titleComponent || title}
      </div>
      {!isDoctor && <InvoicesButton />}
      <div className='page-header__actions'>
        {!isDoctor && (
          <Button
            onClick={handleOpenExchangeRatesModal}
            className={clsx('exchange-rate-btn', {
              upcoming: currentClinic.updateExchangeRates,
            })}
            variant='outline-primary'
          >
            {textForKey('Exchange rate')}
          </Button>
        )}
        <div className='page-header__notifications'>
          <IconNotifications />
        </div>
        <div className='avatar-container'>
          {user?.avatar ? (
            <Image roundedCircle className='avatar-image' src={user.avatar} />
          ) : (
            <IconAvatar />
          )}
        </div>
        <div
          role='button'
          tabIndex={0}
          onClick={handleActionsOpen}
          className='page-header__notifications'
          ref={actionsAnchor}
        >
          <IconMore />
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
  }),
  onSearch: PropTypes.func,
  onLogout: PropTypes.func,
  onEditProfile: PropTypes.func,
};

PageHeader.defaultProps = {
  onLogout: () => null,
  onEditProfile: () => null,
};
