import React, { useMemo } from "react";
import PropTypes from 'prop-types';
import styles from './UnsortedDealItem.module.scss';
import Typography from "@material-ui/core/Typography";
import { textForKey } from "../../../../../utils/localization";
import moment from "moment-timezone";
import IconAvatar from "../../../icons/iconAvatar";
import IconFacebookSm from "../../../icons/iconFacebookSm";

const UnsortedDealItem = ({ deal }) => {
  const sourceIcon = useMemo(() => {
    return (
      <IconFacebookSm/>
    )
  }, [deal]);

  return (
    <div className={styles.unsortedDealItem}>
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
          {deal.contact.name}
        </Typography>
        <div className={styles.lastMessageContainer}>
          <Typography noWrap className={styles.snippetLabel}>
            {deal.messageSnippet}
          </Typography>
        </div>
      </div>
      <Typography className={styles.dateLabel}>
        {moment(deal.created).format('DD MMM YYYY HH:mm')}
      </Typography>
    </div>
  )
};

export default UnsortedDealItem;

UnsortedDealItem.propTypes = {
  deal: PropTypes.shape({
    id: PropTypes.number,
    created: PropTypes.string,
    lastUpdated: PropTypes.string,
    messageSnippet: PropTypes.string,
    source: PropTypes.string,
    contact: PropTypes.shape({
      id: PropTypes.number,
      email: PropTypes.string,
      name: PropTypes.string,
      phoneNumber: PropTypes.string,
      photoUrl: PropTypes.string
    })
  })
};
