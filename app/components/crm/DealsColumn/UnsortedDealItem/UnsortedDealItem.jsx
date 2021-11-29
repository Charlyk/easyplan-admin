import React, { useMemo, useRef, useState } from 'react';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import IconPhone from '@material-ui/icons/PhoneCallback';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import ClinicsModal from 'app/components/common/modals/ClinicsModal';
import IconAvatar from 'app/components/icons/iconAvatar';
import IconFacebookSm from 'app/components/icons/iconFacebookSm';
import IconLink from 'app/components/icons/iconLink';
import areComponentPropsEqual from 'app/utils/areComponentPropsEqual';
import getPatientName from 'app/utils/getPatientName';
import { textForKey } from 'app/utils/localization';
import { requestChangeDealClinic } from 'middleware/api/crm';
import onRequestError from 'app/utils/onRequestError';
import ActionsSheet from 'app/components/common/ActionsSheet';
import styles from './UnsortedDealItem.module.scss';

const actions = [
  {
    name: textForKey('link_patient'),
    key: 'linkPatient',
    icon: null,
    type: 'default',
  },
  {
    name: textForKey('crm_move_to_clinic'),
    key: 'changeClinic',
    icon: null,
    type: 'default',
  },
  {
    name: textForKey('complete_deal'),
    key: 'confirmContact',
    icon: null,
    type: 'default',
  },
  {
    name: textForKey('delete'),
    key: 'deleteDeal',
    icon: null,
    type: 'destructive',
  },
];

const UnsortedDealItem = ({
  deal,
  currentClinic,
  onLinkPatient,
  onDeleteDeal,
  onConfirmFirstContact,
  onDealClick,
}) => {
  const moreBtnRef = useRef(null);
  const [showActions, setShowActions] = useState(false);
  const [clinicsModal, setClinicsModal] = useState(false);
  const hasTags = deal.patient?.tags?.length > 0;

  const sourceIcon = useMemo(() => {
    switch (deal.source) {
      case 'PhoneCall':
        return <IconPhone className={styles.iconFill} />;
      default:
        return <IconFacebookSm />;
    }
  }, [deal]);

  const personName = useMemo(() => {
    if (deal?.patient == null) {
      return deal?.contact?.name || '-';
    }
    const { patient } = deal;
    return getPatientName(patient);
  }, [deal]);

  const contactName = useMemo(() => {
    if (deal == null || deal?.contact == null) {
      return '-';
    }
    return deal.source === 'PhoneCall'
      ? deal?.contact?.name.startsWith('+')
        ? deal?.contact?.name
        : `+${deal?.contact?.name}`
      : deal?.contact?.name;
  }, [deal]);

  const filteredActions = useMemo(() => {
    return actions.filter((action) => {
      return deal?.patient == null || action.key !== 'linkPatient';
    });
  }, [deal]);

  const handleActionsSelected = (action) => {
    switch (action.key) {
      case 'linkPatient':
        handleLinkPatient();
        break;
      case 'confirmContact':
        handleConfirmFirstContact();
        break;
      case 'deleteDeal':
        handleDeleteDeal();
        break;
      case 'changeClinic':
        handleChangeDealClinic();
        break;
    }
    handleCloseActions();
  };

  const handleChangeDealClinic = async () => {
    setClinicsModal(true);
  };

  const handleCloseClinics = () => {
    setClinicsModal(false);
  };

  const handleSelectClinic = async (clinic) => {
    try {
      handleCloseClinics();
      await requestChangeDealClinic(deal.id, clinic.id);
    } catch (error) {
      onRequestError(error);
    }
  };

  const handleMoreClick = (event) => {
    event.stopPropagation();
    setShowActions(true);
  };

  const handleCloseActions = () => {
    setShowActions(false);
  };

  const handleLinkPatient = () => {
    onLinkPatient?.(deal);
  };

  const handleDeleteDeal = () => {
    onDeleteDeal?.(deal);
  };

  const handleConfirmFirstContact = () => {
    onConfirmFirstContact?.(deal);
  };

  const handleDealClick = () => {
    onDealClick?.(deal);
  };

  return (
    <Box className={styles.unsortedDealItem} onClick={handleDealClick}>
      <ClinicsModal
        open={clinicsModal}
        currentClinicId={currentClinic.id}
        onClose={handleCloseClinics}
        onSelect={handleSelectClinic}
      />
      <ActionsSheet
        open={showActions}
        anchorEl={moreBtnRef.current}
        actions={filteredActions}
        onSelect={handleActionsSelected}
        onClose={handleCloseActions}
      />
      <div className={styles.avatarContainer}>
        <IconAvatar />
        <div className={styles.sourceIconContainer}>{sourceIcon}</div>
      </div>
      <div className={styles.content}>
        <Typography className={styles.sourceLabel}>
          {textForKey('from')}: {textForKey(deal.source)}
        </Typography>
        <Typography className={styles.contactName}>
          {contactName}{' '}
          {deal?.patient != null && (
            <>
              <IconLink fill='#3A83DC' /> {personName}
            </>
          )}
        </Typography>
        {deal.messageSnippet && (
          <div className={styles.lastMessageContainer}>
            <Typography noWrap className={styles.snippetLabel}>
              {deal.messageSnippet}
            </Typography>
          </div>
        )}
        {hasTags && (
          <div className={styles.tagsContainer}>
            {deal.patient.tags.map((tag) => (
              <Chip
                size='small'
                variant='outlined'
                label={tag.title}
                key={tag.id}
                classes={{
                  root: styles.tagItem,
                  label: styles.label,
                  outlined: styles.outlined,
                }}
              />
            ))}
          </div>
        )}
      </div>
      <div className={styles.actionsContainer}>
        <Typography className={styles.dateLabel}>
          {moment(deal.lastUpdated).format('DD MMM YYYY HH:mm')}
        </Typography>
        <IconButton
          ref={moreBtnRef}
          className={styles.moreBtn}
          onClick={handleMoreClick}
        >
          <MoreHorizIcon />
        </IconButton>
      </div>
    </Box>
  );
};

export default React.memo(UnsortedDealItem, areComponentPropsEqual);

UnsortedDealItem.propTypes = {
  currentClinic: PropTypes.any,
  deal: PropTypes.shape({
    id: PropTypes.number,
    created: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    lastUpdated: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    messageSnippet: PropTypes.string,
    source: PropTypes.string,
    sourceDescription: PropTypes.string,
    contact: PropTypes.shape({
      id: PropTypes.number,
      email: PropTypes.string,
      name: PropTypes.string,
      phoneNumber: PropTypes.string,
      photoUrl: PropTypes.string,
    }),
    patient: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      phoneWithCode: PropTypes.string,
      tags: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          title: PropTypes.string,
        }),
      ),
    }),
    state: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      color: PropTypes.string,
      orderId: PropTypes.number,
      deleteable: PropTypes.bool,
      type: PropTypes.string,
    }),
    assignedTo: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
    service: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      price: PropTypes.number,
      currency: PropTypes.string,
    }),
    schedule: PropTypes.shape({
      id: PropTypes.number,
      created: PropTypes.string,
      dateAndTime: PropTypes.string,
      endTime: PropTypes.string,
      canceledReason: PropTypes.string,
      doctor: PropTypes.shape({
        id: PropTypes.number,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
      }),
    }),
    movedToClinic: PropTypes.shape({
      id: PropTypes.number,
      clinicName: PropTypes.string,
    }),
  }),
  onLinkPatient: PropTypes.func,
  onDeleteDeal: PropTypes.func,
  onConfirmFirstContact: PropTypes.func,
  onDealClick: PropTypes.func,
};
