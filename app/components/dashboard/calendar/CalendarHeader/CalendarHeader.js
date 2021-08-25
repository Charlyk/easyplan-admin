import React, { useRef, useState } from "react";
import PropTypes from 'prop-types';
import clsx from "clsx";
import { Button as MaterialButton, ClickAwayListener, Fade, IconButton, Paper } from "@material-ui/core";
import ArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import { Button } from "react-bootstrap";
import IconAppointmentCalendar from "../../../../../components/icons/iconAppointmentCalendar";
import ArrowRight from "@material-ui/icons/KeyboardArrowRight";
import { getAppLanguage, textForKey } from "../../../../../utils/localization";
import EasyTab from "../../../../../components/common/EasyTab";
import LoadingButton from "../../../../../components/common/LoadingButton";
import UploadIcon from "@material-ui/icons/CloudUpload";
import IconPlus from "../../../../../components/icons/iconPlus";
import Popper from "@material-ui/core/Popper";
import { Calendar } from "react-date-range";
import * as locales from "react-date-range/dist/locale";
import moment from "moment-timezone";
import CalendarLegend from "../CalendarLegend";
import IconInfo from "../../../../../components/icons/iconInfo";
import styles from "./CalendarHeader.module.scss";

const CalendarView = {
  day: 'day',
  week: 'week',
  month: 'month',
  year: 'ear',
};

const CalendarHeader = (
  {
    viewDate,
    dateBtnText,
    currentTab,
    canAddAppointment,
    onImportSchedules,
    onTabChange,
    onDateChange,
    onAddAppointment,
  }
) => {
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

  const handleAddAppointment = () => {
    onAddAppointment();
  };

  const handleShowLegend = () => {
    setLegendVisible(true);
  }

  const handleCloseLegend = () => {
    setLegendVisible(false);
  }

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
    <div className={styles['center-header']}>
      <div className={clsx(styles['controls-wrapper'], 'flexContainer')}>
        <IconButton
          onClick={handleDateNavigation('previous-date')}
          classes={{ root: styles['arrow-button'], label: styles['button-icon'] }}
        >
          <ArrowLeft/>
        </IconButton>
        <Button
          ref={calendarAnchor}
          className={clsx('positive-button', styles['calendar-btn'])}
          onClick={handleOpenCalendar}
        >
          {dateBtnText}
          <IconAppointmentCalendar fill='#fff'/>
        </Button>
        <IconButton
          onClick={handleDateNavigation('next-date')}
          classes={{ root: styles['arrow-button'], label: styles['button-icon'] }}
        >
          <ArrowRight/>
        </IconButton>
        <MaterialButton
          onClick={handleTodayClick}
          classes={{ root: styles['today-btn'] }}
        >
          {textForKey('Today')}
        </MaterialButton>
      </div>
      {calendarPopper}
      <CalendarLegend open={legendVisible} anchorEl={legendAnchor}/>
      <div className={styles['center-header__tabs']}>
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
      <div className={clsx(styles['right-btns-wrapper'], 'flexContainer')}>
        <ClickAwayListener onClickAway={handleCloseLegend}>
          <IconButton
            ref={legendAnchor}
            className={styles.legendBtn}
            onClick={handleShowLegend}
          >
            <IconInfo fill='#3A83DC'/>
          </IconButton>
        </ClickAwayListener>
        <Button
          className={clsx('positive-button', styles['add-appointment-btn'])}
          disabled={!canAddAppointment}
          onClick={handleAddAppointment}
        >
          {textForKey('Add appointment')}
          <IconPlus/>
        </Button>
      </div>
    </div>
  )
}

CalendarHeader.propTypes = {
  dateBtnText: PropTypes.string,
  viewDate: PropTypes.instanceOf(Date),
  canAddAppointment: PropTypes.bool,
  currentTab: PropTypes.oneOf([CalendarView.day, CalendarView.week, CalendarView.month]),
  onAddAppointment: PropTypes.func,
  onTabChange: PropTypes.func,
  onImportSchedules: PropTypes.func,
  onDateChange: PropTypes.func,
}

export default CalendarHeader;
