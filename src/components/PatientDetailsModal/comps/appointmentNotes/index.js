import React, { useEffect, useState } from 'react';

import { CircularProgress, Typography } from '@material-ui/core';
import sortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';
import { Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import {
  updateNotesSelector,
  userSelector,
} from '../../../../redux/selectors/rootSelector';
import dataAPI from '../../../../utils/api/dataAPI';
import { textForKey } from '../../../../utils/localization';
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
      setVisits(sortBy(response.data, item => item.created).reverse() || []);
    }
    setIsFetching(false);
  };

  return (
    <div className='patient-notes-list'>
      <Typography classes={{ root: 'title-label' }}>
        {textForKey('Appointments notes')}
      </Typography>
      {visits.length === 0 && !isFetching && (
        <Typography classes={{ root: 'no-data-label' }}>
          {textForKey('No data here yet')} :(
        </Typography>
      )}
      <div className='patient-notes-list__notes-data'>
        {isFetching && <CircularProgress className='patient-details-spinner' />}
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
    id: PropTypes.number,
  }).isRequired,
};

AppointmentNotes.defaultProps = {
  onAddNote: () => null,
};
