import React, { useEffect, useReducer } from 'react';

import { Box, CircularProgress, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';

import IconPlus from '../../../icons/iconPlus';
import dataAPI from '../../../../utils/api/dataAPI';
import { generateReducerActions } from '../../../../utils/helperFuncs';
import { textForKey } from '../../../../utils/localization';
import LoadingButton from '../../../LoadingButton';
import PatientMessage from './PatientMessage';
import styles from '../../../../styles/PatientMessages.module.scss';

const charactersRegex = /[а-яА-ЯЁёĂăÎîȘșȚțÂâ]/;

const initialState = {
  isFetching: false,
  isSendingMessage: false,
  messages: [],
  newMessageText: '',
  maxLength: 160,
};

const reducerTypes = {
  setIsFetching: 'setIsFetching',
  setMessages: 'setMessages',
  setNewMessageText: 'setNewMessageText',
  setIsSendingMessage: 'setIsSendingMessage',
  setMaxLength: 'setMaxLength',
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
    case reducerTypes.setMaxLength:
      return { ...state, maxLength: action.payload };
    default:
      return state;
  }
};

const PatientMessages = ({ patient }) => {
  const [state, localDispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    const messageValue = state.newMessageText;
    let maxLength = 160;
    if (charactersRegex.test(messageValue)) {
      maxLength = 70;
    }
    localDispatch(actions.setMaxLength(maxLength));
  }, [state.newMessageText]);

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

  const currentLength = state.newMessageText.length;
  const isValidMessage = currentLength <= state.maxLength;

  const handleSendMessage = async () => {
    if (state.newMessageText.length === 0 || !isValidMessage) {
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
    <div className={styles['patients-messages-list']}>
      <Typography classes={{ root: 'title-label' }}>
        {textForKey('Messages')}
      </Typography>
      {state.messages.length === 0 && !state.isFetching && (
        <Typography classes={{ root: 'no-data-label' }}>
          {textForKey('No data here yet')} :(
        </Typography>
      )}
      {state.isFetching && (
        <CircularProgress classes={{ root: 'circular-progress-bar' }} />
      )}
      <div className={styles['patients-messages-list__data']}>
        {state.messages.map((item) => (
          <PatientMessage key={item.id} message={item} />
        ))}
      </div>
      <Box display='flex' width='100%' className={styles['patients-messages-list__actions']}>
        <Form.Group controlId='newMessageText'>
          <InputGroup>
            <Form.Control
              isInvalid={!isValidMessage}
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
          disabled={
            state.isFetching ||
            state.newMessageText.length === 0 ||
            !isValidMessage
          }
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
