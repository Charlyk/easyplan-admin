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
import { toast } from 'react-toastify';

import { setIsCalendarLoading } from '../../../../../redux/actions/calendar';
import { updateAppointmentsSelector } from '../../../../../redux/selectors/rootSelector';
import dataAPI from '../../../../../utils/api/dataAPI';
import { Action } from '../../../../../utils/constants';
import {
  checkShouldAnimateSchedule,
  getDays,
  logUserAction,
} from '../../../../../utils/helperFuncs';
import { textForKey } from '../../../../../utils/localization';

const CalendarMonthView = ({ opened, viewDate, doctorId, onDateClick }) => {
  const dispatch = useDispatch();
  const updateAppointments = useSelector(updateAppointmentsSelector);
  const [isClosed, setIsClosed] = useState(!opened);
  const [schedules, setSchedules] = useState([]);
  const [monthDays, setMonthDays] = useState([]);

  useEffect(() => {
    if (opened) {
      logUserAction(
        Action.ViewAppointments,
        JSON.stringify({ mode: 'Month', doctorId }),
      );
    }
    if (viewDate != null && doctorId != null && opened) {
      setMonthDays(getDays(viewDate));
      setSchedules([]);
      fetchSchedules();
    }
  }, [viewDate, doctorId, opened, updateAppointments]);

  const fetchSchedules = async () => {
    dispatch(setIsCalendarLoading(true));
    const response = await dataAPI.fetchMonthSchedules(doctorId, viewDate);
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      const newSchedules = [];
      for (let prop in response.data) {
        const date = moment(`${prop}`, 'YYYY-MM-DD').format('DD');
        newSchedules.push({ date, schedules: response.data[prop] });
      }
      setSchedules(newSchedules);
    }
    dispatch(setIsCalendarLoading(false));
  };

  useEffect(() => {
    setIsClosed(!opened);
  }, [opened]);

  if (isClosed) return null;

  const rowsCount = monthDays.length / 7;
  const calendarRect = document
    .getElementById('calendar-content')
    ?.getBoundingClientRect();

  const handleDayClick = day => {
    const date = moment(day.fullDate, 'YYYY-DD-MM').toDate();
    onDateClick(date);
  };

  const getSchedules = day => {
    return schedules.find(item => item.date === day.date)?.schedules || [];
  };

  const renderSchedule = schedule => {
    const shouldAnimate = dispatch(checkShouldAnimateSchedule(schedule));
    return (
      <div
        key={schedule.id}
        className={clsx('appointment-item', shouldAnimate && 'upcoming')}
        style={{
          border: `1px solid ${schedule.serviceColor}`,
          backgroundColor: `${schedule.serviceColor}1A`,
        }}
      >
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
              schedule.scheduleStatus === 'PartialPaid' ||
              schedule.scheduleStatus === 'CompletedFree') && <DoneAllIcon />}
            {schedule.scheduleStatus === 'DidNotCome' && <IconClear />}
            {schedule.scheduleStatus === 'CompletedNotPaid' && <IconMoney />}
            {schedule.scheduleStatus === 'WaitingForPatient' && <IconClock />}
          </div>
        </div>
      </div>
    );
  };

  const renderDayItem = day => {
    const daySchedules = getSchedules(day);
    return (
      <div
        role='button'
        tabIndex={0}
        onClick={() => handleDayClick(day)}
        className={clsx('item-data-container', day.isSameDay && 'current-date')}
        style={{ height: calendarRect?.height / rowsCount }}
        key={`${day.date}-${day.isCurrent}-${day.month}`}
      >
        <span
          className={clsx(
            'item-text month-day',
            !day.isCurrent && 'next-month',
          )}
        >
          {day.date}
        </span>
        {day.isCurrent && (
          <div className='appointments-container'>
            {daySchedules.slice(0, 3).map(renderSchedule)}
            {daySchedules.length > 3 && (
              <div className='view-more-container'>
                <span className='view-more-button'>
                  {textForKey('View more')} ({daySchedules.length - 3})
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return <div className='month-view'>{monthDays.map(renderDayItem)}</div>;
};

export default CalendarMonthView;

CalendarMonthView.propTypes = {
  opened: PropTypes.bool.isRequired,
  viewDate: PropTypes.instanceOf(Date),
  doctorId: PropTypes.number,
  onDateClick: PropTypes.func,
};

CalendarMonthView.defaultProps = {
  onDateClick: () => null,
};
