import React, { useEffect, useState } from 'react';

import './styles.scss';
import { Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import dataAPI from '../../utils/api/dataAPI';
import PatientsFilter from './components/patients/PatientsFilter';
import PatientsList from './components/patients/PatientsList';

const DoctorPatients = props => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchPatients();
  }, [props]);

  const fetchPatients = async () => {
    setIsLoading(true);
    const response = await dataAPI.fetchAllPatients();
    if (response.isError) {
      console.error(response.message);
    } else {
      setPatients(response.data);
    }
    setIsLoading(false);
  };

  const handlePatientSelected = patient => {
    history.push(`/${patient.id}`);
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
          patients={patients}
          onPatientSelect={handlePatientSelected}
        />
      </div>
    </div>
  );
};

export default DoctorPatients;
