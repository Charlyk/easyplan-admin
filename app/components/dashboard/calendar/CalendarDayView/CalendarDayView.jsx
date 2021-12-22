import React, {
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import orderBy from 'lodash/orderBy';
import { extendMoment } from 'moment-range';
import Moment from 'moment-timezone';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import NotificationsContext from 'app/context/notificationsContext';
import areComponentPropsEqual from 'app/utils/areComponentPropsEqual';
import isOutOfBounds from 'app/utils/isOutOfBounds';
import { textForKey } from 'app/utils/localization';
import { fetchSchedulesHours } from 'middleware/api/schedules';
import {
  calendarDoctorsSelector,
  clinicCabinetsSelector,
} from 'redux/selectors/appDataSelector';
import {
  updateScheduleSelector,
  schedulesSelector,
  dayHoursSelector,
} from 'redux/selectors/scheduleSelector';
import styles from './CalendarDayView.module.scss';
import { actions, reducer, initialState } from './CalendarDayView.reducer';

const EasyCalendar = dynamic(() =>
  import('app/components/common/EasyCalendar'),
);
const AddPauseModal = dynamic(() => import('../modals/AddPauseModal'));

const moment = extendMoment(Moment);

const CalendarDayView = ({
  showHourIndicator,
  viewDate,
  onScheduleSelect,
  onCreateSchedule,
}) => {
  const toast = useContext(NotificationsContext);
  const updateSchedule = useSelector(updateScheduleSelector);
  const schedules = useSelector(schedulesSelector);
  const hours = useSelector(dayHoursSelector);
  const cabinets = useSelector(clinicCabinetsSelector);
  const doctors = useSelector(calendarDoctorsSelector);
  const schedulesRef = useRef(null);
  const [{ pauseModal }, localDispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    handleScheduleUpdate();
  }, [updateSchedule]);

  useEffect(() => {
    if (schedulesRef.current != null) {
      const schedulesRect = schedulesRef.current.getBoundingClientRect();
      localDispatch(actions.setParentTop(schedulesRect.top));
    }
  }, [schedulesRef.current]);

  async function handleScheduleUpdate() {
    if (updateSchedule == null) {
      return;
    }
    const scheduleDate = moment(updateSchedule.startTime);
    const currentDate = moment(viewDate);

    if (!scheduleDate.isSame(currentDate, 'date')) {
      return;
    }

    if (isOutOfBounds(updateSchedule.endTime, hours, viewDate)) {
      await fetchDayHours(scheduleDate.toDate());
    }
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
   * @param {(ClinicCabinet | null)?} cabinet
   * @param {Date|null} startTime
   * @param {Date|null} endTime
   * @param {number|null} id
   * @param {string|null} comment
   */
  const handleOpenPauseModal = (
    doctor,
    cabinet,
    startTime,
    endTime,
    id,
    comment,
  ) => {
    const pauseModal = {
      open: true,
      doctor,
      cabinet,
      startTime,
      endTime,
      id,
      comment,
      viewDate: moment(viewDate),
    };
    localDispatch(actions.setPauseModal(pauseModal));
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
   * @param {number?} cabinetId
   * @return {function(*=, *=): void}
   */
  const handleAddSchedule = (
    startHour,
    endHour,
    doctorId,
    selectedDate,
    cabinetId,
  ) => {
    const doctor = doctors.find((item) => item.id === doctorId);
    const cabinet = cabinets.find((item) => item.id === cabinetId);
    onCreateSchedule(doctor, startHour, endHour, selectedDate, null, cabinet);
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
      const cabinet = cabinets.find((item) => item.id === schedule.cabinetId);
      if (doctor != null) {
        handleCreatePause(
          doctor,
          cabinet,
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
   * @param {(ClinicCabinet | null)?} cabinet
   * @param {Date|null} startHour
   * @param {Date|null} endHour
   * @param {number|null} id
   * @param {string|null} comment
   */
  const handleCreatePause = (
    doctor,
    cabinet = null,
    startHour = null,
    endHour = null,
    id = null,
    comment = null,
  ) => {
    if (doctor?.isHidden) {
      toast.warn(textForKey('doctor_is_fired'));
      return;
    }
    handleOpenPauseModal(doctor, cabinet, startHour, endHour, id, comment);
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
    const cabinet = cabinets.find((cabinet) => cabinet.id === item.id);
    const doctor = doctors.find((doctor) => doctor.id === item.id);
    handleCreatePause(doctor, cabinet);
  };

  const mappedDoctors = useMemo(() => {
    // get doctors that are not assigned to any cabinet
    const doctorsWithoutCabinets = doctors.filter(
      (doctor) => doctor.cabinets.length === 0,
    );
    // map cabinets to column structure
    const mappedCabinets = cabinets.map((cabinet) => {
      const doctorsInCabinet = doctors.filter((doctor) =>
        doctor.cabinets.some((cab) => cab.id === cabinet.id),
      );
      // add a hint to show doctors names on hover
      const hint = doctorsInCabinet.map((doctor) => doctor.fullName).join(', ');
      return {
        id: cabinet.id,
        name: cabinet.name,
        hint,
      };
    });
    // map independent doctors to column structure
    const mappedDoctors = doctorsWithoutCabinets.map((doctor) => ({
      id: doctor.id,
      doctorId: doctor.id,
      name: `${doctor.firstName} ${doctor.lastName}`,
      disabled: doctor.isInVacation,
      date: viewDate,
    }));
    return orderBy([...mappedDoctors, ...mappedCabinets], 'name', 'asc');
  }, [doctors, cabinets, viewDate]);

  return (
    <div className={styles.calendarDayView} id='calendar-day-view'>
      <AddPauseModal {...pauseModal} onClose={handleClosePauseModal} />
      <EasyCalendar
        viewDate={viewDate}
        dayHours={hours}
        columns={mappedDoctors}
        schedules={schedules}
        showHourIndicator={showHourIndicator}
        animatedStatuses={['WaitingForPatient']}
        onAddSchedule={handleAddSchedule}
        onScheduleSelected={handleScheduleClick}
        onHeaderItemClick={handleHeaderItemClick}
      />
    </div>
  );
};

export default React.memo(CalendarDayView, areComponentPropsEqual);

CalendarDayView.propTypes = {
  schedules: PropTypes.any,
  dayHours: PropTypes.arrayOf(PropTypes.string),
  showHourIndicator: PropTypes.bool,
  onScheduleSelect: PropTypes.func,
  onCreateSchedule: PropTypes.func,
};

CalendarDayView.defaultProps = {
  onCreateSchedule: () => null,
  onScheduleSelect: () => null,
  viewDate: new Date(),
};
