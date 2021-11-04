import React, { useMemo, useRef, useState } from "react";
import PropTypes from 'prop-types';
import moment from "moment-timezone";
import Typography from "@material-ui/core/Typography";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import IconButton from "@material-ui/core/IconButton";
import IconPhone from '@material-ui/icons/PhoneCallback';

import ActionsSheet from "../../../common/ActionsSheet";
import areComponentPropsEqual from "../../../../utils/areComponentPropsEqual";
import { textForKey } from "../../../../utils/localization";
import getPatientName from "../../../../utils/getPatientName";
import IconFacebookSm from "../../../icons/iconFacebookSm";
import IconAvatar from "../../../icons/iconAvatar";
import IconLink from "../../../icons/iconLink";
import styles from './UnsortedDealItem.module.scss';

const actions = [
  {
    name: textForKey('link_patient'),
    key: 'linkPatient',
    icon: null,
    type: 'default'
  },
  {
    name: textForKey('complete_deal'),
    key: 'confirmContact',
    icon: null,
    type: 'default'
  },
  {
    name: textForKey('delete'),
    key: 'deleteDeal',
    icon: null,
    type: 'destructive'
  },
]

const UnsortedDealItem = (
  {
    deal,
    onLinkPatient,
    onDeleteDeal,
    onConfirmFirstContact,
    onDealClick,
  }
) => {
  const moreBtnRef = useRef(null);
  const [showActions, setShowActions] = useState(false);

  const sourceIcon = useMemo(() => {
    switch (deal.source) {
      case 'PhoneCall':
        return (
          <IconPhone className={styles.iconFill}/>
        )
      default:
        return (
          <IconFacebookSm/>
        );
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
    if (deal == null) {
      return '-'
    }
    return deal.source === 'PhoneCall'
      ? deal.contact.name.startsWith('+')
        ? deal.contact.name
        : `+${deal.contact.name}`
      : deal.contact.name;
  }, [deal]);

  const filteredActions = useMemo(() => {
    return actions.filter(action => {
      return (
        deal?.patient == null || action.key !== 'linkPatient'
      )
    })
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
        handleDeleteDeal()
        break;
    }
    handleCloseActions();
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
    <div className={styles.unsortedDealItem} onPointerUp={handleDealClick}>
      <ActionsSheet
        open={showActions}
        anchorEl={moreBtnRef.current}
        actions={filteredActions}
        onSelect={handleActionsSelected}
        onClose={handleCloseActions}
      />
      <div className={styles.avatarContainer}>
        <IconAvatar/>
        <div className={styles.sourceIconContainer}>
          {sourceIcon}
        </div>
      </div>
      <div className={styles.content}>
        <Typography className={styles.sourceLabel}>
          {textForKey('from')}: {textForKey(deal.source)}
        </Typography>
        <Typography className={styles.contactName}>
          {contactName} {deal?.patient != null && <><IconLink fill="#3A83DC" /> {personName}</>}
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
          {moment(deal.lastUpdated).format('DD MMM YYYY HH:mm')}
        </Typography>
        <IconButton
          ref={moreBtnRef}
          className={styles.moreBtn}
          onPointerUp={handleMoreClick}
        >
          <MoreHorizIcon/>
        </IconButton>
      </div>
    </div>
  )
};

export default React.memo(UnsortedDealItem, areComponentPropsEqual);

UnsortedDealItem.propTypes = {
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
      photoUrl: PropTypes.string
    }),
    patient: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      phoneWithCode: PropTypes.string,
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
  }),
  onLinkPatient: PropTypes.func,
  onDeleteDeal: PropTypes.func,
  onConfirmFirstContact: PropTypes.func,
  onDealClick: PropTypes.func,
};
