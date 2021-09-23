import React, { useMemo } from "react";
import clsx from "clsx";
import PropTypes from 'prop-types';
import moment from "moment-timezone";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { textForKey } from "../../../../../utils/localization";
import IconFacebookSm from "../../../icons/iconFacebookSm";
import IconAvatar from "../../../icons/iconAvatar";
import IconLink from "../../../icons/iconLink";
import styles from './UnsortedDealItem.module.scss';
import IconTrash from "../../../icons/iconTrash";
import IconCheckMark from "../../../icons/iconCheckMark";

const UnsortedDealItem = ({ deal, onLinkPatient, onDeleteDeal }) => {
  const sourceIcon = useMemo(() => {
    return (
      <IconFacebookSm/>
    )
  }, [deal]);

  const handleLinkPatient = () => {
    onLinkPatient?.(deal.contact);
  }

  const handleDeleteDeal = () => {
    onDeleteDeal?.(deal);
  }

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
        <Box display="flex" alignItems="center" mt="6px">
          {deal.patient == null && (
            <Button className={styles.iconButton} onPointerUp={handleLinkPatient}>
              <IconLink fill="#3A83DC"/>
              <Typography className={styles.buttonText}>
                {textForKey('link_patient')}
              </Typography>
            </Button>
          )}
          <Button className={styles.iconButton} onPointerUp={handleDeleteDeal}>
            <IconTrash fill="#ec3276" />
            <Typography className={clsx(styles.buttonText, styles.delete)}>
              {textForKey('Delete')}
            </Typography>
          </Button>
          <Button className={styles.iconButton}>
            <IconCheckMark fill="#00ac00" />
            <Typography className={clsx(styles.buttonText, styles.done)}>
              {textForKey('complete_deal')}
            </Typography>
          </Button>
        </Box>
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
    }),
    patient: PropTypes.any,
  }),
  onLinkPatient: PropTypes.func,
  onDeleteDeal: PropTypes.func,
};
