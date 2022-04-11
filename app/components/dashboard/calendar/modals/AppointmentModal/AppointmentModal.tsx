import React, { useEffect, useMemo } from 'react';
import { CalendarPreview, IconButton } from '@easyplanpro/easyplan-components';
import { Modal, CircularProgress } from '@material-ui/core';
import { format } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
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
} from 'redux/slices/appointmentSlice';
import NewAppointmentForm from './AppointmentForm/AppointmentForm';
import styles from './AppointmentModal.module.scss';

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

  useEffect(() => {
    dispatch(dispatchFetchDoctors());
  }, []);

  useEffect(() => {
    if (!formData?.doctorId || formData?.doctorId === -1) return;
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

  const calendarPreview =
    data?.hours.length > 1 ? (
      <CalendarPreview
        calendarContainerProps={{
          hours: data?.hours,
          schedules: data?.schedules,
          canCreateSchedules: false,
        }}
      />
    ) : (
      <div className={styles.placeholder} />
    );

  return modalProps.open ? (
    <Modal open={modalProps.open} className={styles.modal} disableEnforceFocus>
      <div className={styles.modalContent}>
        <div className={styles.formWrapper}>
          <IconButton
            icon='close-icon'
            className={styles.iconButton}
            onClick={handleClose}
          />
          <NewAppointmentForm selectedDate={new Date(selectedDate ?? '')} />
        </div>
        {schedulesLoading ? (
          <div className={styles.loaderContainer}>
            <CircularProgress />
          </div>
        ) : (
          calendarPreview
        )}
      </div>
    </Modal>
  ) : null;
};

export default AppointmentModal;
