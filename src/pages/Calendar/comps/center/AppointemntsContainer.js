import React, { useEffect, useRef } from 'react';

import PropTypes from 'prop-types';
import { useSpring, animated } from 'react-spring';
import { useDrag } from 'react-use-gesture';

import AppointmentItem from './AppointmentItem';

const AppointmentsContainer = ({ fromHour, toHour }) => {
  const parentRef = useRef(null);
  const [{ left, top, height }, set] = useSpring(() => ({
    left: 0,
    top: 0,
    height: window._remToPixels(2),
  }));

  useEffect(() => {
    const fromHourRect = document
      .getElementById(fromHour)
      .getBoundingClientRect();
    const toHourRect = document.getElementById(toHour).getBoundingClientRect();
    const height = toHourRect.top - fromHourRect.top;
    console.log(height);
    set({ top: fromHourRect.top, height });
  }, [fromHour, toHour]);

  const bind = useDrag(({ movement: [mx], memo = left.getValue() }) => {
    const parentRect = document
      .getElementById('appointments-container')
      .getBoundingClientRect();
    const containerRect = parentRef.current.getBoundingClientRect();
    if (containerRect.width <= parentRect.width) return memo;
    const nextPosition = mx + memo;
    const widthDifference = parentRect.width - containerRect.width;
    const newPosition = Math.min(0, nextPosition);
    const newLeft = Math.max(newPosition, widthDifference);
    set({ left: newLeft });
    return memo;
  });

  return (
    <animated.div
      {...bind()}
      className='day-appointments-container'
      ref={parentRef}
      style={{ left, height, top }}
    >
      <AppointmentItem />
    </animated.div>
  );
};

export default AppointmentsContainer;

AppointmentsContainer.propTypes = {
  fromHour: PropTypes.string.isRequired,
  toHour: PropTypes.string.isRequired,
};
