import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "react-toastify";

import IconPlus from '../../../../icons/iconPlus';
import { setAppointmentModal } from '../../../../../../redux/actions/actions';
import {
  deleteScheduleSelector,
  updateScheduleSelector,
} from '../../../../../../redux/selectors/scheduleSelector';
import { textForKey } from '../../../../../../utils/localization';
import { getPatientSchedules } from "../../../../../../middleware/api/patients";
import Appointment from './Appointment';
import { reducer, initialState, actions } from './PatientAppointments.reducer'
import styles from './PatientAppointments.module.scss';

const PatientAppointments = ({ patient, isDoctor }) => {
  const dispatch = useDispatch();
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
    dispatch(setAppointmentModal({ open: true, patient }));
  };

  return (
    <div className={styles['patient-appointments-list']}>
      <Typography classes={{ root: 'title-label' }}>
        {textForKey('Appointments')}
      </Typography>
      {schedules.length === 0 && !isLoading && (
        <Typography classes={{ root: 'no-data-label' }}>
          {textForKey('No data here yet')} :(
        </Typography>
      )}
      <div className={styles['patient-appointments-list__appointments-data']}>
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
        <div className={styles['patient-appointments-list__actions']}>
          <Button
            className='btn-outline-primary'
            variant='outline-primary'
            onClick={handleAddAppointment}
          >
            {textForKey('Add appointment')}
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
