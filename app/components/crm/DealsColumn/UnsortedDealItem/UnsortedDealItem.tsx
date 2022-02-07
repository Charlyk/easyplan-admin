import React, { useMemo, useRef, useState } from 'react';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import IconPhone from '@material-ui/icons/PhoneCallback';
import moment from 'moment-timezone';
import { useSelector } from 'react-redux';
import ActionsSheet from 'app/components/common/ActionsSheet';
import ClinicsModal from 'app/components/common/modals/ClinicsModal';
import IconAvatar from 'app/components/icons/iconAvatar';
import IconFacebookSm from 'app/components/icons/iconFacebookSm';
import IconLink from 'app/components/icons/iconLink';
import areComponentPropsEqual from 'app/utils/areComponentPropsEqual';
import { textForKey } from 'app/utils/localization';
import onRequestError from 'app/utils/onRequestError';
import { requestChangeDealClinic } from 'middleware/api/crm';
import { currentClinicSelector } from 'redux/selectors/appDataSelector';
import { CrmDealListItemType } from 'types';
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

interface UnsortedDealItemProps {
  deal: CrmDealListItemType;
  onLinkPatient?: (deal: CrmDealListItemType) => void;
  onDeleteDeal?: (deal: CrmDealListItemType) => void;
  onConfirmFirstContact?: (deal: CrmDealListItemType) => void;
  onDealClick?: (deal: CrmDealListItemType) => void;
}

const UnsortedDealItem: React.FC<UnsortedDealItemProps> = ({
  deal,
  onLinkPatient,
  onDeleteDeal,
  onConfirmFirstContact,
  onDealClick,
}) => {
  const currentClinic = useSelector(currentClinicSelector);
  const moreBtnRef = useRef(null);
  const [showActions, setShowActions] = useState(false);
  const [clinicsModal, setClinicsModal] = useState(false);

  const sourceIcon = useMemo(() => {
    switch (deal.source) {
      case 'PhoneCall':
        return <IconPhone className={styles.iconFill} />;
      default:
        return <IconFacebookSm />;
    }
  }, [deal]);

  const contactName = useMemo(() => {
    if (deal == null || deal?.contactName == null) {
      return '-';
    }
    return deal.source === 'PhoneCall'
      ? deal?.contactName.startsWith('+')
        ? deal?.contactName
        : `${deal?.contactName}`
      : deal?.contactName;
  }, [deal]);

  const filteredActions = useMemo(() => {
    return actions.filter((action) => {
      return deal?.patientId == null || action.key !== 'linkPatient';
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
        {deal.contactPhoto ? (
          <img src={deal.contactPhoto} alt={deal.contactName} />
        ) : (
          <IconAvatar />
        )}
        <div className={styles.sourceIconContainer}>{sourceIcon}</div>
      </div>
      <div className={styles.content}>
        <Typography className={styles.sourceLabel}>
          {textForKey('from')}: {textForKey(deal.source)} -{' '}
          {textForKey(deal.sourceDescription)}
        </Typography>
        <Typography className={styles.contactName}>
          {contactName}{' '}
          {deal?.patientId != null && (
            <>
              <IconLink fill='#3A83DC' /> {deal.patientName}
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
      </div>
      <div className={styles.actionsContainer}>
        <Typography className={styles.dateLabel}>
          {moment(deal.updated).format('DD MMM YYYY HH:mm')}
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
