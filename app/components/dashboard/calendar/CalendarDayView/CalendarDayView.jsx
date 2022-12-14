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
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-polyglot';
import { useDispatch, useSelector } from 'react-redux';
import CalendarNoDataView from 'app/components/common/CalendarNoDataView';
import NotificationsContext from 'app/context/notificationsContext';
import areComponentPropsEqual from 'app/utils/areComponentPropsEqual';
import isOutOfBounds from 'app/utils/isOutOfBounds';
import { fetchSchedulesHours } from 'middleware/api/schedules';
import {
  calendarDoctorsSelector,
  clinicCabinetsSelector,
  isManagerSelector,
  userCalendarOrderSelector,
} from 'redux/selectors/appDataSelector';
import {
  dayHoursSelector,
  filteredSchedulesSelector,
  updateScheduleSelector,
} from 'redux/selectors/scheduleSelector';
import { dispatchChangeDoctorCalendarOrder } from 'redux/slices/appDataSlice';
import styles from './CalendarDayView.module.scss';
import { actions, initialState, reducer } from './CalendarDayView.reducer';

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
  const textForKey = useTranslate();
  const router = useRouter();
  const dispatch = useDispatch();
  const toast = useContext(NotificationsContext);
  const isManager = useSelector(isManagerSelector);
  const updateSchedule = useSelector(updateScheduleSelector);
  const schedules = useSelector(filteredSchedulesSelector);
  const hours = useSelector(dayHoursSelector);
  const cabinets = useSelector(clinicCabinetsSelector);
  const doctors = useSelector(calendarDoctorsSelector);
  const calendarOrders = useSelector(userCalendarOrderSelector);
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

  const handleOpenClinicSettings = async () => {
    await router.push({ pathname: '/settings/working-hours' });
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

  const handleUpdateCalendarOrder = (entityId, direction, entityType) => {
    dispatch(
      dispatchChangeDoctorCalendarOrder({
        entityId,
        type: entityType,
        direction,
      }),
    );
  };

  const handleUpdateDoctorCalendarOrder = (doctor, direction) => {
    if (doctor == null) return;
    handleUpdateCalendarOrder(doctor.id, direction, 'Doctor');
  };

  const handleUpdateCabinetCalendarOrder = (cabinet, direction) => {
    if (cabinet == null) return;
    handleUpdateCalendarOrder(cabinet.id, direction, 'Cabinet');
  };

  const handleMoveColumnLeft = (column) => {
    if (column.isCabinet) {
      const cabinet = cabinets.find((cabinet) => cabinet.id === column.id);
      handleUpdateCabinetCalendarOrder(cabinet, 'Previous');
    } else {
      const doctor = doctors.find((doctor) => doctor.id === column.id);
      handleUpdateDoctorCalendarOrder(doctor, 'Previous');
    }
  };

  const handleMoveColumnRight = (column) => {
    if (column.isCabinet) {
      const cabinet = cabinets.find((cabinet) => cabinet.id === column.id);
      handleUpdateCabinetCalendarOrder(cabinet, 'Next');
    } else {
      const doctor = doctors.find((doctor) => doctor.id === column.id);
      handleUpdateDoctorCalendarOrder(doctor, 'Next');
    }
  };

  const mappedColumns = useMemo(() => {
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

      const calendarOrder = calendarOrders?.find(
        (item) => item.entityId === cabinet.id && item.entityType === 'Cabinet',
      ) ?? { orderId: 0 };

      return {
        id: cabinet.id,
        name: cabinet.name,
        hint,
        date: viewDate,
        isCabinet: true,
        orderId: calendarOrder.orderId,
      };
    });

    // map independent doctors to column structure
    const mappedDoctors = doctorsWithoutCabinets.map((doctor) => {
      const calendarOrder = calendarOrders?.find(
        (item) => item.entityId === doctor.id && item.entityType === 'Doctor',
      ) ?? { orderId: 0 };

      return {
        id: doctor.id,
        doctorId: doctor.id,
        name: `${doctor.firstName} ${doctor.lastName}`,
        disabled: doctor.isInVacation,
        isCabinet: false,
        orderId: calendarOrder.orderId,
        date: viewDate,
      };
    });
    return orderBy([...mappedDoctors, ...mappedCabinets], 'orderId', 'asc');
  }, [doctors, cabinets, viewDate, calendarOrders]);

  return (
    <div className={styles.calendarDayView} id='calendar-day-view'>
      {pauseModal.open && (
        <AddPauseModal {...pauseModal} onClose={handleClosePauseModal} />
      )}
      <EasyCalendar
        canMoveColumns
        viewDate={viewDate}
        dayHours={hours}
        columns={mappedColumns}
        schedules={schedules}
        noDataView={
          <CalendarNoDataView
            showButton={isManager}
            onSetupHours={handleOpenClinicSettings}
          />
        }
        showHourIndicator={showHourIndicator}
        animatedStatuses={['WaitingForPatient']}
        onAddSchedule={handleAddSchedule}
        onScheduleSelected={handleScheduleClick}
        onHeaderItemClick={handleHeaderItemClick}
        onMoveColumnLeft={handleMoveColumnLeft}
        onMoveColumnRight={handleMoveColumnRight}
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
