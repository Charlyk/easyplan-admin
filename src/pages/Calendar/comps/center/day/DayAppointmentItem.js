import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { animated } from 'react-spring';

import IconNext from '../../../../../assets/icons/iconNext';
import { getAppointmentTop } from '../../../../../utils/helperFuncs';

const minHeight = 32;
const minTop = 48 + minHeight / 2;

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
    <animated.div
      className='day-appointment-item'
      style={{
        ...position,
        border: `1px solid ${appointment.serviceColor}`,
        backgroundColor: `${appointment.serviceColor}1A`,
      }}
    >
      <div className='title-and-time'>
        <span
          className='service-name'
          style={{ color: appointment.serviceColor }}
        >
          {appointment.serviceName}
        </span>
        <span className='item-time-text'>
          {appointment.startHour} - {appointment.endHour}
        </span>
      </div>
      <IconNext
        fillColor={appointment.serviceColor}
        circleColor='transparent'
      />
    </animated.div>
  );
};

export default DayAppointmentItem;

DayAppointmentItem.propTypes = {
  appointment: PropTypes.shape({
    serviceName: PropTypes.string,
    startHour: PropTypes.string,
    endHour: PropTypes.string,
    serviceColor: PropTypes.string,
  }),
};
