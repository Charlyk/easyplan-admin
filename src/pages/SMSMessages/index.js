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

import ConfirmationModal from '../../components/ConfirmationModal';
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
  needsDeleteConfirmation: false,
  messageToDelete: null,
  isDeleting: false,
  messageToEdit: null,
};

const reducerTypes = {
  setIsLoading: 'setIsLoading',
  setMessages: 'setMessages',
  setIsCreatingMessage: 'setIsCreatingMessage',
  setNeedsDeleteConfirmation: 'setNeedsDeleteConfirmation',
  setMessageToDelete: 'setMessageToDelete',
  setIsDeleting: 'setIsDeleting',
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    case reducerTypes.setIsCreatingMessage: {
      const { isCreating, message } = action.payload;
      return {
        ...state,
        isCreatingMessage: isCreating,
        messageToEdit: message,
      };
    }
    case reducerTypes.setMessages:
      return { ...state, messages: action.payload };
    case reducerTypes.setNeedsDeleteConfirmation: {
      const { confirmed, message } = action.payload;
      return {
        ...state,
        needsDeleteConfirmation: !confirmed,
        messageToDelete: confirmed ? null : message,
        isDeleting: false,
      };
    }
    case reducerTypes.setIsDeleting:
      return { ...state, isDeleting: action.payload };
    default:
      return state;
  }
};

const SMSMessages = () => {
  const [
    {
      isCreatingMessage,
      isLoading,
      messages,
      needsDeleteConfirmation,
      messageToDelete,
      isDeleting,
      messageToEdit,
    },
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
    localDispatch(
      actions.setIsCreatingMessage({ isCreating: true, message: null }),
    );
  };

  const handleCloseCreateMessage = () => {
    localDispatch(
      actions.setIsCreatingMessage({ isCreating: false, message: null }),
    );
  };

  const handleMessageCreated = async () => {
    await fetchMessages(true);
    handleCloseCreateMessage();
  };

  const handleCloseDeleteConfirmation = () => {
    localDispatch(
      actions.setNeedsDeleteConfirmation({ confirmed: true, message: null }),
    );
  };

  const handleDeleteMessage = (message) => {
    localDispatch(
      actions.setNeedsDeleteConfirmation({ confirmed: false, message }),
    );
  };

  const handleDeleteConfirmed = async () => {
    if (messageToDelete == null) {
      return;
    }
    localDispatch(actions.setIsDeleting(true));
    const response = await dataAPI.deleteMessage(messageToDelete.id);
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      await fetchMessages(true);
    }
    localDispatch(
      actions.setNeedsDeleteConfirmation({ confirmed: true, message: null }),
    );
  };

  const handleDisableMessage = async (message) => {
    const response = await dataAPI.setMessageDisabled(
      message.id,
      !message.disabled,
    );
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      await fetchMessages(true);
    }
  };

  const handleEditMessage = (message) => {
    localDispatch(actions.setIsCreatingMessage({ isCreating: true, message }));
  };

  return (
    <div className='sms-messages-root'>
      {needsDeleteConfirmation && (
        <ConfirmationModal
          title={textForKey('Delete message')}
          message={textForKey('delete_message_desc')}
          show={needsDeleteConfirmation}
          onConfirm={handleDeleteConfirmed}
          onClose={handleCloseDeleteConfirmation}
          isLoading={isDeleting}
        />
      )}
      {isCreatingMessage && (
        <CreateMessageModal
          message={messageToEdit}
          onClose={handleCloseCreateMessage}
          onCreateMessage={handleMessageCreated}
          open={isCreatingMessage}
        />
      )}
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
                  <SMSMessageItem
                    key={message.id}
                    message={message}
                    onEdit={handleEditMessage}
                    onDisable={handleDisableMessage}
                    onDelete={handleDeleteMessage}
                  />
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
