import React, { useEffect, useState } from 'react';

import './styles.scss';
import { Spinner } from 'react-bootstrap';

import dataAPI from '../../utils/api/dataAPI';
import PatientsFilter from './components/patients/PatientsFilter';
import PatientsList from './components/patients/PatientsList';

const DoctorPatients = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [filterData, setFilterData] = useState({
    patientName: '',
    serviceId: 'all',
    appointmentStatus: 'all',
  });

  useEffect(() => {
    fetchPatients();
  }, [props]);

  const fetchPatients = async () => {
    setIsLoading(true);
    const response = await dataAPI.fetchSchedulesAndPatients();
    if (response.isError) {
      console.error(response.message);
    } else {
      setSchedules(response.data);
    }
    setIsLoading(false);
  };

  const handlePatientNameChange = event => {
    setFilterData({
      ...filterData,
      patientName: event.target.value,
    });
  };

  const handleServiceChange = event => {
    setFilterData({
      ...filterData,
      serviceId: event.target.value,
    });
  };

  const handleAppointmentStatusChange = event => {
    setFilterData({
      ...filterData,
      appointmentStatus: event.target.value,
    });
  };

  return (
    <div className='doctor-patients-root'>
      <div className='filter-wrapper'>
        <PatientsFilter
          onNameChange={handlePatientNameChange}
          onServiceChange={handleServiceChange}
          onStatusChange={handleAppointmentStatusChange}
        />
      </div>
      <div className='data-wrapper'>
        {isLoading && (
          <Spinner animation='border' className='loading-spinner' />
        )}
        <PatientsList filterData={filterData} schedules={schedules} />
      </div>
    </div>
  );
};

export default DoctorPatients;
