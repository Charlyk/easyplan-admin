import React, { useRef, useState } from 'react';

import {
  Box,
  ClickAwayListener,
  Fade,
  Paper,
  IconButton,
} from '@material-ui/core';
import Popper from '@material-ui/core/Popper';
import UploadIcon from '@material-ui/icons/CloudUpload';
import ArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import ArrowRight from '@material-ui/icons/KeyboardArrowRight';
import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Button, Spinner } from 'react-bootstrap';
import { Calendar } from 'react-date-range';
import * as locales from 'react-date-range/dist/locale';
import { useSelector } from 'react-redux';

import IconAppointmentCalendar from '../../../../assets/icons/iconAppointmentCalendar';
import IconPlus from '../../../../assets/icons/iconPlus';
import AppointmentDetails from '../../../../components/AppointmentDetails';
import EasyTab from '../../../../components/EasyTab';
import LoadingButton from '../../../../components/LoadingButton';
import { isCalendarLoadingSelector } from '../../../../redux/selectors/calendarSelector';
import { updateAppointmentsSelector } from '../../../../redux/selectors/rootSelector';
import { getCurrentWeek } from '../../../../utils/helperFuncs';
import { getAppLanguage, textForKey } from '../../../../utils/localization';
import CalendarDayView from './CalendarDayView';
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
  onPayDebt,
  isUploading,
  onViewDateChange,
  onEditSchedule,
  onDeleteSchedule,
  onScheduleSelect,
  onViewModeChange,
  selectedSchedule,
  canAddAppointment,
  onAddAppointment,
  onImportSchedules,
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
        return moment(viewDate).format('MMMM YYYY');
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

  const handleDetailsClose = () => {
    onScheduleSelect(null);
  };

  const handleDateNavigation = navId => () => {
    const currentDate = moment(viewDate);
    switch (navId) {
      case 'previous-date':
        if (currentTab === CalendarView.day) {
          onViewDateChange(currentDate.subtract(1, 'day').toDate());
        } else if (currentTab === CalendarView.week) {
          onViewDateChange(currentDate.subtract(1, 'week').toDate());
        } else if (currentTab === CalendarView.month) {
          onViewDateChange(currentDate.subtract(1, 'month').toDate());
        }
        break;
      case 'next-date':
        if (currentTab === CalendarView.day) {
          onViewDateChange(currentDate.add(1, 'day').toDate());
        } else if (currentTab === CalendarView.week) {
          onViewDateChange(currentDate.add(1, 'week').toDate());
        } else if (currentTab === CalendarView.month) {
          onViewDateChange(currentDate.add(1, 'month').toDate());
        }
        break;
    }
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
      {selectedSchedule != null && (
        <AppointmentDetails
          onPayDebt={onPayDebt}
          onDelete={onDeleteSchedule}
          onEdit={onEditSchedule}
          schedule={selectedSchedule}
          onClose={handleDetailsClose}
        />
      )}
      <div className='center-header'>
        <Box display='flex' alignItems='center'>
          <IconButton
            onClick={handleDateNavigation('previous-date')}
            classes={{ root: 'arrow-button', label: 'button-icon' }}
          >
            <ArrowLeft />
          </IconButton>
          <Button
            ref={calendarAnchor}
            className='positive-button calendar-btn'
            onClick={handleOpenCalendar}
          >
            {getTitleText()}
            <IconAppointmentCalendar fill='#fff' />
          </Button>
          <IconButton
            onClick={handleDateNavigation('next-date')}
            classes={{ root: 'arrow-button', label: 'button-icon' }}
          >
            <ArrowRight />
          </IconButton>
        </Box>
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
        <Box display='flex' className='right-btns-wrapper'>
          <LoadingButton
            isLoading={isUploading}
            variant='outline-primary'
            className='btn-outline-primary import-btn'
            onClick={onImportSchedules}
          >
            <UploadIcon />
          </LoadingButton>
          <Button
            className='positive-button'
            disabled={!canAddAppointment}
            onClick={onAddAppointment}
          >
            {textForKey('Add appointment')}
            <IconPlus />
          </Button>
        </Box>
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
          <CalendarDayView
            onScheduleSelect={onScheduleSelect}
            viewDate={viewDate}
            update={updateAppointments}
            onCreateSchedule={onAddAppointment}
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
  isUploading: PropTypes.bool,
  doctor: PropTypes.object,
  viewDate: PropTypes.instanceOf(Date),
  onDateChange: PropTypes.func,
  onViewDateChange: PropTypes.func,
  onScheduleSelect: PropTypes.func,
  onViewModeChange: PropTypes.func,
  canAddAppointment: PropTypes.bool,
  onAddAppointment: PropTypes.func,
  onDeleteSchedule: PropTypes.func,
  onEditSchedule: PropTypes.func,
  onPayDebt: PropTypes.func,
  onImportSchedules: PropTypes.func,
  selectedSchedule: PropTypes.shape({
    id: PropTypes.number,
    patient: PropTypes.shape({
      id: PropTypes.number,
      fullName: PropTypes.string,
    }),
    serviceName: PropTypes.string,
    serviceColor: PropTypes.string,
    start: PropTypes.object,
    end: PropTypes.object,
    scheduleStatus: PropTypes.string,
  }),
};

AppointmentsCalendar.defaultProps = {
  viewDate: new Date(),
  onViewDateChange: () => null,
  onScheduleSelect: () => null,
  onImportSchedules: () => null,
};
