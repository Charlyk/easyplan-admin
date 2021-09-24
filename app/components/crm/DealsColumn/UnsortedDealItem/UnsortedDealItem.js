import React, { useMemo, useRef, useState } from "react";
import PropTypes from 'prop-types';
import moment from "moment-timezone";
import Typography from "@material-ui/core/Typography";

import ActionsSheet from "../../../../../components/common/ActionsSheet";
import areComponentPropsEqual from "../../../../utils/areComponentPropsEqual";
import { textForKey } from "../../../../../utils/localization";
import IconFacebookSm from "../../../icons/iconFacebookSm";
import IconAvatar from "../../../icons/iconAvatar";
import styles from './UnsortedDealItem.module.scss';
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import IconButton from "@material-ui/core/IconButton";

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

const UnsortedDealItem = ({ deal, onLinkPatient, onDeleteDeal, onConfirmFirstContact }) => {
  const moreBtnRef = useRef(null);
  const [showActions, setShowActions] = useState(false);

  const sourceIcon = useMemo(() => {
    return (
      <IconFacebookSm/>
    )
  }, [deal]);

  const personName = useMemo(() => {
    if (deal.patient == null) {
      return deal.contact.name;
    }
    const { patient } = deal;
    if (patient.firstName && patient.lastName) {
      return `${patient.firstName} ${patient.lastName}`;
    } else if (patient.firstName && !patient.lastName) {
      return patient.firstName
    } else if (!patient.firstName && patient.lastName) {
      return patient.lastName;
    } else {
      return patient.phoneWithCode;
    }
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

  const handleMoreClick = () => {
    setShowActions(true);
  }

  const handleCloseActions = () => {
    setShowActions(false);
  }

  const handleLinkPatient = () => {
    onLinkPatient?.(deal);
  }

  const handleDeleteDeal = () => {
    onDeleteDeal?.(deal);
  }

  const handleConfirmFirstContact = () => {
    onConfirmFirstContact?.(deal);
  }

  return (
    <div className={styles.unsortedDealItem}>
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
          {textForKey('from')}: {deal.source}
        </Typography>
        <Typography className={styles.contactName}>
          {personName}
        </Typography>
        <div className={styles.lastMessageContainer}>
          <Typography noWrap className={styles.snippetLabel}>
            {deal.messageSnippet}
          </Typography>
        </div>
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
    created: PropTypes.string,
    lastUpdated: PropTypes.string,
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
  }),
  onLinkPatient: PropTypes.func,
  onDeleteDeal: PropTypes.func,
  onConfirmFirstContact: PropTypes.func,
};
