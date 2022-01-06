import React, { useMemo, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { extendMoment } from 'moment-range';
import Moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import IconUmbrella from 'app/components/icons/iconUmbrella';
import areComponentPropsEqual from 'app/utils/areComponentPropsEqual';
import createContainerHours from 'app/utils/createContainerHours';
import { textForKey } from 'app/utils/localization';
import { clinicDoctorsSelector } from 'redux/selectors/appDataSelector';
import { requestUpdateScheduleDateAndDoctor } from 'redux/slices/calendarData';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import { dragItemTypes } from 'types';
import OptionsSelectionModal from '../../modals/OptionsSelectionModal';
import Schedule from '../Schedule';
import ColumnCell from './ColumnCell';
import styles from './ColumnsWrapper.module.scss';

const moment = extendMoment(Moment);
const maxOffset = 6;

const Column = ({
  schedules,
  hours,
  column,
  animatedStatuses,
  hideCreateIndicator,
  onAddSchedule,
  onScheduleSelected,
}) => {
  const dispatch = useDispatch();
  const hoursContainers = createContainerHours(hours);
  const handleAddSchedule = (startHour, endHour) => {
    onAddSchedule(startHour, endHour, column.doctorId, column.date, column.id);
  };
  const clinicDoctors = useSelector(clinicDoctorsSelector);
  const [selectDoctorsModal, setSelectDoctorsModal] = useState(false);
  const [schedule, setSchedule] = useState({});
  const [body, setBody] = useState({
    doctorId: null,
    cabinetId: null,
    startDate: null,
    doctorServices: null,
  });

  const isColumnCabinet = !Object.prototype.hasOwnProperty.call(
    column,
    'doctorId',
  );

  const cabinetDoctors = useMemo(() => {
    return isColumnCabinet
      ? clinicDoctors.filter((doctor) =>
          doctor.cabinets.some((docCabinet) => docCabinet.id === column.id),
        )
      : null;
  }, [column]);

  const handleOnDropCell = (startHour, schedule) => {
    const [hours, minutes] = startHour.split(':');
    const startDate = Moment(column.date)
      .set({
        hour: parseInt(hours),
        minute: parseInt(minutes),
      })
      .toDate()
      .toString();

    if (!isColumnCabinet) {
      const selectedDoctor = clinicDoctors.filter(
        (doctor) => doctor.id === column.doctorId,
      );
      const doctorServices = selectedDoctor[0]?.services;
      const body = {
        doctorId: column?.doctorId,
        cabinetId: null,
        startDate,
        doctorServices,
      };
      dispatch(requestUpdateScheduleDateAndDoctor({ schedule, body }));
    } else {
      setSchedule(schedule);
      setBody({
        cabinetId: column.id,
        startDate,
        doctorServices: null,
        doctorId: null,
      });
      if (cabinetDoctors.length === 0) {
        dispatch(
          showErrorNotification(textForKey('this_cabinet_has_no_doctors')),
        );
        return;
      }
      setSelectDoctorsModal(true);
    }
  };

  const handleModalConfirm = (selectedDoctor) => {
    if (selectedDoctor.length === 0) {
      dispatch(
        showErrorNotification(textForKey('select doctor from the list')),
      );
      return;
    }
    const reqBody = {
      ...body,
      doctorId: selectedDoctor[0]?.id,
      doctorServices: selectedDoctor[0]?.services,
    };

    dispatch(requestUpdateScheduleDateAndDoctor({ schedule, body: reqBody }));
    setSelectDoctorsModal(false);
  };

  const handleCloseModal = () => {
    setSelectDoctorsModal(false);
  };

  const isColumnDisabled = () =>
    Object.prototype.hasOwnProperty.call(column, 'disabled') &&
    column?.disabled;

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: dragItemTypes.Schedule,
    canDrop: () => !isColumnDisabled(),
    collect(monitor) {
      return {
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      };
    },
  }));

  const [filteredSchedules, filteredPauses] = useMemo(() => {
    const filteredSchedules = [];
    const filteredPauses = [];
    for (const schedule of schedules) {
      if (schedule.type === 'Schedule') {
        filteredSchedules.push(schedule);
      } else if (schedule.type === 'Pause') {
        filteredPauses.push(schedule);
      }
    }
    return [filteredSchedules, filteredPauses];
  }, [schedules]);

  const schedulesWithOffset = useMemo(() => {
    const newSchedules = [];
    // check if schedules intersect other schedules and update their offset
    for (let schedule of filteredSchedules) {
      const scheduleRange = moment.range(
        moment(schedule.startTime),
        moment(schedule.endTime),
      );
      let offset = 0;
      // update new schedule offset based on already added schedules
      if (schedule.type !== 'Pause') {
        for (let item of newSchedules) {
          const itemRange = moment.range(
            moment(item.startTime),
            moment(item.endTime),
          );
          const hasIntersection = scheduleRange.intersect(itemRange) != null;
          if (hasIntersection) {
            offset = (item.offset || 0) + 1;
          }
          if (offset > maxOffset) {
            offset = 0;
          }
        }
      }
      // add the new schedules to array to check the next one against it
      if (!newSchedules.some((item) => item.id === schedule.id)) {
        newSchedules.push({ ...schedule, offset });
      }
    }
    return newSchedules;
  }, [schedules, column]);

  function renderHoursContainers() {
    return hoursContainers.map((hour, index) => {
      if (index === 0) {
        return (
          <ColumnCell
            key={`schedule-item-${hour}`}
            hideCreateIndicator={hideCreateIndicator}
            startHour={null}
            endHour={hour}
            disabled={column.disabled}
            onAddSchedule={handleAddSchedule}
            handleOnDropCell={handleOnDropCell}
          />
        );
      } else if (index + 1 === hoursContainers.length) {
        return (
          <ColumnCell
            key={`${hoursContainers[index]}-schedule-item`}
            hideCreateIndicator={hideCreateIndicator}
            startHour={hoursContainers[index]}
            endHour={null}
            disabled={column.disabled}
            onAddSchedule={handleAddSchedule}
            handleOnDropCell={handleOnDropCell}
          />
        );
      } else {
        return (
          <ColumnCell
            key={`${hoursContainers[index - 1]}-schedule-item-${hour}`}
            hideCreateIndicator={hideCreateIndicator}
            startHour={hoursContainers[index - 1]}
            endHour={hour}
            disabled={column.disabled}
            onAddSchedule={handleAddSchedule}
            handleOnDropCell={handleOnDropCell}
          />
        );
      }
    });
  }

  return (
    <>
      <div
        ref={drop}
        className={clsx(styles.columnRoot, {
          [styles.disabled]: column.disabled,
          [styles.isDraggedOver]: isOver && canDrop,
        })}
      >
        {column.disabled && (
          <div className={styles.disabledWrapper}>
            <IconUmbrella />
            <Typography className={styles.disabledLabel}>
              {textForKey('doctor_vacation_message')}
            </Typography>
          </div>
        )}
        {renderHoursContainers()}
        {filteredPauses.map((schedule, index) => (
          <Schedule
            key={schedule.id}
            schedule={schedule}
            animatedStatuses={animatedStatuses}
            index={index}
            firstHour={hours[0]}
            onScheduleSelect={onScheduleSelected}
          />
        ))}
        {schedulesWithOffset.map((schedule, index) => (
          <Schedule
            key={schedule.id}
            schedule={schedule}
            animatedStatuses={animatedStatuses}
            index={index}
            firstHour={hours[0]}
            onScheduleSelect={onScheduleSelected}
          />
        ))}
      </div>
      {selectDoctorsModal && (
        <OptionsSelectionModal
          show={selectDoctorsModal}
          onClose={handleCloseModal}
          title={textForKey('select doctor from the list')}
          onConfirm={handleModalConfirm}
          iterable={cabinetDoctors.map((doctor) => ({
            ...doctor,
            name: doctor.fullName,
          }))}
        />
      )}
    </>
  );
};

