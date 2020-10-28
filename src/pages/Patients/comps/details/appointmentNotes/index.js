import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import {
  updateNotesSelector,
  userSelector,
} from '../../../../../redux/selectors/rootSelector';
import dataAPI from '../../../../../utils/api/dataAPI';
import AppointmentNote from './AppointmentNote';

const AppointmentNotes = ({ patient, onEditNote }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [visits, setVisits] = useState([]);
  const updateNotes = useSelector(updateNotesSelector);
  const currentUser = useSelector(userSelector);

  useEffect(() => {
    fetchPatientVisits();
  }, [patient, updateNotes]);

  const fetchPatientVisits = async () => {
    setIsFetching(true);
    const response = await dataAPI.fetchPatientVisits(patient.id);
    if (response.isError) {
      console.error(response.message);
    } else {
      setVisits(response.data || []);
    }
    setIsFetching(false);
  };

  return (
    <div className='patient-notes'>
      <div className='patient-notes__notes-data'>
        {isFetching && (
          <Spinner animation='border' className='patient-details-spinner' />
        )}
        {visits.map((visit, index) => (
          <AppointmentNote
            canEdit={visit.doctorId === currentUser.id}
            key={`${visit.scheduleId}-${visit.doctorId}-${visit.created}-${index}`}
            visit={visit}
            onEdit={onEditNote}
          />
        ))}
      </div>
    </div>
  );
};

export default AppointmentNotes;

AppointmentNotes.propTypes = {
  onEditNote: PropTypes.func,
  scheduleId: PropTypes.string,
  patient: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    photo: PropTypes.string,
  }).isRequired,
};

AppointmentNotes.defaultProps = {
  onAddNote: () => null,
};
