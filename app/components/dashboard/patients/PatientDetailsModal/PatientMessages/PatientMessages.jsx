import React, { useEffect, useReducer } from 'react';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import {
  requestFetchSmsMessages,
  requestSendSms
} from "../../../../../../middleware/api/patients";
import onRequestError from "../../../../../utils/onRequestError";
import { textForKey } from '../../../../../utils/localization';
import IconPlus from '../../../../icons/iconPlus';
import EASTextField from "../../../../common/EASTextField";
import LoadingButton from '../../../../common/LoadingButton';
import PatientMessage from './PatientMessage';
import {
  reducer,
  initialState,
  actions,
  charactersRegex
} from './PatientMessages.reducer';
import styles from './PatientMessages.module.scss';

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
    try {
      const response = await requestFetchSmsMessages(patient.id);
      localDispatch(actions.setMessages(response.data));
    } catch (error) {
      onRequestError(error);
    } finally {
      localDispatch(actions.setIsFetching(false));
    }
  };

  const handleNewMessageChange = (newValue) => {
    localDispatch(actions.setNewMessageText(newValue));
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
    try {
      await requestSendSms(state.newMessageText, patient.id);
      localDispatch(actions.setNewMessageText(''));
      await fetchMessages();
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(actions.setIsSendingMessage(false));
    }
  };

  return (
    <div className={styles.patientsMessagesList}>
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
      <div className={styles.data}>
        {state.messages.map((item) => (
          <PatientMessage key={item.id} message={item} />
        ))}
      </div>
      <Box display='flex' width='100%' className={styles.actions}>
        <EASTextField
          type="text"
          containerClass={styles.field}
          placeholder={textForKey('Enter new message')}
          value={state.newMessageText}
          onChange={handleNewMessageChange}
          onKeyDown={handleInputKeyDown}
          error={!isValidMessage}
        />
        <LoadingButton
          isLoading={state.isSendingMessage}
          disabled={
            state.isFetching ||
            state.newMessageText.length === 0 ||
            !isValidMessage
          }
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
