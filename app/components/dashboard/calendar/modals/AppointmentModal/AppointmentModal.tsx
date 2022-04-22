import React, { useEffect, useMemo } from 'react';
import { CalendarPreview, IconButton } from '@easyplanpro/easyplan-components';
import { Modal, CircularProgress } from '@material-ui/core';
import { format } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import approximateTime from 'app/utils/approximateTime';
import {
  appointmentSelector,
  appointmentSchedulesSelector,
  formDataSelector,
} from 'redux/selectors/appointmentsSelector';
import {
  closeAppointmentModal,
  dispatchFetchDoctors,
  resetAppointmentsState,
  dispatchFetchAppointmentSchedules,
  setAppointmentFormKeyValue,
  setStartHours,
} from 'redux/slices/appointmentSlice';
import NewAppointmentForm from './AppointmentForm/AppointmentForm';
import styles from './AppointmentModal.module.scss';

const placeholderHours = [
  '00:00',
  '00:30',
  '00:00',
  '00:30',
  '00:00',
  '00:30',
  '00:00',
  '00:30',
  '00:00',
  '00:30',
  '00:00',
  '00:30',
  '00:00',
  '00:30',
  '00:00',
];

const AppointmentModal = () => {
  const dispatch = useDispatch();
  const { selectedDate: initialDate, modalProps } =
    useSelector(appointmentSelector);
  const formData = useSelector(formDataSelector);
  const { data, loading: schedulesLoading } = useSelector(
    appointmentSchedulesSelector,
  );
  const selectedDate = useMemo(() => {
    return initialDate ? new Date(initialDate) : new Date();
  }, [initialDate]);

  const scheduleGroup = useMemo(() => {
    if (data.schedules.length === 0)
      return {
        schedules: [],
        groupId: '',
        id: '',
        holiday: false,
        isDayOff: false,
      };

    const scheduleGroup = data.schedules[0];

    return {
      ...scheduleGroup,
      holiday: scheduleGroup?.isDayOff || scheduleGroup?.holiday,
    };
  }, [data]);

  useEffect(() => {
    dispatch(dispatchFetchDoctors());
  }, []);

  useEffect(() => {
    if (
      !formData?.doctorId ||
      formData?.doctorId === -1 ||
      formData.doctorId === ''
    )
      return;
    const formattedDate = format(new Date(selectedDate), 'yyyy-MM-dd');

    dispatch(
      dispatchFetchAppointmentSchedules({
        start: formattedDate,
        end: formattedDate,
        doctorId: String(formData.doctorId),
      }),
    );
  }, [selectedDate, formData.doctorId]);

  const handleClose = () => {
    dispatch(closeAppointmentModal());
    dispatch(resetAppointmentsState());
  };

  return modalProps.open ? (
    <Modal open={modalProps.open} className={styles.modal} disableEnforceFocus>
      <div className={styles.modalContent}>
        <div className={styles.formWrapper}>
          <IconButton
            icon='close-icon'
            className={styles.iconButton}
            onClick={handleClose}
          />
          <NewAppointmentForm
            selectedDate={new Date(selectedDate ?? '')}
            disableSubmit={scheduleGroup.holiday}
          />
        </div>
        {schedulesLoading ? (
          <div className={styles.loaderContainer}>
            <CircularProgress />
          </div>
        ) : (
          <CalendarPreview
            calendarContainerProps={{
              hours: data?.hours?.length > 0 ? data?.hours : placeholderHours,
              schedules: data?.schedules?.length > 0 ? [scheduleGroup] : [],
              canCreateSchedules: true,
              onCreateSchedule: (_: string | Date, hour: string) => {
                const approximatedHour = approximateTime(hour, 5);
                dispatch(
                  setAppointmentFormKeyValue({
                    key: 'startHour',
                    value: approximatedHour,
                  }),
                );
                dispatch(setStartHours([approximatedHour]));
              },
            }}
          />
        )}
      </div>
    </Modal>
  ) : null;
};

export default AppointmentModal;
