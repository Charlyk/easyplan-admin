import React from 'react';

import moment from 'moment';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { updateLink } from '../../../../utils/helperFuncs';
import { textForKey } from '../../../../utils/localization';

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
  const formattedDate = date => {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
  };

  return (
    <div className='status-item-root'>
      <div className='title-wrapper'>
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
          <span className='title-label'>{title}</span>
        </Link>
        <span className='subtitle-label'>
          {personsCount} {textForKey('persons')}
        </span>
      </div>
      <div className='item-progress-container'>
        <div className='progress-bar-container'>
          <div className='progress-bar-background' />
          <div
            className='progress-bar-indicator'
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className='percentage-label'>{Math.round(percentage)}%</span>
      </div>
    </div>
  );
};

export default StatusItem;

StatusItem.propTypes = {
  status: PropTypes.object,
  doctorId: PropTypes.string,
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
