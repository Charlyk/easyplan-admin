import React, { useEffect, useReducer } from 'react';

import { Box, CircularProgress, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';

import IconPlus from '../../../../assets/icons/iconPlus';
import dataAPI from '../../../../utils/api/dataAPI';
import { generateReducerActions } from '../../../../utils/helperFuncs';
import { textForKey } from '../../../../utils/localization';
import LoadingButton from '../../../LoadingButton';
import PatientMessage from './PatientMessage';

const initialState = {
  isFetching: false,
  isSendingMessage: false,
  messages: [],
  newMessageText: '',
};

const reducerTypes = {
  setIsFetching: 'setIsFetching',
  setMessages: 'setMessages',
  setNewMessageText: 'setNewMessageText',
  setIsSendingMessage: 'setIsSendingMessage',
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setIsFetching:
      return { ...state, isFetching: action.payload };
    case reducerTypes.setNewMessageText:
      return { ...state, newMessageText: action.payload };
    case reducerTypes.setMessages:
      return { ...state, messages: action.payload };
    case reducerTypes.setIsSendingMessage:
      return { ...state, isSendingMessage: action.payload };
    default:
      return state;
  }
};

const PatientMessages = ({ patient }) => {
  const [state, localDispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    if (patient == null) return;
    localDispatch(actions.setIsFetching(true));
    const response = await dataAPI.fetchPatientMessages(patient.id);
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      localDispatch(actions.setMessages(response.data));
    }
    localDispatch(actions.setIsFetching(false));
  };

  const handleNewMessageChange = (event) => {
    localDispatch(actions.setNewMessageText(event.target.value));
  };

  const handleInputKeyDown = (event) => {
    if (event.keyCode === 13) {
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (state.newMessageText.length === 0) {
      return;
    }
    localDispatch(actions.setIsSendingMessage(true));
    const response = await dataAPI.sendMessageToPatient(
      patient.id,
      state.newMessageText,
    );
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      localDispatch(actions.setNewMessageText(''));
      await fetchMessages();
    }
    localDispatch(actions.setIsSendingMessage(false));
  };

  return (
    <div className='patients-messages-list'>
      <Typography classes={{ root: 'title-label' }}>
        {textForKey('Messages')}
      </Typography>
      {state.messages.length === 0 && !state.isFetching && (
        <Typography classes={{ root: 'no-data-label' }}>
          {textForKey('No data here yet')} :(
        </Typography>
      )}
      {state.isFetching && (
        <CircularProgress className='patient-details-spinner' />
      )}
      <div className='patient-notes-list__notes-data'>
        {state.messages.map((item) => (
          <PatientMessage key={item.id} message={item} />
        ))}
      </div>
      <Box display='flex' width='100%' className='patient-notes-list__actions'>
        <Form.Group controlId='newMessageText'>
          <InputGroup>
            <Form.Control
              onKeyDown={handleInputKeyDown}
              value={state.newMessageText}
              type='text'
              placeholder={`${textForKey('Enter new message')}...`}
              onChange={handleNewMessageChange}
            />
          </InputGroup>
        </Form.Group>
        <LoadingButton
          isLoading={state.isSendingMessage}
          disabled={state.isFetching || state.newMessageText.length === 0}
          className='positive-button'
          onClick={handleSendMessage}
        >
          {textForKey('Send message')}
          <IconPlus fill={null} />
        </LoadingButton>
      </Box>
    </div>
  );
};

export default PatientMessages;

PatientMessages.propTypes = {
  patient: PropTypes.object,
};
