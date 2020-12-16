import React, { useEffect, useReducer } from 'react';

import { Box, CircularProgress, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import IconPlus from '../../../../assets/icons/iconPlus';
import { updateNotesSelector } from '../../../../redux/selectors/rootSelector';
import dataAPI from '../../../../utils/api/dataAPI';
import { Action } from '../../../../utils/constants';
import {
  generateReducerActions,
  logUserAction,
} from '../../../../utils/helperFuncs';
import { textForKey } from '../../../../utils/localization';
import LoadingButton from '../../../LoadingButton';
import PatientNote from './PatientNote';

const initialState = {
  isFetching: false,
  isAddingNote: false,
  notes: [],
  newNoteText: '',
};

const reducerTypes = {
  setIsFetching: 'setIsFetching',
  setNotes: 'setNotes',
  setNewNoteText: 'setNewNoteText',
  setIsAddingNote: 'setIsAddingNote',
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setIsFetching:
      return { ...state, isFetching: action.payload };
    case reducerTypes.setNewNoteText:
      return { ...state, newNoteText: action.payload };
    case reducerTypes.setNotes:
      return { ...state, notes: action.payload };
    default:
      return state;
  }
};

const PatientNotes = ({ patient }) => {
  const [state, localDispatch] = useReducer(reducer, initialState);
  const updateNotes = useSelector(updateNotesSelector);

  useEffect(() => {
    fetchNotes();
  }, [patient, updateNotes]);

  const handleAddNote = async () => {
    if (state.newNoteText.length === 0) return;
    localDispatch(actions.setIsAddingNote(true));
    const requestBody = {
      note: state.newNoteText,
      mode: 'notes',
    };
    await dataAPI.createPatientNote(patient.id, requestBody);
    logUserAction(
      Action.CreatePatientNote,
      JSON.stringify({ patientId: patient.id, requestBody }),
    );
    localDispatch(actions.setNewNoteText(''));
    localDispatch(actions.setIsAddingNote(false));

    fetchNotes();
  };

  const fetchNotes = async () => {
    localDispatch(actions.setIsFetching(true));
    const response = await dataAPI.fetchPatientNotes(patient.id);
    if (response.isError) {
      console.error(response.message);
    } else {
      localDispatch(actions.setNotes(response.data || []));
    }
    localDispatch(actions.setIsFetching(false));
  };

  const handleInputKeyDown = event => {
    if (event.keyCode === 13) {
      handleAddNote();
    }
  };

  const handleNewNoteChanged = event => {
    localDispatch(actions.setNewNoteText(event.target.value));
  };

  return (
    <div className='patient-notes-list'>
      <Typography classes={{ root: 'title-label' }}>
        {textForKey('Notes')}
      </Typography>
      {state.notes.length === 0 && !state.isFetching && (
        <Typography classes={{ root: 'no-data-label' }}>
          {textForKey('No data here yet')} :(
        </Typography>
      )}
      {state.isFetching && (
        <CircularProgress className='patient-details-spinner' />
      )}
      <div className='patient-notes-list__notes-data'>
        {state.notes.map(note => (
          <PatientNote key={note.id} note={note} />
        ))}
      </div>
      <Box display='flex' width='100%' className='patient-notes-list__actions'>
        <Form.Group controlId='newNoteText'>
          <InputGroup>
            <Form.Control
              onKeyDown={handleInputKeyDown}
              value={state.newNoteText}
              type='text'
              placeholder={`${textForKey('Enter new note')}...`}
              onChange={handleNewNoteChanged}
            />
          </InputGroup>
        </Form.Group>
        <LoadingButton
          isLoading={state.isAddingNote}
          disabled={state.isFetching}
          className='positive-button'
          onClick={handleAddNote}
        >
          {textForKey('Add note')}
          <IconPlus fill={null} />
        </LoadingButton>
      </Box>
    </div>
  );
};

export default PatientNotes;

PatientNotes.propTypes = {
  patient: PropTypes.shape({
    id: PropTypes.number,
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
