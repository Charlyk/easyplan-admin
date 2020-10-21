import React, { useRef, useState } from 'react';

import { ClickAwayListener, Fade, Paper } from '@material-ui/core';
import Popper from '@material-ui/core/Popper';
import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Button, Spinner } from 'react-bootstrap';
import { Calendar, DateRangePicker } from 'react-date-range';
import * as locales from 'react-date-range/dist/locale';
import { useSelector } from 'react-redux';

import IconAppointmentCalendar from '../../../../assets/icons/iconAppointmentCalendar';
import IconPlus from '../../../../assets/icons/iconPlus';
import {
  localizedInputRanges,
  localizedStaticRanges,
} from '../../../../components/EasyDateRangePicker/ranges';
import EasyTab from '../../../../components/EasyTab';
import { isCalendarLoadingSelector } from '../../../../redux/selectors/calendarSelector';
import { updateAppointmentsSelector } from '../../../../redux/selectors/rootSelector';
import { getCurrentWeek } from '../../../../utils/helperFuncs';
import { getAppLanguage, textForKey } from '../../../../utils/localization';
import CalendarDoctorsView from './day/CalendarDoctorsView';
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
  onViewModeChange,
  selectedSchedule,
  canAddAppointment,
  onAddAppointment,
}) => {
  const calendarAnchor = useRef(null);
  const updateAppointments = useSelector(updateAppointmentsSelector);
  const isLoading = useSelector(isCalendarLoadingSelector);
  const [currentTab, setCurrentTab] = useState(CalendarView.day);
  const [calendarVisible, setCalendarVisible] = useState(false);

  const handleTabChange = newTab => {
    setCurrentTab(newTab);
    onViewModeChange(newTab);
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
    handleTabChange(CalendarView.day);
  };

  const handleOpenCalendar = () => setCalendarVisible(true);

  const handleCloseCalendar = () => setCalendarVisible(false);

  const handleDateChange = date => {
    onViewDateChange(date);
    handleCloseCalendar();
  };

  const calendarPopper = (
    <Popper
      className='appointments-date-picker-root'
      anchorEl={calendarAnchor.current}
      open={calendarVisible}
      placement='bottom'
      transition
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper className='calendar-paper'>
            <ClickAwayListener onClickAway={handleCloseCalendar}>
              <Calendar
                locale={locales[getAppLanguage()]}
                onChange={handleDateChange}
                date={viewDate}
              />
            </ClickAwayListener>
          </Paper>
        </Fade>
      )}
    </Popper>
  );

  return (
    <div className={clsx('calendar-root__center', 'full-height')}>
      <div className='center-header'>
        <Button
          ref={calendarAnchor}
          className='positive-button calendar-btn'
          onClick={handleOpenCalendar}
        >
          {getTitleText()}
          <IconAppointmentCalendar fill='#fff' />
        </Button>
        {calendarPopper}
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
        <Button
          className='positive-button'
          disabled={!canAddAppointment}
          onClick={onAddAppointment}
        >
          {textForKey('Add appointment')}
          <IconPlus />
        </Button>
      </div>
      <div
        id='calendar-content'
        style={{
          marginRight: 0,
          marginLeft: currentTab === CalendarView.day ? '0' : '1rem',
        }}
        className='center-content'
      >
        {isLoading && (
          <Spinner animation='border' className='loading-spinner' />
        )}
        {currentTab === CalendarView.day && (
          <CalendarDoctorsView
            viewDate={viewDate}
            update={updateAppointments}
          />
        )}
        <CalendarWeekView
          selectedSchedule={selectedSchedule}
          onScheduleSelect={onScheduleSelect}
          viewDate={viewDate}
          onDateClick={handleMonthDateClick}
          doctorId={doctor?.id}
          opened={currentTab === CalendarView.week}
          update={updateAppointments}
        />
        <CalendarMonthView
          onDateClick={handleMonthDateClick}
          viewDate={viewDate}
          doctorId={doctor?.id}
          opened={currentTab === CalendarView.month}
          update={updateAppointments}
        />
      </div>
    </div>
  );
};

export default AppointmentsCalendar;

AppointmentsCalendar.propTypes = {
  doctor: PropTypes.object,
  viewDate: PropTypes.instanceOf(Date),
  onDateChange: PropTypes.func,
  onViewDateChange: PropTypes.func,
  onScheduleSelect: PropTypes.func,
  onViewModeChange: PropTypes.func,
  canAddAppointment: PropTypes.bool,
  onAddAppointment: PropTypes.func,
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
