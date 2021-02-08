import React, { useEffect, useReducer } from 'react';

import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { toast } from 'react-toastify';

import dataAPI from '../../utils/api/dataAPI';
import { generateReducerActions } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import CreateMessageModal from './comps/CreateMessageModal';
import SMSMessageItem from './comps/SMSMessageItem';
import SMSMessagesHeader from './comps/SMSMessgesHeader';
import './styles.scss';

const initialState = {
  isLoading: false,
  messages: [],
  isCreatingMessage: false,
};

const reducerTypes = {
  setIsLoading: 'setIsLoading',
  setMessages: 'setMessages',
  setIsCreatingMessage: 'setIsCreatingMessage',
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    case reducerTypes.setIsCreatingMessage:
      return { ...state, isCreatingMessage: action.payload };
    case reducerTypes.setMessages:
      return { ...state, messages: action.payload };
    default:
      return state;
  }
};

const SMSMessages = () => {
  const [
    { isCreatingMessage, isLoading, messages },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async (silent) => {
    localDispatch(actions.setIsLoading(!silent));
    const response = await dataAPI.fetchSMSMessages();
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      localDispatch(actions.setMessages(response.data));
    }
    localDispatch(actions.setIsLoading(false));
  };

  const handleStartCreateMessage = () => {
    localDispatch(actions.setIsCreatingMessage(true));
  };

  const handleCloseCreateMessage = () => {
    localDispatch(actions.setIsCreatingMessage(false));
  };

  const handleMessageCreated = async () => {
    await fetchMessages(true);
    handleCloseCreateMessage();
  };

  return (
    <div className='sms-messages-root'>
      <CreateMessageModal
        onClose={handleCloseCreateMessage}
        onCreateMessage={handleMessageCreated}
        open={isCreatingMessage}
      />
      <SMSMessagesHeader onCreate={handleStartCreateMessage} />
      <div className='sms-messages-root__data-wrapper'>
        {isLoading && (
          <div className='progress-wrapper'>
            <CircularProgress classes={{ root: 'progress' }} />
          </div>
        )}
        {!isLoading && (
          <TableContainer classes={{ root: 'table-container' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{textForKey('Title')}</TableCell>
                  <TableCell>{textForKey('Message')}</TableCell>
                  <TableCell>{textForKey('Message type')}</TableCell>
                  <TableCell>{textForKey('Send time')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {messages.map((message) => (
                  <SMSMessageItem key={message.id} message={message} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
};

export default SMSMessages;
