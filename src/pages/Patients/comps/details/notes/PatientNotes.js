import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { Button, Spinner } from 'react-bootstrap';

import IconPlus from '../../../../../assets/icons/iconPlus';
import dataAPI from '../../../../../utils/api/dataAPI';
import { textForKey } from '../../../../../utils/localization';
import PatientNote from './PatientNote';

const PatientNotes = ({ onAddNote, patient, shouldUpdate }) => {
  const [state, setState] = useState({ isFetching: false, notes: [] });

  useEffect(() => {
    fetchNotes();
  }, [patient, shouldUpdate]);

  const fetchNotes = async () => {
    setState({ isFetching: true, notes: [] });
    const response = await dataAPI.fetchPatientNotes(patient.id);
    if (response.isError) {
      console.error(response.message);
    }
    setState({ isFetching: false, notes: response.data || [] });
  };

  return (
    <div className='patients-root__notes'>
      <div className='patients-root__notes__notes-data'>
        {state.isFetching && (
          <Spinner
            animation='border'
            variant='primary'
            role='status'
            className='loading-spinner'
          />
        )}
        {state.notes.map(note => (
          <PatientNote key={note.id} note={note} />
        ))}
      </div>
      <div className='patients-root__notes__actions'>
        <Button
          className='btn-outline-primary'
          variant='outline-primary'
          onClick={onAddNote}
        >
          {textForKey('Add note')}
          <IconPlus />
        </Button>
      </div>
    </div>
  );
};

export default PatientNotes;

PatientNotes.propTypes = {
  onAddNote: PropTypes.func,
  shouldUpdate: PropTypes.func,
  patient: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    photo: PropTypes.string,
  }).isRequired,
};

PatientNotes.defaultProps = {
  onAddNote: () => null,
};
