import React, { useEffect, useState } from 'react';

import './styles.scss';
import { Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
  checkDoctorAppointmentsSelector,
  userSelector,
} from '../../redux/selectors/rootSelector';
import dataAPI from '../../utils/api/dataAPI';
import PatientsFilter from './components/patients/PatientsFilter';
import PatientsList from './components/patients/PatientsList';

const DoctorPatients = () => {
  const checkAppointments = useSelector(checkDoctorAppointmentsSelector);
  const currentUser = useSelector(userSelector);
  const [isLoading, setIsLoading] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [viewDate, setViewDate] = useState(new Date());
  const [filterData, setFilterData] = useState({
    patientName: '',
    serviceId: 'all',
    appointmentStatus: 'all',
  });

  useEffect(() => {
    setIsLoading(true);
    fetchPatients();
  }, [viewDate, checkAppointments]);

  const fetchPatients = async () => {
    const response = await dataAPI.fetchSchedules(currentUser.id, viewDate);
    if (response.isError) {
      toast.error(response.message);
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

  const handleDateChange = newDate => {
    setViewDate(newDate);
  };

  return (
    <div className='doctor-patients-root'>
      <div className='filter-wrapper'>
        <PatientsFilter
          selectedDate={viewDate}
          onDateChange={handleDateChange}
          onNameChange={handlePatientNameChange}
          onServiceChange={handleServiceChange}
          onStatusChange={handleAppointmentStatusChange}
        />
      </div>
      <div className='data-wrapper'>
        {isLoading && (
          <Spinner animation='border' className='loading-spinner' />
        )}
        <PatientsList
          filterData={filterData}
          viewDate={viewDate}
          schedules={schedules}
        />
      </div>
    </div>
  );
};

export default DoctorPatients;
