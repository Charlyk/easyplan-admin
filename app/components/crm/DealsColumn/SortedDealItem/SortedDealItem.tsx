import React, { useMemo } from 'react';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import moment from 'moment-timezone';
import { textForKey } from 'app/utils/localization';
import { CrmDealListItemType, DealStateType } from 'types';
import styles from './SortedDealItem.module.scss';

interface SortedDealItemProps {
  deal: CrmDealListItemType;
  onDealClick?: (deal: CrmDealListItemType) => void;
}

const SortedDealItem: React.FC<SortedDealItemProps> = ({
  deal,
  onDealClick,
}) => {
  // const hasTags = false;
  const personName = deal.patientName;

  const itemTitle = useMemo(() => {
    switch (deal.stateType) {
      case DealStateType.FirstContact:
        return deal.messageSnippet;
      case DealStateType.Failed:
      case DealStateType.Completed:
      case DealStateType.Rescheduled:
      case DealStateType.Scheduled:
        return deal.serviceName;
      case DealStateType.Custom:
        if (deal.serviceName != null) {
          return deal.serviceName;
        } else {
          return deal.messageSnippet;
        }
    }
  }, [deal]);

  const assigneeName = useMemo(() => {
    if (deal?.responsibleId == null) {
      return textForKey('Not assigned');
    }
    return deal.responsibleName;
  }, [deal.responsibleId, deal.responsibleName]);

  const itemResponsible = useMemo(() => {
    if (deal?.doctorId != null) {
      return deal.doctorName;
    }
    return assigneeName;
  }, [deal, assigneeName]);

  const scheduleTime = useMemo(() => {
    if (deal.appointmentDate == null) {
      return null;
    }
    return moment(deal.appointmentDate).format('DD MMM YYYY HH:mm');
  }, [deal.appointmentDate]);

  const handleDealClick = () => {
    onDealClick?.(deal);
  };

  return (
    <div className={styles.sortedDealItem} onPointerUp={handleDealClick}>
      <div className={styles.content}>
        <Typography className={styles.sourceLabel}>
          {personName},
          {deal.patientPhone && (
            <a
              href={`tel:${deal.patientPhone.replace('+', '')}`}
              onPointerUp={(e) => e.stopPropagation()}
              style={{ marginLeft: '3px' }}
            >
              +{deal.patientPhone}
            </a>
          )}
        </Typography>
        <Typography noWrap className={styles.contactName}>
          {itemTitle}
        </Typography>
        {scheduleTime != null && (
          <Typography noWrap className={styles.scheduleTime}>
            {scheduleTime}
          </Typography>
        )}
        {deal?.appointmentCanceledReason != null && (
          <Typography noWrap className={styles.scheduleTime}>
            {deal.appointmentCanceledReason}
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
          {deal?.scheduleId != null && (
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
          {/*{hasTags &&*/}
          {/*  deal.patient.tags.map((tag) => (*/}
          {/*    <Chip*/}
          {/*      size='small'*/}
          {/*      variant='outlined'*/}
          {/*      label={tag.title}*/}
          {/*      key={tag.id}*/}
          {/*      classes={{*/}
          {/*        root: styles.tagItem,*/}
          {/*        label: styles.label,*/}
          {/*        outlined: styles.outlined,*/}
          {/*      }}*/}
          {/*    />*/}
          {/*  ))}*/}
        </div>
      </div>
      <Typography className={styles.dateLabel}>
        {moment(deal.updated).format('DD MMM YYYY HH:mm')}
      </Typography>
    </div>
  );
};

export default SortedDealItem;
