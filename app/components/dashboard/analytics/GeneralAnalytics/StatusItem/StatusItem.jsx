import React, { useMemo } from 'react';
import moment from 'moment-timezone';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-polyglot';
import styles from '../GeneralAnalytics.module.scss';

const StatusItem = ({
  title,
  icon,
  percentage,
  personsCount,
  status,
  doctorId,
  startDate,
  endDate,
}) => {
  const textForKey = useTranslate();
  const formattedDate = (date) => {
    return moment(date).format('YYYY-MM-DD');
  };

  const statusUrl = useMemo(() => {
    const query = {
      status: status.status,
      startDate: formattedDate(startDate),
      endDate: formattedDate(endDate),
    };
    if (doctorId !== -1) {
      query.doctorId = doctorId;
    }
    const queryString = new URLSearchParams(query).toString();
    return `/analytics/services?${queryString}`;
  }, [status.status, startDate, endDate, doctorId]);

  return (
    <div className={styles['status-item-root']}>
      <div className={styles['title-wrapper']}>
        {icon}
        <Link href={statusUrl}>
          <a className={styles['title-label']}>{title}</a>
        </Link>
        <span className={styles['subtitle-label']}>
          {personsCount} {textForKey('persons')}
        </span>
      </div>
      <div className={styles['item-progress-container']}>
        <div className={styles['progress-bar-container']}>
          <div className={styles['progress-bar-background']} />
          <div
            className={styles['progress-bar-indicator']}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className={styles['percentage-label']}>
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};

export default StatusItem;

StatusItem.propTypes = {
  status: PropTypes.object,
  doctorId: PropTypes.number,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  title: PropTypes.string,
  icon: PropTypes.element,
  personsCount: PropTypes.number,
  percentage: PropTypes.number,
};

StatusItem.defaultProps = {
  onSelect: () => null,
};
