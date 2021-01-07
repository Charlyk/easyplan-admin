import React, { useEffect, useState } from 'react';

import IconClock from '@material-ui/icons/AccessTime';
import IconMoney from '@material-ui/icons/AttachMoney';
import IconClear from '@material-ui/icons/Clear';
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
      moment(schedule.startTime).format('HH:mm'),
      moment(schedule.endTime).format('HH:mm'),
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
          <span className='service-name'>{schedule.patient.fullName}</span>
          <div
            className={clsx(
              'status-icon',
              schedule.scheduleStatus === 'DidNotCome' && 'negative',
            )}
          >
            {schedule.scheduleStatus === 'OnSite' && <DoneIcon />}
            {(schedule.scheduleStatus === 'CompletedPaid' ||
              schedule.scheduleStatus === 'PartialPaid') && <DoneAllIcon />}
            {schedule.scheduleStatus === 'DidNotCome' && <IconClear />}
            {schedule.scheduleStatus === 'CompletedNotPaid' && <IconMoney />}
            {schedule.scheduleStatus === 'WaitingForPatient' && <IconClock />}
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
    id: PropTypes.number,
    patient: PropTypes.shape({
      id: PropTypes.number,
      fullName: PropTypes.string,
    }),
    serviceName: PropTypes.string,
    serviceColor: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    scheduleStatus: PropTypes.string,
  }),
};

WeekAppointmentItem.defaultProps = {
  onSelect: () => null,
};
