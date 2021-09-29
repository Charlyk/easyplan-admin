import React, { useRef, useState } from "react";
import dynamic from 'next/dynamic';
import clsx from "clsx";
import PropTypes from 'prop-types';
import MaterialButton from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import Popper from "@material-ui/core/Popper";
import ArrowRight from "@material-ui/icons/KeyboardArrowRight";
import UploadIcon from "@material-ui/icons/CloudUpload";
import Button from "react-bootstrap/Button";
import { Calendar } from "react-date-range";
import * as locales from "react-date-range/dist/locale";
import moment from "moment-timezone";

import IconAppointmentCalendar from "../../../icons/iconAppointmentCalendar";
import { getAppLanguage, textForKey } from "../../../../../utils/localization";
import EasyTab from "../../../common/EasyTab";
import LoadingButton from "../../../common/LoadingButton";
import IconPlus from "../../../icons/iconPlus";
import IconInfo from "../../../icons/iconInfo";
import styles from "./CalendarHeader.module.scss";
import areComponentPropsEqual from "../../../../utils/areComponentPropsEqual";

const CalendarLegend = dynamic(() => import("../CalendarLegend"));

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
      className={styles.appointmentsDatePickerRoot}
      anchorEl={calendarAnchor.current}
      open={calendarVisible}
      placement='bottom'
      transition
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper className={styles.calendarPaper}>
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
    <div className={styles.centerHeader}>
      <div className={clsx(styles.controlsWrapper, 'flexContainer')}>
        <IconButton
          onClick={handleDateNavigation('previous-date')}
          classes={{ root: styles.arrowButton, label: styles.buttonIcon }}
        >
          <ArrowLeft/>
        </IconButton>
        <Button
          ref={calendarAnchor}
          className={clsx('positive-button', styles.calendarBtn)}
          onClick={handleOpenCalendar}
        >
          <Typography noWrap className={styles.dateBtnLabel}>
            {dateBtnText}
          </Typography>
          <IconAppointmentCalendar fill='#fff'/>
        </Button>
        <IconButton
          onClick={handleDateNavigation('next-date')}
          classes={{ root: styles.arrowButton, label: styles.buttonIcon }}
        >
          <ArrowRight/>
        </IconButton>
        <MaterialButton
          onClick={handleTodayClick}
          classes={{ root: styles.todayBtn }}
        >
          {textForKey('Today')}
        </MaterialButton>
      </div>
      {calendarPopper}
      <CalendarLegend open={legendVisible} anchorEl={legendAnchor}/>
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
        <LoadingButton
          variant='outline-primary'
          className={clsx('btn-outline-primary', styles.importBtn)}
          onClick={onImportSchedules}
        >
          <UploadIcon/>
        </LoadingButton>
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
          className={clsx('positive-button', styles.addAppointmentBtn)}
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

export default React.memo(CalendarHeader, areComponentPropsEqual);
