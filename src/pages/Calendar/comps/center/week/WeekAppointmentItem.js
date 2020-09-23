import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import { getAppointmentTop } from '../../../../../utils/helperFuncs';

const minHeight = 32;
const minTop = 3;

const WeekAppointmentItem = ({ appointment }) => {
  const [position, setPosition] = useState({ top: minTop, height: minHeight });

  useEffect(() => {
    const newPosition = getAppointmentTop(
      appointment,
      'days-container',
      minHeight,
      minTop,
    );
    setPosition(newPosition);
  }, [appointment]);

  return (
    <div className='appointment-item' style={position}>
      <div className='title-and-time'>
        <span className='service-name'>Service name</span>
        {position.height >= minHeight && (
          <span className='item-time-text'>
            {appointment.startHour} - {appointment.endHour}
          </span>
        )}
      </div>
    </div>
  );
};

export default WeekAppointmentItem;

WeekAppointmentItem.propTypes = {
  appointment: PropTypes.shape({
    startHour: PropTypes.string,
    endHour: PropTypes.string,
  }),
};
