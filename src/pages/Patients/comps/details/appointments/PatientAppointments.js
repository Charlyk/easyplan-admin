import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { Button, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';

import IconPlus from '../../../../../assets/icons/iconPlus';
import { setAppointmentModal } from '../../../../../redux/actions/actions';
import dataAPI from '../../../../../utils/api/dataAPI';
import { textForKey } from '../../../../../utils/localization';
import Appointment from './Appointment';

const PatientAppointments = ({ patient }) => {
  const dispatch = useDispatch();
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (patient != null) {
      fetchSchedules();
    }
  }, [patient]);

  const fetchSchedules = async () => {
    setIsLoading(true);
    const response = await dataAPI.fetchPatientSchedules(patient.id);
    if (response.isError) {
      console.error(response.message);
    } else {
      setSchedules(response.data);
    }
    setIsLoading(false);
  };

  const handleAddAppointment = () => {
    dispatch(setAppointmentModal({ open: true, patient }));
  };

  return (
    <div className='patient-appointments'>
      <div className='patient-appointments__appointments-data'>
        {isLoading && (
          <Spinner animation='border' className='patient-details-spinner' />
        )}
        {schedules.map(item => (
          <Appointment key={item.id} appointment={item} />
        ))}
      </div>
      <div className='patient-appointments__actions'>
        <Button
          className='btn-outline-primary'
          variant='outline-primary'
          onClick={handleAddAppointment}
        >
          {textForKey('Add appointment')}
          <IconPlus fill={null} />
        </Button>
      </div>
    </div>
  );
};

export default PatientAppointments;

PatientAppointments.propTypes = {
  patient: PropTypes.object,
};
