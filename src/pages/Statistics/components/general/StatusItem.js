import React from 'react';

import PropTypes from 'prop-types';

import { textForKey } from '../../../../utils/localization';

const StatusItem = ({ title, icon, percentage, personsCount }) => {
  return (
    <div className='status-item-root'>
      <div className='title-wrapper'>
        {icon}
        <span className='title-label'>{title}</span>
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
        <span className='percentage-label'>{percentage}%</span>
      </div>
    </div>
  );
};

export default StatusItem;

StatusItem.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.element,
  personsCount: PropTypes.string,
  percentage: PropTypes.number,
};
