import React, { useRef, useState } from 'react';

import {
  Box,
  ClickAwayListener,
  Fade,
  Paper,
  IconButton,
  Button as MaterialButton, CircularProgress,
} from '@material-ui/core';
import Popper from '@material-ui/core/Popper';
import UploadIcon from '@material-ui/icons/CloudUpload';
import ArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import ArrowRight from '@material-ui/icons/KeyboardArrowRight';
import clsx from 'clsx';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { Button, Spinner } from 'react-bootstrap';
import { Calendar } from 'react-date-range';
import * as locales from 'react-date-range/dist/locale';
import { useSelector } from 'react-redux';

import IconAppointmentCalendar from '../../../assets/icons/iconAppointmentCalendar';
import IconPlus from '../../../assets/icons/iconPlus';
import AppointmentDetails from '../../../components/AppointmentDetails';
import EasyTab from '../../../components/EasyTab';
import LoadingButton from '../../../components/LoadingButton';
import { isCalendarLoadingSelector } from '../../../redux/selectors/calendarSelector';
import { getCurrentWeek } from '../../../utils/helperFuncs';
import { getAppLanguage, textForKey } from '../../../utils/localization';
import CalendarDayView from './CalendarDayView';
import CalendarMonthView from './CalendarMonthView';
import CalendarWeekView from './CalendarWeekView';
import styles from './AppointmentsCalendar.module.scss'

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
  const isLoading = useSelector(isCalendarLoadingSelector);
  const [currentTab, setCurrentTab] = useState(CalendarView.day);
  const [calendarVisible, setCalendarVisible] = useState(false);

  const handleTabChange = (newTab) => {
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

  const handleMonthDateClick = (date) => {
    onViewDateChange(date);
    handleTabChange(CalendarView.day);
  };

  const handleOpenCalendar = () => setCalendarVisible(true);

  const handleCloseCalendar = () => setCalendarVisible(false);

  const handleDateChange = (date) => {
    onViewDateChange(date);
    handleCloseCalendar();
  };

  const handleTodayClick = () => {
    handleDateChange(new Date());
  };

  const handleDetailsClose = () => {
    onScheduleSelect(null);
  };

  const handleDateNavigation = (navId) => () => {
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

  const handleAddAppointment = () => {
    onAddAppointment();
  };

  const calendarPopper = (
    <Popper
      className={styles['appointments-date-picker-root']}
      anchorEl={calendarAnchor.current}
      open={calendarVisible}
      placement='bottom'
      transition
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper className={styles['calendar-paper']}>
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
    <div className={clsx(styles.appointmentsCalendar, 'full-height')}>
      {selectedSchedule != null && (
        <AppointmentDetails
          onPayDebt={onPayDebt}
          onDelete={onDeleteSchedule}
          onEdit={onEditSchedule}
          schedule={selectedSchedule}
          onClose={handleDetailsClose}
        />
      )}
      <div className={styles['center-header']}>
        <Box
          display='flex'
          alignItems='center'
          className={styles['controls-wrapper']}
          mb='5px'
        >
          <IconButton
            onClick={handleDateNavigation('previous-date')}
            classes={{ root: styles['arrow-button'], label: styles['button-icon'] }}
          >
            <ArrowLeft />
          </IconButton>
          <Button
            ref={calendarAnchor}
            className={clsx('positive-button', styles['calendar-btn'])}
            onClick={handleOpenCalendar}
          >
            {getTitleText()}
            <IconAppointmentCalendar fill='#fff' />
          </Button>
          <IconButton
            onClick={handleDateNavigation('next-date')}
            classes={{ root: styles['arrow-button'], label: styles['button-icon'] }}
          >
            <ArrowRight />
          </IconButton>
          <MaterialButton
            onClick={handleTodayClick}
            classes={{ root: styles['today-btn'] }}
          >
            {textForKey('Today')}
          </MaterialButton>
        </Box>
        {calendarPopper}
        <div className={styles['center-header__tabs']}>
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
        <Box display='flex' className={styles['right-btns-wrapper']}>
          <LoadingButton
            isLoading={isUploading}
            variant='outline-primary'
            className={clsx('btn-outline-primary', styles['import-btn'])}
            onClick={onImportSchedules}
          >
            <UploadIcon />
          </LoadingButton>
          <Button
            className={clsx('positive-button', styles['add-appointment-btn'])}
            disabled={!canAddAppointment}
            onClick={handleAddAppointment}
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
        className={styles['center-content']}
      >
        {isLoading && (
          <div className={styles.progressWrapper}>
            <CircularProgress classes={{ root: 'circular-progress-bar' }}/>
          </div>
        )}
        {currentTab === CalendarView.day && (
          <CalendarDayView
            onScheduleSelect={onScheduleSelect}
            viewDate={viewDate}
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
