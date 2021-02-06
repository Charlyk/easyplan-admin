import React, { useEffect, useReducer } from 'react';

import { Table, TableCell, TableHead, TableRow } from '@material-ui/core';

import { generateReducerActions } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import CreateMessageModal from './comps/CreateMessageModal';
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
  const [{ isCreatingMessage }, localDispatch] = useReducer(
    reducer,
    initialState,
  );
  useEffect(() => {
    console.log(isCreatingMessage);
  }, []);

  const handleStartCreateMessage = () => {
    localDispatch(actions.setIsCreatingMessage(true));
  };

  const handleCloseCreateMessage = () => {
    localDispatch(actions.setIsCreatingMessage(false));
  };

  return (
    <div className='sms-messages-root'>
      <CreateMessageModal
        onClose={handleCloseCreateMessage}
        open={isCreatingMessage}
      />
      <SMSMessagesHeader onCreate={handleStartCreateMessage} />
      <div className='sms-messages-root__data-wrapper'>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{textForKey('Title')}</TableCell>
              <TableCell>{textForKey('Message')}</TableCell>
              <TableCell>{textForKey('Message type')}</TableCell>
              <TableCell>{textForKey('Send time')}</TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </div>
    </div>
  );
};

export default SMSMessages;
