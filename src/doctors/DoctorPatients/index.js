import React, { useEffect, useState } from 'react';

import './styles.scss';
import { Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { userSelector } from '../../redux/selectors/rootSelector';
import dataAPI from '../../utils/api/dataAPI';
import PatientsFilter from './components/patients/PatientsFilter';
import PatientsList from './components/patients/PatientsList';

const DoctorPatients = props => {
  const history = useHistory();
  const currentUser = useSelector(userSelector);
  const [isLoading, setIsLoading] = useState(false);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    fetchPatients();
  }, [props]);

  const fetchPatients = async () => {
    setIsLoading(true);
    const response = await dataAPI.fetchSchedules(currentUser.id, new Date());
    if (response.isError) {
      console.error(response.message);
    } else {
      setSchedules(response.data);
    }
    setIsLoading(false);
  };

  const handlePatientSelected = schedule => {
    history.push(`/${schedule.patientId}/${schedule.id}`);
  };

  return (
    <div className='doctor-patients-root'>
      <div className='filter-wrapper'>
        <PatientsFilter />
      </div>
      <div className='data-wrapper'>
        {isLoading && (
          <Spinner animation='border' className='loading-spinner' />
        )}
        <PatientsList
          schedules={schedules}
          onPatientSelect={handlePatientSelected}
        />
      </div>
    </div>
  );
};

export default DoctorPatients;
