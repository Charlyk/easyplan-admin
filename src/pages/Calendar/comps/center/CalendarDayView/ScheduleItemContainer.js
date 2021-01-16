import React, { useState } from 'react';

import { Typography } from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import IconPlus from '../../../../../assets/icons/iconPlus';

const ScheduleItemContainer = ({
  startHour,
  endHour,
  disabled,
  onAddSchedule,
}) => {
  const [showCreateView, setShowCreateView] = useState(false);

  if (disabled) {
    return null;
  }

  const handlePointerEnter = () => {
    setShowCreateView(true);
  };

  const handlePointerLeave = () => {
    setShowCreateView(false);
  };

  const handleAddScheduleClink = () => {
    onAddSchedule(startHour, endHour);
  };

  const createScheduleView = (
    <div
      className='create-schedule-view'
      role='button'
      tabIndex={0}
      onClick={handleAddScheduleClink}
    >
      {startHour != null && (
        <Typography classes={{ root: 'hour-text' }}>
          {startHour} - {endHour}
        </Typography>
      )}
      <IconPlus fill='#fff' />
    </div>
  );

  return (
    <div
      id={`container-${startHour}`}
      className='day-schedule-item-container'
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {showCreateView && startHour != null && createScheduleView}
    </div>
  );
};

export default ScheduleItemContainer;

ScheduleItemContainer.propTypes = {
  startHour: PropTypes.string,
  endHour: PropTypes.string,
  onAddSchedule: PropTypes.func,
  disabled: PropTypes.bool,
};

ScheduleItemContainer.defaultProps = {
  onAddSchedule: () => null,
};
