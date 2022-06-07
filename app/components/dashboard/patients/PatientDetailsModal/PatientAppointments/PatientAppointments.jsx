import React, { useContext, useEffect, useReducer } from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-polyglot';
import { useDispatch, useSelector } from 'react-redux';
import IconPlus from 'app/components/icons/iconPlus';
import NotificationsContext from 'app/context/notificationsContext';
import { getPatientSchedules } from 'middleware/api/patients';
import {
  deleteScheduleSelector,
  updateScheduleSelector,
} from 'redux/selectors/scheduleSelector';
import { openAppointmentModal } from 'redux/slices/createAppointmentModalSlice';
import Appointment from './Appointment';
import styles from './PatientAppointments.module.scss';
import { reducer, initialState, actions } from './PatientAppointments.reducer';

const PatientAppointments = ({ patient, isDoctor }) => {
  const textForKey = useTranslate();
  const dispatch = useDispatch();
  const toast = useContext(NotificationsContext);
  const updateSchedule = useSelector(updateScheduleSelector);
  const deleteSchedule = useSelector(deleteScheduleSelector);
  const [{ schedules, isLoading }, localDispatch] = useReducer(
    reducer,
    initialState,
  );

  useEffect(() => {
    if (patient != null) {
      fetchSchedules();
    }
  }, [patient]);

  useEffect(() => {
    if (updateSchedule == null && deleteSchedule == null) {
      return;
    }
    const isSamePatient =
      updateSchedule?.patient?.id === patient?.id ||
      deleteSchedule?.patient?.id === patient?.id;
    if (isSamePatient) {
      fetchSchedules();
    }
  }, [updateSchedule, deleteSchedule]);

  const fetchSchedules = async () => {
    localDispatch(actions.setIsLoading(true));
    try {
      const response = await getPatientSchedules(patient.id);
      localDispatch(actions.setSchedules(response.data));
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(actions.setIsLoading(false));
    }
  };

  const handleAddAppointment = () => {
    dispatch(openAppointmentModal({ open: true, patient }));
  };

  return (
    <div className={styles.patientAppointmentsList}>
      <Typography classes={{ root: 'title-label' }}>
        {textForKey('appointments')}
      </Typography>
      {schedules.length === 0 && !isLoading && (
        <Typography classes={{ root: 'no-data-label' }}>
          {textForKey('no data here yet')} :(
        </Typography>
      )}
      <div className={styles.appointmentsData}>
        {isLoading && (
          <div className='progress-bar-wrapper'>
            <CircularProgress classes={{ root: 'circular-progress-bar' }} />
          </div>
        )}
        {schedules.map((item) => (
          <Appointment key={item.id} appointment={item} />
        ))}
      </div>
      {!isDoctor && (
        <div className={styles.actions}>
          <Button
            variant='outlined'
            classes={{
              root: styles.addButton,
              label: styles.addButtonLabel,
              outlined: styles.outlinedButton,
            }}
            onClick={handleAddAppointment}
          >
            {textForKey('add appointment')}
            <IconPlus fill={null} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;

PatientAppointments.propTypes = {
  patient: PropTypes.object,
  isDoctor: PropTypes.bool,
};
