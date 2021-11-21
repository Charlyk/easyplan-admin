import React, { useMemo, useRef, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import moment from 'moment-timezone';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import EASImage from 'app/components/common/EASImage';
import InvoicesButton from 'app/components/dashboard/InvoicesButton';
import IconAvatar from 'app/components/icons/iconAvatar';
import IconEdit from 'app/components/icons/iconEdit';
import IconMore from 'app/components/icons/iconMore';
import IconNotifications from 'app/components/icons/iconNotifications';
import IconPlus from 'app/components/icons/iconPlus';
import IconTurnOff from 'app/components/icons/iconTurnOff';
import areComponentPropsEqual from 'app/utils/areComponentPropsEqual';
import { Role } from 'app/utils/constants';
import { textForKey } from 'app/utils/localization';
import { setPaymentModal } from 'redux/actions/actions';
import { updateHourIndicatorPositionSelector } from 'redux/selectors/rootSelector';
import styles from './PageHeader.module.scss';

const ActionsSheet = dynamic(() => import('../../ActionsSheet'));

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
  user,
  currentClinic,
}) => {
  const dispatch = useDispatch();
  const actionsAnchor = useRef(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const updateHourIndicator = useSelector(updateHourIndicatorPositionSelector);

  const userClinic = useMemo(() => {
    return user.clinics.find((item) => item.clinicId === currentClinic.id);
  }, [user, currentClinic]);

  const canRegisterPayments = useMemo(() => {
    return userClinic.canRegisterPayments;
  }, [userClinic]);

  const currentTime = useMemo(() => {
    return moment().format('HH:mm').split(':');
  }, [updateHourIndicator]);

  const handleActionsClose = () => setIsActionsOpen(false);

  const handleActionsOpen = () => setIsActionsOpen(true);

  const handleOpenPaymentModal = () =>
    dispatch(
      setPaymentModal({
        open: true,
        isNew: true,
        invoice: null,
        schedule: null,
      }),
    );

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
          <InvoicesButton currentUser={user} currentClinic={currentClinic} />
          <Tooltip title={textForKey('Add payment')}>
            <IconButton
              classes={{ root: styles.addInvoiceBtn }}
              onClick={handleOpenPaymentModal}
            >
              <IconPlus fill='#3A83DC' />
            </IconButton>
          </Tooltip>
        </div>
      )}
      <div className={styles.actions}>
        <IconButton className={styles.notifications}>
          <IconNotifications />
        </IconButton>
        <div className={styles.timeWrapper}>
          <Typography className={styles.dateLabel}>
            {moment().format('DD MMM YYYY')}
          </Typography>
          <Typography className={styles.timeLabel}>
            {currentTime[0]}
            <span className={styles.timeSeparator}>:</span>
            {currentTime[1]}
          </Typography>
        </div>
        <div className={styles.avatarContainer}>
          <EASImage
            enableLoading
            src={user.avatar}
            className={styles.avatarImage}
            placeholder={<IconAvatar />}
          />
        </div>
        <IconButton
          ref={actionsAnchor}
          className={styles.notifications}
          onClick={handleActionsOpen}
        >
          <IconMore />
        </IconButton>
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
        roleInClinic: PropTypes.oneOf([
          Role.doctor,
          Role.manager,
          Role.reception,
          Role.admin,
        ]),
        canRegisterPayments: PropTypes.bool,
        services: PropTypes.arrayOf(PropTypes.object),
      }),
    ),
  }),
  onSearch: PropTypes.func,
  onLogout: PropTypes.func,
  onEditProfile: PropTypes.func,
};

PageHeader.defaultProps = {
  onEditProfile: () => null,
};
