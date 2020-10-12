import React, { useEffect, useState } from 'react';

import moment from 'moment';
import PropTypes from 'prop-types';

import { getAppointmentTop } from '../../../../../utils/helperFuncs';

const minHeight = 32;
const minTop = 3;

const WeekAppointmentItem = ({ schedule, onSelect }) => {
  const [position, setPosition] = useState({ top: minTop, height: minHeight });
  const [[startHour, endHour], setHours] = useState(['00:00', '00:00']);

  useEffect(() => {
    const { dateAndTime } = schedule;
    const appointmentDate = moment(dateAndTime, 'YYYY-MM-DD HH:mm');
    const startHour = appointmentDate.format('HH:mm');
    const endHour = appointmentDate
      .add('minutes', schedule.serviceDuration)
      .format('HH:mm');
    const newPosition = getAppointmentTop(
      [startHour, endHour],
      'days-container',
      minHeight,
      minTop,
    );
    setPosition(newPosition);
    setHours([startHour, endHour]);
  }, [schedule]);

  const handleScheduleSelect = () => {
    onSelect(schedule);
  };

  return (
    <div
      role='button'
      tabIndex={0}
      onClick={handleScheduleSelect}
      className='appointment-item'
      style={{
        ...position,
        border: `1px solid ${schedule.serviceColor}`,
        backgroundColor: `${schedule.serviceColor}1A`,
      }}
    >
      <div className='title-and-time'>
        <span className='service-name' style={{ color: schedule.serviceColor }}>
          {schedule.serviceName}
        </span>
        {position.height >= minHeight && (
          <span className='item-time-text'>
            {startHour} - {endHour}
          </span>
        )}
      </div>
    </div>
  );
};

export default WeekAppointmentItem;

WeekAppointmentItem.propTypes = {
  onSelect: PropTypes.func,
  signeLine: PropTypes.bool,
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

WeekAppointmentItem.defaultProps = {
  onSelect: () => null,
};
