import React, { useState } from 'react';

import { Box, Typography } from '@material-ui/core';
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

  const getBorderTop = () => {
    if (startHour == null) {
      return 'none';
    }

    const [hour, minute] = startHour.split(':');
    if ((minute === '15' || minute === '45') && endHour != null) {
      return 'none';
    } else {
      return '#DBEEFB 1px solid';
    }
  };

  return (
    <Box
      id={`container-${startHour}`}
      className='day-schedule-item-container'
      style={{ borderTop: getBorderTop() }}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {showCreateView &&
        startHour != null &&
        endHour != null &&
        createScheduleView}
    </Box>
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
