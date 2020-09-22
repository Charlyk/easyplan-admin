import React, { useEffect, useRef, useState } from 'react';

import PropTypes from 'prop-types';
import { useSpring, animated, interpolate } from 'react-spring';

import IconNext from '../../../../../assets/icons/iconNext';

const minTop = 64;
const minHeight = 32;

const DayAppointmentItem = ({ appointment }) => {
  const currentRef = useRef(null);
  const [position, setPosition] = useState({ top: minTop, height: minHeight });

  useEffect(() => {
    const newPosition = getPosition();
    setPosition(newPosition);
  }, [appointment]);

  const getPosition = () => {
    if (!appointment) {
      return {
        top: minTop,
        height: minHeight,
      };
    }
    const { startHour, endHour } = appointment;
    if (startHour == null || endHour == null)
      return { top: minTop, height: minHeight };
    const fromHourComponents = startHour.split(':');
    const toHourComponents = endHour.split(':');

    const parentRect = document
      .getElementById('appointments-container')
      .getBoundingClientRect();

    const fromHourRect = document
      .getElementById(`${fromHourComponents[0]}:00`)
      .getBoundingClientRect();

    const toHourRect = document
      .getElementById(`${toHourComponents[0]}:00`)
      .getBoundingClientRect();

    // calculate start hour minutes height
    const fromMinutes = parseInt(fromHourComponents[1]);
    const fromMinutesPercentage = (fromMinutes / 60) * 100;
    const fromHeightDiff = (fromMinutesPercentage / 100) * fromHourRect.height;

    // calculate end hour minutes height
    const toMinutes = parseInt(toHourComponents[1]);
    const toMinutesPercentage = (toMinutes / 60) * 100;
    const toHeightDiff = (toMinutesPercentage / 100) * toHourRect.height;

    // calculate top position
    const distanceFromTop = fromHourRect.top - parentRect.top;
    const topPosition = distanceFromTop + fromHeightDiff + minTop;

    // calculate item height
    const distanceFromStart =
      toHourRect.top - fromHourRect.top - fromHeightDiff;
    const height = distanceFromStart + toHeightDiff;

    // return new position and height
    return { top: topPosition, height };
  };

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
