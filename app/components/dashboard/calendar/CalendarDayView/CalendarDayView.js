import React, {
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { extendMoment } from 'moment-range';
import Moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";
import { updateScheduleSelector } from '../../../../../redux/selectors/scheduleSelector';
import { wrapper } from "../../../../../store";
import { fetchSchedulesHours } from "../../../../../middleware/api/schedules";
import EasyCalendar from "../../../common/EasyCalendar";
import AddPauseModal from '../modals/AddPauseModal';
import { actions, reducer, initialState } from './CalendarDayView.reducer'
import styles from './CalendarDayView.module.scss';

const moment = extendMoment(Moment);

const CalendarDayView = (
  {
    schedules: initialSchedules,
    doctors,
    viewDate,
    dayHours,
    onScheduleSelect,
    onCreateSchedule
  }) => {
  const updateSchedule = useSelector(updateScheduleSelector);
  const schedulesRef = useRef(null);
  const [
    { hours, pauseModal, schedules },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    if (updateSchedule == null) {
      return;
    }
    const scheduleDate = moment(updateSchedule.startTime);
    const currentDate = moment(viewDate)

    if (!scheduleDate.isSame(currentDate, 'date')) {
      return;
    }

    if (isOutOfBounds(updateSchedule.endTime)) {
      fetchDayHours(scheduleDate.toDate());
    }
  }, [updateSchedule]);

  useEffect(() => {
    if (schedulesRef.current != null) {
      const schedulesRect = schedulesRef.current.getBoundingClientRect();
      localDispatch(actions.setParentTop(schedulesRect.top));
    }
  }, [schedulesRef.current]);

  useEffect(() => {
    localDispatch(actions.setSchedules(initialSchedules));
  }, [initialSchedules]);

  useEffect(() => {
    localDispatch(actions.setHours(dayHours));
  }, [dayHours]);

  const lastHourDate = useMemo(() => {
    const lastHour = hours[hours.length - 1];
    if (lastHour == null) {
      return moment();
    }
    const [maxHour, maxMinute] = lastHour.split(':');
    return moment(viewDate)
      .set('hour', parseInt(maxHour))
      .set('minute', parseInt(maxMinute));
  }, [hours, viewDate]);

  const isOutOfBounds = (time) => {
    if (hours.length === 0) {
      return true;
    }
    const scheduleTime = moment(time);
    return scheduleTime.isAfter(lastHourDate);
  }

  const fetchDayHours = async (date) => {
    try {
      const query = { date: moment(date).format('YYYY-MM-DD') };
      const response = await fetchSchedulesHours(query);
      localDispatch(actions.setHours(response.data));
    } catch (error) {
      toast.error(error.message);
    }
  };

  /**
   * Open pause details modal
   * @param {Object} doctor
   * @param {Date|null} startTime
   * @param {Date|null} endTime
   * @param {number|null} id
   * @param {string|null} comment
   */
  const handleOpenPauseModal = (doctor, startTime, endTime, id, comment) => {
    localDispatch(
      actions.setPauseModal({
        open: true,
        doctor,
        startTime,
        endTime,
        id,
        comment,
        viewDate: moment(viewDate),
      }),
    );
  };

  /**
   * Close pause details modal
   */
  const handleClosePauseModal = () => {
    localDispatch(actions.setPauseModal(initialState.pauseModal));
  };

  /**
   * Trigger add schedule callback
   * @param {number} doctorId
   * @param {string} startHour
   * @param {string} endHour
   * @param {Date} selectedDate
   * @return {function(*=, *=): void}
   */
  const handleAddSchedule = (startHour, endHour, doctorId, selectedDate) => {
    const doctor = doctors.find(item => item.id === doctorId);
    onCreateSchedule(doctor, startHour, endHour, selectedDate);
  };

  /**
   * Handle user clicked on a schedule
   * @param {Object} schedule
   */
  const handleScheduleClick = (schedule) => {
    if (schedule.type === 'Schedule') {
      onScheduleSelect(schedule);
    } else {
      const doctor = doctors.find((item) => item.id === schedule.doctorId);
      if (doctor != null) {
        handleCreatePause(
          doctor,
          schedule.startTime,
          schedule.endTime,
          schedule.id,
          schedule.comment,
        );
      }
    }
  };

  /**
   * Create a pause record
   * @param {Object} doctor
   * @param {Date|null} startHour
   * @param {Date|null} endHour
   * @param {number|null} id
   * @param {string|null} comment
   */
  const handleCreatePause = (
    doctor,
    startHour = null,
    endHour = null,
    id = null,
    comment = null,
  ) => {
    handleOpenPauseModal(doctor, startHour, endHour, id, comment);
  };

  /**
   * Called when a header item is clicked in calendar
   * @param {{
   *   id: string|number,
   *   name: string,
   *   disabled: boolean
   * }} item
   */
  const handleHeaderItemClick = (item) => {
    const doctor = doctors.find(doctor => doctor.id === item.id);
    handleCreatePause(doctor);
  }

  const mappedDoctors = useMemo(() => {
    return doctors.map((doctor) => ({
      id: doctor.id,
      doctorId: doctor.id,
      name: `${doctor.firstName} ${doctor.lastName}`,
      disabled: doctor.isInVacation,
      date: viewDate,
    }));
  }, [doctors]);

  return (
    <div className={styles.calendarDayView} id='calendar-day-view'>
      <AddPauseModal {...pauseModal} onClose={handleClosePauseModal}/>
      <EasyCalendar
        viewDate={viewDate}
        dayHours={hours}
        columns={mappedDoctors}
        schedules={schedules}
        animatedStatuses={['WaitingForPatient']}
        onAddSchedule={handleAddSchedule}
        onScheduleSelected={handleScheduleClick}
        onHeaderItemClick={handleHeaderItemClick}
      />
    </div>
  );
};

export default wrapper.withRedux(CalendarDayView);

CalendarDayView.propTypes = {
  schedules: PropTypes.any,
  dayHours: PropTypes.arrayOf(PropTypes.string),
  onScheduleSelect: PropTypes.func,
  onCreateSchedule: PropTypes.func,
};

CalendarDayView.defaultProps = {
  onCreateSchedule: () => null,
  onScheduleSelect: () => null,
  viewDate: new Date(),
};
