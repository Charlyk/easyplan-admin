import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { animated } from 'react-spring';

import IconNext from '../../../../../assets/icons/iconNext';
import { getAppointmentTop } from '../../../../../utils/helperFuncs';

const minHeight = 32;
const minTop = 64 + minHeight / 2;

const DayAppointmentItem = ({ appointment }) => {
  const [position, setPosition] = useState({ top: minTop, height: minHeight });

  useEffect(() => {
    const newPosition = getAppointmentTop(
      appointment,
      'appointments-container',
      minHeight,
      minTop,
    );
    setPosition(newPosition);
  }, [appointment]);

  return (
    <animated.div className='day-appointment-item' style={position}>
      <div className='title-and-time'>
        <span className='service-name'>Service name</span>
        <span className='item-time-text'>
          {appointment.startHour} - {appointment.endHour}
        </span>
      </div>
      <IconNext fillColor='#F44081' circleColor='transparent' />
    </animated.div>
  );
};

export default DayAppointmentItem;

DayAppointmentItem.propTypes = {
  appointment: PropTypes.shape({
    startHour: PropTypes.string,
    endHour: PropTypes.string,
  }),
};
