import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import './styles.scss';
import IconAvatar from '../../assets/icons/iconAvatar';
import dataAPI from '../../utils/api/dataAPI';
import { textForKey } from '../../utils/localization';

const PatientDetails = props => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    fetchPatientDetails();
  }, [patientId]);

  const fetchPatientDetails = async () => {
    const response = await dataAPI.fetchAllPatients();
    if (response.isError) {
      console.error(response.message);
    } else {
      setPatient(response.data.find(item => item.id === patientId));
    }
  };

  const getPatientName = () => {
    if (patient?.firstName && patient?.lastName) {
      return `${patient.firstName} ${patient.lastName}`;
    } else if (patient?.firstName) {
      return patient.firstName;
    } else if (patient?.lastName) {
      return patient.lastName;
    } else {
      return patient?.phoneNumber || '';
    }
  };

  return (
    <div className='doctor-patient-root'>
      <div className='left-container'>
        <div className='patient-info'>
          <IconAvatar />
          <div className='personal-data-container'>
            <span className='patient-name'>{getPatientName()}</span>
            <div className='patient-info-row'>
              <span className='patient-info-title'>{textForKey('Date')}:</span>
              <span className='patient-info-value'>
                {textForKey('20 Sep 2020')}
              </span>
            </div>
            <div className='patient-info-row'>
              <span className='patient-info-title'>
                {textForKey('Doctor')}:
              </span>
              <span className='patient-info-value'>Jacob Jones</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
