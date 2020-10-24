import React, { useEffect, useState } from 'react';

import moment from 'moment';
import PropTypes from 'prop-types';
import { animated, useSpring } from 'react-spring';

import IconNext from '../../../../../assets/icons/iconNext';
import { getAppointmentTop } from '../../../../../utils/helperFuncs';

const minHeight = 10;
const hourHeight = 32;
const minTop = hourHeight / 2;

const DayAppointmentItem = ({ schedule, onSelect }) => {
  const [position, setPosition] = useState({ top: minTop, height: minHeight });
  const [[startHour, endHour], setHours] = useState(['00:00', '00:00']);
  const [{ left }, setLeft] = useSpring(() => ({
    from: { left: 64 },
    to: { left: 70 },
    delay: 100,
    reset: true,
    reverse: true,
  }));

  useEffect(() => {
    if (!schedule) return;
    const { dateAndTime } = schedule;
    const appointmentDate = moment(dateAndTime, 'YYYY-MM-DD HH:mm');
    const startHour = appointmentDate.format('HH:mm');
    const endHour = appointmentDate
      .add('minutes', schedule.serviceDuration)
      .format('HH:mm');
    const newPosition = getAppointmentTop(
      [startHour, endHour],
      'appointments-container',
      minHeight,
      minTop,
    );
    setPosition(newPosition);
    setHours([startHour, endHour]);
    setLeft({ left: 70 });
  }, [schedule]);

  const handleScheduleSelect = () => {
    onSelect(schedule);
  };

  return (
    <animated.div
      onClick={handleScheduleSelect}
      className='day-appointment-item'
      style={{
        ...position,
        border: `1px solid ${schedule.serviceColor}`,
        backgroundColor: `${schedule.serviceColor}1A`,
      }}
    >
      <div className='title-and-time'>
        <span className='service-name'>{schedule.serviceName}</span>
        <span className='item-time-text'>
          {startHour} - {endHour}
        </span>
      </div>
      <IconNext fillColor={schedule.serviceColor} circleColor='transparent' />
    </animated.div>
  );
};

export default DayAppointmentItem;

DayAppointmentItem.propTypes = {
  onSelect: PropTypes.func,
  schedule: PropTypes.shape({
    id: PropTypes.string,
    patientId: PropTypes.string,
    patientName: PropTypes.string,
    patientPhone: PropTypes.string,
    doctorId: PropTypes.string,
    doctorName: PropTypes.string,
    serviceId: PropTypes.string,
    serviceName: PropTypes.string,
    serviceColor: PropTypes.string,
    serviceDuration: PropTypes.string,
    dateAndTime: PropTypes.string,
    status: PropTypes.string,
    note: PropTypes.string,
  }),
};

DayAppointmentItem.defaultProps = {
  onSelect: () => null,
};
