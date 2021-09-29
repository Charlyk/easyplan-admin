import React, { useEffect, useReducer } from 'react';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";

import IconPlus from '../../../../icons/iconPlus';
import { updateNotesSelector } from '../../../../../../redux/selectors/rootSelector';
import { textForKey } from '../../../../../../utils/localization';
import LoadingButton from '../../../../common/LoadingButton';
import { createPatientNote, getPatientNotes } from "../../../../../../middleware/api/patients";
import PatientNote from './PatientNote';
import { reducer, initialState, actions } from './PatientNotes.reducer';
import styles from './PatientNotes.module.scss';

const PatientNotes = ({ patient }) => {
  const [state, localDispatch] = useReducer(reducer, initialState);
  const updateNotes = useSelector(updateNotesSelector);

  useEffect(() => {
    fetchNotes();
  }, [patient, updateNotes]);

  const handleAddNote = async () => {
    if (state.newNoteText.length === 0) return;
    localDispatch(actions.setIsAddingNote(true));
    try {
      const requestBody = {
        note: state.newNoteText,
        mode: 'notes',
      };
      await createPatientNote(patient.id, requestBody)
      await fetchNotes();
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(actions.setNewNoteText(''));
      localDispatch(actions.setIsAddingNote(false));
    }
  };

  const fetchNotes = async () => {
    localDispatch(actions.setIsFetching(true));
    try {
      const response = await getPatientNotes(patient.id);
      localDispatch(actions.setNotes(response.data || []));
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(actions.setIsFetching(false));
    }
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
    <div className={styles['patient-notes-list']}>
      <Typography className={'title-label'}>
        {textForKey('Notes')}
      </Typography>
      {state.notes.length === 0 && !state.isFetching && (
        <Typography className={'no-data-label'}>
          {textForKey('No data here yet')} :(
        </Typography>
      )}
      {state.isFetching && (
        <div className='progress-bar-wrapper'>
          <CircularProgress classes={{ root: 'circular-progress-bar' }}/>
        </div>
      )}
      <div className={styles['patient-notes-list__notes-data']}>
        {state.notes.map(note => (
          <PatientNote key={note.id} note={note}/>
        ))}
      </div>
      <Box display='flex' width='100%' className={styles['patient-notes-list__actions']}>
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
          <IconPlus fill={null}/>
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
