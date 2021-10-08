import React, { useEffect, useReducer } from 'react';
import dynamic from 'next/dynamic';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { useSelector } from "react-redux";

import {
  deleteScheduleSelector,
  updateScheduleSelector
} from "../../../../../redux/selectors/scheduleSelector";
import getCurrentWeek from '../../../../utils/getCurrentWeek';
import areComponentPropsEqual from "../../../../utils/areComponentPropsEqual";
import { reducer, initialState, actions } from './CalendarWeekView.reducer'
import styles from './CalendarWeekView.module.scss';

const EasyCalendar = dynamic(() => import('../../../common/EasyCalendar'));

const CalendarWeekView = (
  {
    doctorId,
    doctors,
    showHourIndicator,
    schedules: {
      hours: dayHours,
      schedules: initialSchedules
    },
    viewDate,
    onDateClick,
    onScheduleSelect,
    onCreateSchedule,
  }
) => {
  const updateSchedule = useSelector(updateScheduleSelector);
  const deleteSchedule = useSelector(deleteScheduleSelector);
  const [{ schedules, hours }, localDispatch] = useReducer(reducer, initialState);
  const week = getCurrentWeek(viewDate);

  useEffect(() => {
    localDispatch(actions.setSchedules(initialSchedules));
  }, [initialSchedules]);

  useEffect(() => {
    localDispatch(actions.setHours(dayHours));
  }, [dayHours]);

  useEffect(() => {
    handleScheduleUpdate();
  }, [updateSchedule]);

  useEffect(() => {
    handleScheduleDelete();
  }, [deleteSchedule]);

  function handleScheduleDelete() {
    if (deleteSchedule == null) {
      return;
    }

    localDispatch(actions.deleteSchedule(deleteSchedule))
  }

  async function handleScheduleUpdate() {
    if (updateSchedule == null) {
      return;
    }
    const scheduleDate = moment(updateSchedule.startTime);

    if (updateSchedule.doctorId !== doctorId) {
      return;
    }

    const formattedDate = scheduleDate.format('YYYY-MM-DD');
    const scheduleExists = schedules.some((item) =>
      item.id === formattedDate &&
      item.schedules.some((schedule) => schedule.id === updateSchedule.id)
    );

    if (scheduleExists) {
      localDispatch(actions.updateSchedule(updateSchedule));
    } else {
      localDispatch(actions.addSchedule(updateSchedule));
    }
  }

  const handleDayClick = (day) => {
    const date = moment(day.id).toDate();
    onDateClick(date, true);
  };

  const handleCreateSchedule = (startHour, endHour, doctorId, selectedDate) => {
    const dayDate = moment(selectedDate).toDate()
    const doctor = doctors.find(item => item.id === doctorId);
    onCreateSchedule(doctor, startHour, endHour, dayDate);
  }

  const handleScheduleClick = (schedule) => {
    if (schedule.type === 'Schedule') {
      onScheduleSelect(schedule);
    }
  };

  const mappedWeek = week.map((date) => {
    const dayId = moment(date).format('YYYY-MM-DD')
    const day = schedules.find(item => item.id === dayId)
    return {
      id: dayId,
      doctorId,
      name: moment(date).format('DD dddd'),
      disabled: day?.holiday,
      date: date.toDate(),
    };
  });

  return (
    <div className={styles['week-view']}>
      <EasyCalendar
        viewDate={viewDate}
        dayHours={hours}
        schedules={schedules}
        columns={mappedWeek}
        showHourIndicator={showHourIndicator}
        animatedStatuses={['WaitingForPatient']}
        onScheduleSelected={handleScheduleClick}
        onAddSchedule={handleCreateSchedule}
        onHeaderItemClick={handleDayClick}
      />
    </div>
  );
};

export default React.memo(CalendarWeekView, areComponentPropsEqual);

CalendarWeekView.propTypes = {
  schedules: PropTypes.shape({
    hours: PropTypes.arrayOf(PropTypes.string),
    schedules: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      holiday: PropTypes.bool,
      schedules: PropTypes.arrayOf(PropTypes.shape({
        comment: PropTypes.string,
        createdByName: PropTypes.string,
        delayTime: PropTypes.number,
        doctorId: PropTypes.number,
        endTime: PropTypes.string,
        id: PropTypes.number,
        isUrgent: PropTypes.bool,
        patient: PropTypes.shape({
          id: PropTypes.number,
          fullName: PropTypes.string,
        }),
        rescheduled: PropTypes.bool,
        scheduleStatus: PropTypes.string,
        serviceColor: PropTypes.string,
        serviceCurrency: PropTypes.string,
        serviceId: PropTypes.number,
        serviceName: PropTypes.string,
        servicePrice: PropTypes.number,
        startTime: PropTypes.string,
        type: PropTypes.string,
      })),
    }))
  }),
  onScheduleSelect: PropTypes.func,
  opened: PropTypes.bool,
  showHourIndicator: PropTypes.bool,
  hours: PropTypes.arrayOf(PropTypes.string),
  doctorId: PropTypes.number,
  onDateClick: PropTypes.func,
  viewDate: PropTypes.instanceOf(Date),
  selectedSchedule: PropTypes.shape({
    id: PropTypes.number,
    patient: PropTypes.shape({
      id: PropTypes.number,
      fullName: PropTypes.string,
    }),
    serviceName: PropTypes.string,
    serviceColor: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    scheduleStatus: PropTypes.string,
  }),
};

CalendarWeekView.defaulProps = {
  onScheduleSelect: () => null,
};
