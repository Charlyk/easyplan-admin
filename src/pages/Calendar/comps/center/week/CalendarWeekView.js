import React, { useEffect, useState } from 'react';

import moment from 'moment';
import PropTypes from 'prop-types';

import { Action } from '../../../../../utils/constants';
import {
  getCurrentWeek,
  logUserAction,
} from '../../../../../utils/helperFuncs';
import CalendarWeekDayView from './CalendarWeekDayView';

const CalendarWeekView = ({
  opened,
  hours,
  doctorId,
  viewDate,
  onDateClick,
  selectedSchedule,
  onScheduleSelect,
}) => {
  const [isClosed, setIsClosed] = useState(!opened);
  const [week, setWeek] = useState(getCurrentWeek(viewDate));

  useEffect(() => {
    setIsClosed(!opened);
    if (opened) {
      logUserAction(
        Action.ViewAppointments,
        JSON.stringify({ mode: 'Week', doctorId }),
      );
    }
  }, [opened]);

  useEffect(() => {
    setWeek(getCurrentWeek(viewDate));
  }, [viewDate]);

  const handleDayClick = day => {
    onDateClick(day.toDate());
  };

  if (isClosed) return null;

  return (
    <div className='week-view'>
      <table>
        <thead>
          <tr>
            {week.map(item => (
              <td key={item} onClick={() => handleDayClick(item)}>
                <div className='day-title'>{item.format('DD dddd')}</div>
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {week.map(day => (
              <CalendarWeekDayView
                selectedSchedule={selectedSchedule}
                onScheduleSelect={onScheduleSelect}
                doctorId={doctorId}
                key={day}
                day={day}
                hours={hours}
              />
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CalendarWeekView;

CalendarWeekView.propTypes = {
  onScheduleSelect: PropTypes.func,
  opened: PropTypes.bool,
  hours: PropTypes.arrayOf(PropTypes.string),
  doctorId: PropTypes.string,
  onDateClick: PropTypes.func,
  viewDate: PropTypes.instanceOf(Date),
  selectedSchedule: PropTypes.shape({
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

CalendarWeekDayView.defaulProps = {
  onScheduleSelect: () => null,
};
