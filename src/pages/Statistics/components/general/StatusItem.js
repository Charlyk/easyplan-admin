import React from 'react';

import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { updateLink } from '../../../../utils/helperFuncs';
import { textForKey } from '../../../../utils/localization';
import styles from '../../Statistics.module.scss';

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
  const formattedDate = (date) => {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
  };

  return (
    <div className={styles['status-item-root']}>
      <div className={styles['title-wrapper']}>
        {icon}
        <Link
          to={updateLink(
            `/analytics/services?status=${
              status.status
            }&doctorId=${doctorId}&startDate=${formattedDate(
              startDate,
            )}&endDate=${formattedDate(endDate)}`,
          )}
        >
          <span className={styles['title-label']}>{title}</span>
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
        <span className={styles['percentage-label']}>{Math.round(percentage)}%</span>
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
