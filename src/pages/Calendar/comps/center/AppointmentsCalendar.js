import React, { useEffect, useState } from 'react';

import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import EasyTab from '../../../../components/EasyTab';
import { updateAppointmentsSelector } from '../../../../redux/selectors/rootSelector';
import dataAPI from '../../../../utils/api/dataAPI';
import { getCurrentWeek, logUserAction } from '../../../../utils/helperFuncs';
import { textForKey } from '../../../../utils/localization';
import CalendarDayView from './day/CalendarDayView';
import CalendarMonthView from './month/CalendarMonthView';
import CalendarWeekView from './week/CalendarWeekView';

const CalendarView = {
  day: 'day',
  week: 'week',
  month: 'month',
  year: 'ear',
};

const AppointmentsCalendar = ({
  doctor,
  viewDate,
  onViewDateChange,
  onScheduleSelect,
  selectedSchedule,
}) => {
  const updateAppointments = useSelector(updateAppointmentsSelector);
  const [isLoading, setIsLoading] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [hours, setHours] = useState([]);
  const [currentTab, setCurrentTab] = useState(CalendarView.day);

  useEffect(() => {
    setHours([]);
    setSchedules([]);
    fethWorkHours();
  }, [viewDate, currentTab]);

  useEffect(() => {
    if (hours.length === 0) {
      fethWorkHours();
    } else if (doctor != null && currentTab === CalendarView.day) {
      fetchSchedules();
    }
  }, [doctor, updateAppointments]);

  useEffect(() => {
    if (hours.length > 0) {
      fetchSchedules();
    }
  }, [hours]);

  const fethWorkHours = async () => {
    setIsLoading(true);
    const response = await dataAPI.fetchClinicWorkHours(
      moment(viewDate).isoWeekday(),
      currentTab === CalendarView.week ? 'week' : 'day',
    );
    if (response.isError) {
      console.error(response.message);
    } else {
      setHours(response.data);
    }
    setIsLoading(false);
  };

  const fetchSchedules = async () => {
    if (hours.length === 0 || doctor == null) {
      return;
    }
    setIsLoading(true);
    const response = await dataAPI.fetchSchedules(doctor?.id, viewDate);
    if (response.isError) {
      console.error(response.message);
    } else {
      const { data } = response;
      setSchedules(data);
      if (selectedSchedule != null) {
        onScheduleSelect(data.find(item => item.id === selectedSchedule.id));
      }
    }
    setIsLoading(false);
  };

  const handleTabChange = newTab => {
    setCurrentTab(newTab);
  };

  const getTitleText = () => {
    switch (currentTab) {
      case CalendarView.day:
        return moment(viewDate).format('DD MMMM YYYY');
      case CalendarView.week: {
        const week = getCurrentWeek(viewDate);
        return `${week[0].format('DD MMM')} - ${week[week.length - 1].format(
          'DD MMM',
        )}`;
      }
      case CalendarView.month:
        return moment(viewDate).format('MMMM');
    }
  };

  const handleMonthDateClick = date => {
    onViewDateChange(date);
    setCurrentTab(CalendarView.day);
  };

  return (
    <div className='calendar-root__center'>
      <div className='center-header'>
        <span className='center-header__date'>{getTitleText()}</span>
        <div className='center-header__tabs'>
          <EasyTab
            title={textForKey('Day')}
            selected={currentTab === CalendarView.day}
            onClick={() => handleTabChange(CalendarView.day)}
          />
          <EasyTab
            title={textForKey('Week')}
            selected={currentTab === CalendarView.week}
            onClick={() => handleTabChange(CalendarView.week)}
          />
          <EasyTab
            title={textForKey('Month')}
            selected={currentTab === CalendarView.month}
            onClick={() => handleTabChange(CalendarView.month)}
          />
        </div>
      </div>
      <div
        id='calendar-content'
        className={clsx(
          'center-content',
          currentTab === CalendarView.month && 'full-height',
        )}
      >
        {isLoading && (
          <Spinner animation='border' className='loading-spinner' />
        )}
        {hours.length === 0 &&
          !isLoading &&
          currentTab === CalendarView.day && (
            <span className='day-off-label'>
              {textForKey("It's a day off")}
            </span>
          )}
        <CalendarDayView
          doctorId={doctor?.id}
          onScheduleSelect={onScheduleSelect}
          hours={hours}
          schedules={schedules}
          opened={currentTab === CalendarView.day}
        />
        <CalendarWeekView
          selectedSchedule={selectedSchedule}
          onScheduleSelect={onScheduleSelect}
          viewDate={viewDate}
          hours={hours}
          doctorId={doctor?.id}
          opened={currentTab === CalendarView.week}
        />
        <CalendarMonthView
          onDateClick={handleMonthDateClick}
          viewDate={viewDate}
          doctorId={doctor?.id}
          opened={currentTab === CalendarView.month}
        />
      </div>
    </div>
  );
};

export default AppointmentsCalendar;

AppointmentsCalendar.propTypes = {
  doctor: PropTypes.object,
  viewDate: PropTypes.instanceOf(Date),
  onViewDateChange: PropTypes.func,
  onScheduleSelect: PropTypes.func,
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

AppointmentsCalendar.defaultProps = {
  viewDate: new Date(),
  onViewDateChange: () => null,
  onScheduleSelect: () => null,
};
