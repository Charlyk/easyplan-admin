import React from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';

const CalendarWeekHourView = ({ currentHour, hour }) => {
  return (
    <div id={hour} className={clsx('week-hour', currentHour && 'highlighted')}>
      <div className='hour-line' />
    </div>
  );
};

export default CalendarWeekHourView;

CalendarWeekHourView.propTypes = {
  currentHour: PropTypes.bool,
  hour: PropTypes.string,
};
