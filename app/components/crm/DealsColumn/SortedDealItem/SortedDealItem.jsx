import React, { useMemo } from 'react';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import getPatientName from 'app/utils/getPatientName';
import { textForKey } from 'app/utils/localization';
import styles from './SortedDealItem.module.scss';

const SortedDealItem = ({ deal, onDealClick }) => {
  const hasTags = deal.patient?.tags.length > 0;

  const personName = useMemo(() => {
    if (deal.patient == null) {
      return deal.contact.name;
    }
    const { patient } = deal;
    return getPatientName(patient);
  }, [deal]);

  const itemTitle = useMemo(() => {
    switch (deal.state.type) {
      case 'FirstContact':
        return deal.messageSnippet;
      case 'Failed':
      case 'Completed':
      case 'Rescheduled':
      case 'Scheduled':
        return deal.service.name;
      case 'Custom':
        if (deal.service != null) {
          return deal.service.name;
        } else {
          return deal.messageSnippet;
        }
    }
  }, [deal]);

  const assigneeName = useMemo(() => {
    if (deal?.assignedTo == null) {
      return textForKey('Not assigned');
    }
    return `${deal.assignedTo.firstName} ${deal.assignedTo.lastName}`;
  }, [deal.assignedTo]);

  const itemResponsible = useMemo(() => {
    if (deal?.schedule != null) {
      const { doctor } = deal.schedule;
      return `${doctor?.firstName} ${doctor?.lastName}`;
    }
    return assigneeName;
  }, [deal, assigneeName]);

  const scheduleTime = useMemo(() => {
    if (deal.schedule == null) {
      return null;
    }
    return moment(deal.schedule.dateAndTime).format('DD MMM YYYY HH:mm');
  }, [deal.schedule]);

  const handleDealClick = () => {
    onDealClick?.(deal);
  };

  return (
    <div className={styles.sortedDealItem} onPointerUp={handleDealClick}>
      <div className={styles.content}>
        <Typography className={styles.sourceLabel}>
          {personName},
          <a
            href={`tel:${deal.patient.phoneWithCode.replace('+', '')}`}
            onPointerUp={(e) => e.stopPropagation()}
            style={{ marginLeft: '3px' }}
          >
            {deal.patient.phoneWithCode}
          </a>
        </Typography>
        <Typography noWrap className={styles.contactName}>
          {itemTitle}
        </Typography>
        {scheduleTime != null && (
          <Typography noWrap className={styles.scheduleTime}>
            {scheduleTime}
          </Typography>
        )}
        {deal?.schedule?.canceledReason != null && (
          <Typography noWrap className={styles.scheduleTime}>
            {deal.schedule.canceledReason}
          </Typography>
        )}
        <Typography noWrap className={styles.assigneeName}>
          {itemResponsible}
        </Typography>
        <div className={styles.lastMessageContainer}>
          <Chip
            size='small'
            variant='outlined'
            label={textForKey(deal.source)}
            classes={{
              root: styles.tagItem,
              label: styles.label,
              outlined: styles.outlined,
            }}
          />
          {deal.sourceDescription && (
            <Chip
              size='small'
              variant='outlined'
              label={deal.sourceDescription}
              classes={{
                root: styles.tagItem,
                label: styles.label,
                outlined: styles.outlined,
              }}
            />
          )}
          {deal?.schedule != null && (
            <Chip
              size='small'
              variant='outlined'
              label={assigneeName}
              classes={{
                root: styles.tagItem,
                label: styles.label,
                outlined: styles.outlined,
              }}
            />
          )}
          {hasTags &&
            deal.patient.tags.map((tag) => (
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
      </div>
      <Typography className={styles.dateLabel}>
        {moment(deal.lastUpdated).format('DD MMM YYYY HH:mm')}
      </Typography>
    </div>
  );
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
    movedToClinic: PropTypes.shape({
      id: PropTypes.number,
      clinicName: PropTypes.string,
    }),
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
  }),
  onDealClick: PropTypes.func,
};
