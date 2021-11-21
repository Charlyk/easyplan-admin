import React, { useRef, useState } from 'react';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import UploadIcon from '@material-ui/icons/CloudUpload';
import ArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import ArrowRight from '@material-ui/icons/KeyboardArrowRight';
import clsx from 'clsx';
import moment from 'moment-timezone';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import EasyDatePicker from 'app/components/common/EasyDatePicker';
import EasyTab from 'app/components/common/EasyTab';
import IconAppointmentCalendar from 'app/components/icons/iconAppointmentCalendar';
import IconInfo from 'app/components/icons/iconInfo';
import IconPlus from 'app/components/icons/iconPlus';
import areComponentPropsEqual from 'app/utils/areComponentPropsEqual';
import { textForKey } from 'app/utils/localization';
import styles from './CalendarHeader.module.scss';

const CalendarLegend = dynamic(() => import('../CalendarLegend'));

const CalendarView = {
  day: 'day',
  week: 'week',
  month: 'month',
  year: 'ear',
};

const CalendarHeader = ({
  viewDate,
  dateBtnText,
  currentTab,
  canAddAppointment,
  onImportSchedules,
  onTabChange,
  onDateChange,
  onAddAppointment,
}) => {
  const calendarAnchor = useRef(null);
  const legendAnchor = useRef(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [legendVisible, setLegendVisible] = useState(false);

  const handleOpenCalendar = () => setCalendarVisible(true);

  const handleCloseCalendar = () => setCalendarVisible(false);

  const handleDateChange = (date) => {
    onDateChange(date);
    handleCloseCalendar();
  };

  const handleTodayClick = () => {
    handleDateChange(new Date());
  };

  const handleAddAppointment = (event) => {
    event?.stopPropagation();
    onAddAppointment();
  };

  const handleShowLegend = () => {
    setLegendVisible(true);
  };

  const handleCloseLegend = () => {
    setLegendVisible(false);
  };

  const handleDateNavigation = (navId) => () => {
    const currentDate = moment(viewDate);
    switch (navId) {
      case 'previous-date':
        if (currentTab === CalendarView.day) {
          onDateChange(currentDate.add(-1, 'day').toDate());
        } else if (currentTab === CalendarView.week) {
          onDateChange(currentDate.add(-1, 'week').toDate());
        } else if (currentTab === CalendarView.month) {
          onDateChange(currentDate.set('day', 1).subtract(1, 'month').toDate());
        }
        break;
      case 'next-date':
        if (currentTab === CalendarView.day) {
          onDateChange(currentDate.add(1, 'day').toDate());
        } else if (currentTab === CalendarView.week) {
          onDateChange(currentDate.add(1, 'week').toDate());
        } else if (currentTab === CalendarView.month) {
          onDateChange(currentDate.set('day', 1).add(1, 'month').toDate());
        }
        break;
    }
  };

  const calendarPopper = (
    <EasyDatePicker
      disablePortal={false}
      open={calendarVisible}
      selectedDate={viewDate}
      placement='bottom'
      pickerAnchor={calendarAnchor.current}
      onChange={handleDateChange}
      onClose={handleCloseCalendar}
    />
  );

  return (
    <div className={styles.centerHeader}>
      <div className={clsx(styles.controlsWrapper, 'flexContainer')}>
        <IconButton
          onClick={handleDateNavigation('previous-date')}
          classes={{ root: styles.arrowButton, label: styles.buttonIcon }}
        >
          <ArrowLeft />
        </IconButton>
        <Button
          ref={calendarAnchor}
          className={clsx('positive-button', styles.calendarBtn)}
          onClick={handleOpenCalendar}
        >
          <Typography noWrap className={styles.dateBtnLabel}>
            {dateBtnText}
          </Typography>
          <IconAppointmentCalendar fill='#fff' />
        </Button>
        <IconButton
          onClick={handleDateNavigation('next-date')}
          classes={{ root: styles.arrowButton, label: styles.buttonIcon }}
        >
          <ArrowRight />
        </IconButton>
        <Button onClick={handleTodayClick} classes={{ root: styles.todayBtn }}>
          {textForKey('Today')}
        </Button>
      </div>
      {calendarPopper}
      <CalendarLegend open={legendVisible} anchorEl={legendAnchor} />
      <div className={styles.tabs}>
        <EasyTab
          title={textForKey('Day')}
          selected={currentTab === CalendarView.day}
          onClick={() => onTabChange(CalendarView.day)}
        />
        <EasyTab
          title={textForKey('Week')}
          selected={currentTab === CalendarView.week}
          onClick={() => onTabChange(CalendarView.week)}
        />
        <EasyTab
          title={textForKey('Month')}
          selected={currentTab === CalendarView.month}
          onClick={() => onTabChange(CalendarView.month)}
        />
      </div>
      <div className={clsx(styles.rightBtnsWrapper, 'flexContainer')}>
        <IconButton
          className={styles.importBtn}
          onPointerUp={onImportSchedules}
        >
          <UploadIcon />
        </IconButton>
        <ClickAwayListener onClickAway={handleCloseLegend}>
          <IconButton
            ref={legendAnchor}
            className={styles.legendBtn}
            onPointerUp={handleShowLegend}
          >
            <IconInfo fill='#3A83DC' />
          </IconButton>
        </ClickAwayListener>
        <Button
          className={clsx('positive-button', styles.addAppointmentBtn)}
          disabled={!canAddAppointment}
          onPointerUp={handleAddAppointment}
        >
          {textForKey('Add appointment')}
          <IconPlus />
        </Button>
      </div>
    </div>
  );
};

CalendarHeader.propTypes = {
  dateBtnText: PropTypes.string,
  viewDate: PropTypes.instanceOf(Date),
  canAddAppointment: PropTypes.bool,
  currentTab: PropTypes.oneOf([
    CalendarView.day,
    CalendarView.week,
    CalendarView.month,
  ]),
  onAddAppointment: PropTypes.func,
  onTabChange: PropTypes.func,
  onImportSchedules: PropTypes.func,
  onDateChange: PropTypes.func,
};

export default React.memo(CalendarHeader, areComponentPropsEqual);
