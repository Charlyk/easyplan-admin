import React, { useMemo } from "react";
import { Typography } from "@material-ui/core";
import PropTypes from 'prop-types';
import moment from "moment-timezone";
import clsx from "clsx";

import { textForKey } from "../../../../../utils/localization";
import { Statuses } from "../../../../utils/constants";
import styles from './ScheduleItem.module.scss';

const ScheduleItem = ({ schedule, onSelected }) => {
  const isPause = schedule.type === 'Pause';

  const status = useMemo(() => {
    return Statuses.find((item) => item.id === schedule.scheduleStatus);
  }, [schedule.scheduleStatus]);

  const handleScheduleSelected = () => {
    if (isPause) {
      return;
    }
    onSelected(schedule);
  }

  return (
    <div
      onPointerUp={handleScheduleSelected}
      className={
        clsx(
          styles.scheduleItem,
          {
            [styles.urgent]: schedule.isUrgent || schedule.urgent,
            [styles.upcoming]: schedule.scheduleStatus === 'OnSite',
          }
        )
      }
      style={{
        backgroundColor: isPause ? '#FDC534' : '#f3f3f3'
      }}
    >
      <div
        className={styles.statusIndicator}
        style={{
          backgroundColor: isPause ? 'white' : status.color
        }}
      />
      <Typography noWrap className={clsx(styles.patientNameLabel, isPause && styles.pause)}>
        {isPause ? textForKey('Pause') : schedule.patient.fullName}
      </Typography>
      <Typography noWrap className={clsx(styles.timeLabel, isPause && styles.pause)}>
        {moment(schedule.startTime).format('HH:mm')} -{' '}
        {moment(schedule.endTime).format('HH:mm')}
      </Typography>
      <Typography noWrap={!isPause} className={clsx(styles.timeLabel, isPause && styles.pause)}>
        {isPause ? schedule.comment : schedule.serviceName}
      </Typography>
      <Typography noWrap className={styles.timeLabel} style={{ color: status?.color ?? 'white' }}>
        {status?.name ?? ''}
      </Typography>
    </div>
  );
};

export default ScheduleItem;

ScheduleItem.propTypes = {
  schedule: PropTypes.shape({
    comment: PropTypes.string,
    doctorId: PropTypes.number,
    endTime: PropTypes.string,
    id: PropTypes.number,
    isUrgent: PropTypes.bool,
    patient: PropTypes.shape({
      id: PropTypes.number,
      fullName: PropTypes.string,
    }),
    scheduleStatus: PropTypes.oneOf(Statuses.map(item => item.id)),
    serviceColor: PropTypes.string,
    serviceCurrency: PropTypes.string,
    serviceId: PropTypes.number,
    serviceName: PropTypes.string,
    servicePrice: PropTypes.number,
    startTime: PropTypes.string,
    type: PropTypes.oneOf(['Schedule', 'Pause']),
  }).isRequired,
  onSelected: PropTypes.func,
};

ScheduleItem.defaultProps = {
  onSelected: () => null,
}
