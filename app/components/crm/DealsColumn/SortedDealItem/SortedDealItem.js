import React, { useMemo } from "react";
import PropTypes from 'prop-types';
import Typography from "@material-ui/core/Typography";
import moment from "moment-timezone";

import { textForKey } from "../../../../../utils/localization";
import styles from "./SortedDealItem.module.scss";

const SortedDealItem = ({ deal }) => {
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

  const assigneeName = useMemo(() => {
    if (deal.assignedTo == null) {
      return textForKey('Not assigned');
    }
    return `${deal.assignedTo.firstName} ${deal.assignedTo.lastName}`
  }, [deal.assignedTo]);

  return (
    <div className={styles.sortedDealItem}>
      <div className={styles.content}>
        <Typography className={styles.sourceLabel}>
          {personName},
          <a
            href={`tel:${deal.patient.phoneWithCode.replace('+', '')}`}
            style={{ marginLeft: '3px' }}
          >
            {deal.patient.phoneWithCode}
          </a>
        </Typography>
        <Typography noWrap className={styles.contactName}>
          {deal.messageSnippet}
        </Typography>
        <Typography noWrap className={styles.assigneeName}>
          {assigneeName}
        </Typography>
        <div className={styles.lastMessageContainer}>
          <Typography noWrap className={styles.snippetLabel}>
            {deal.source}
          </Typography>
          {deal.sourceDescription && (
            <Typography noWrap className={styles.snippetLabel}>
              {deal.sourceDescription}
            </Typography>
          )}
        </div>
      </div>
      <Typography className={styles.dateLabel}>
        {moment(deal.lastUpdated).format('DD MMM YYYY HH:mm')}
      </Typography>
    </div>
  )
};

export default SortedDealItem;

SortedDealItem.propTypes = {
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
}
