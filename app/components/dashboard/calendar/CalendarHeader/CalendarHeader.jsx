import React, { useRef, useState } from 'react';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import UploadIcon from '@material-ui/icons/CloudUpload';
import ArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import ArrowRight from '@material-ui/icons/KeyboardArrowRight';
import clsx from 'clsx';
import moment from 'moment-timezone';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import EASTextField from 'app/components/common/EASTextField';
import EasyDatePicker from 'app/components/common/EasyDatePicker';
import EasyTab from 'app/components/common/EasyTab';
import IconAppointmentCalendar from 'app/components/icons/iconAppointmentCalendar';
import IconInfo from 'app/components/icons/iconInfo';
import IconPlus from 'app/components/icons/iconPlus';
import IconSearch from 'app/components/icons/iconSearch';
import areComponentPropsEqual from 'app/utils/areComponentPropsEqual';
import { textForKey } from 'app/utils/localization';
import { updateFilterData } from 'redux/slices/calendarData';
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
  const dispatch = useDispatch();
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

  const handleSearchInputChange = (patientName) => {
    const lowerCaseName = patientName.toLowerCase();
    dispatch(updateFilterData({ searchQuery: lowerCaseName }));
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
        {currentTab !== 'month' && (
          <div className={styles.searchGroupWrapper}>
            <IconSearch fill={'#3A83DC'} />
            <EASTextField
              onChange={handleSearchInputChange}
              fieldClass={styles.searchField}
              placeholder={textForKey('patient name')}
            />
          </div>
        )}
        <IconButton
          className={styles.rightSideBtn}
          onPointerUp={onImportSchedules}
        >
          <UploadIcon style={{ fill: '#3A83DC' }} />
        </IconButton>
        <ClickAwayListener onClickAway={handleCloseLegend}>
          <IconButton
            ref={legendAnchor}
            className={styles.rightSideBtn}
            onPointerUp={handleShowLegend}
          >
            <IconInfo fill='#3A83DC' />
          </IconButton>
        </ClickAwayListener>
        <Tooltip
          title={
            <Typography fontSize={11}>
              {textForKey('Add appointment')}
            </Typography>
          }
          arrow
          placement='left'
        >
          <IconButton
            className={styles.rightSideBtn}
            disabled={!canAddAppointment}
            onPointerUp={handleAddAppointment}
          >
            <IconPlus fill={'#3A83DC'} />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

// {textForKey('Add appointment')}

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