export default React.memo(Column, areComponentPropsEqual);

Column.propTypes = {
  disabled: PropTypes.bool,
  viewDate: PropTypes.instanceOf(Date),
  hideCreateIndicator: PropTypes.bool,
  hours: PropTypes.arrayOf(PropTypes.string),
  isSingleMode: PropTypes.bool,
  column: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    doctorId: PropTypes.number,
    name: PropTypes.string,
    disabled: PropTypes.bool,
    date: PropTypes.instanceOf(Date),
    hint: PropTypes.string,
  }),
  schedules: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      comment: PropTypes.string,
      doctorId: PropTypes.number,
      startTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      endTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      isUrgent: PropTypes.bool,
      urgent: PropTypes.bool,
      patient: PropTypes.shape({
        id: PropTypes.number,
        fullName: PropTypes.string,
      }),
      scheduleStatus: PropTypes.string,
      serviceColor: PropTypes.string,
      serviceCurrency: PropTypes.string,
      serviceId: PropTypes.number,
      serviceName: PropTypes.string,
      servicePrice: PropTypes.number,
      type: PropTypes.string,
    }),
  ),
  animatedStatuses: PropTypes.arrayOf(
    PropTypes.oneOf([
      'Pending',
      'OnSite',
      'Confirmed',
      'WaitingForPatient',
      'Late',
      'DidNotCome',
      'Canceled',
      'CompletedNotPaid',
      'CompletedPaid',
      'PartialPaid',
      'Paid',
      'Rescheduled',
    ]),
  ),
  onAddSchedule: PropTypes.func,
  onScheduleSelected: PropTypes.func,
};

Column.defaultProps = {
  hours: [],
  schedules: [],
  onAddSchedule: () => null,
};
