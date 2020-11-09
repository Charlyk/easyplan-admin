import React, { useEffect, useState } from 'react';

import DoneIcon from '@material-ui/icons/Done';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { checkAppointmentsSelector } from '../../../../../redux/selectors/rootSelector';
import { checkShouldAnimateSchedule } from '../../../../../utils/helperFuncs';

const WeekAppointmentItem = ({ schedule, onSelect }) => {
  const dispatch = useDispatch();
  const checkAppointment = useSelector(checkAppointmentsSelector);
  const [animateSchedule, setAnimateSchedule] = useState(false);
  const [[startHour, endHour], setHours] = useState(['00:00', '00:00']);

  useEffect(() => {
    setAnimateSchedule(dispatch(checkShouldAnimateSchedule(schedule)));
  }, [checkAppointment, schedule]);

  useEffect(() => {
    setHours([
      moment(schedule.dateAndTime).format('HH:mm'),
      moment(schedule.dateAndTime)
        .add(schedule.serviceDuration, 'minutes')
        .format('HH:mm'),
    ]);
  }, [schedule]);

  const handleScheduleSelect = () => {
    onSelect(schedule);
  };

  return (
    <div
      role='button'
      tabIndex={0}
      onClick={handleScheduleSelect}
      className={clsx('appointment-item', animateSchedule && 'upcoming')}
      style={{
        border: `1px solid ${schedule.serviceColor}`,
        backgroundColor: `${schedule.serviceColor}1A`,
      }}
    >
      <div className='title-and-time'>
        <div className='name-and-status'>
          <span className='service-name'>{schedule.patientName}</span>
          <div className='status-icon'>
            {schedule.status === 'OnSite' && <DoneIcon />}
            {(schedule.status === 'CompletedPaid' ||
              schedule.status === 'PartialPaid') && <DoneAllIcon />}
          </div>
        </div>
        <span className='item-time-text'>
          {startHour} - {endHour}
        </span>
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
    serviceDuration: PropTypes.number,
    dateAndTime: PropTypes.string,
    status: PropTypes.string,
    note: PropTypes.string,
  }),
};

WeekAppointmentItem.defaultProps = {
  onSelect: () => null,
};
