import React, { useEffect, useReducer } from 'react';

import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import ConfirmationModal from '../../components/common/ConfirmationModal';
import { hasSMSAliasSelector } from '../../redux/selectors/clinicSelector';
import { generateReducerActions, handleRequestError } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import CreateMessageModal from '../../components/messages/CreateMessageModal';
import SMSMessageItem from '../../components/messages/SMSMessageItem';
import SMSMessagesHeader from '../../components/messages/SMSMessagesHeader';
import styles from '../../styles/SMSMessages.module.scss';
import axios from "axios";
import { baseAppUrl } from "../../eas.config";
import MainComponent from "../../components/common/MainComponent";

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

const SMSMessages = ({ currentUser, currentClinic, messages: initialMessages }) => {
  const hasSMSAlias = currentClinic.smsAlias != null;
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
    localDispatch(actions.setMessages(initialMessages));
  }, [])

  const fetchMessages = async (silent) => {
    localDispatch(actions.setIsLoading(!silent));
    try {
      const response = await axios.get(`${baseAppUrl}/api/sms`);
      localDispatch(actions.setMessages(response.data));
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(actions.setIsLoading(false));
    }
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
    try {
      await axios.delete(`${baseAppUrl}/api/sms/${messageToDelete.id}`);
      await fetchMessages(true);
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(
        actions.setNeedsDeleteConfirmation({ confirmed: true, message: null }),
      );
    }
  };

  const handleDisableMessage = async (message) => {
    try {
      const status = message.disabled ? 'enable' : 'disable';
      const query = { status };
      const queryString = new URLSearchParams(query).toString();
      await axios.put(`${baseAppUrl}/api/sms/${message.id}?${queryString}`);
      await fetchMessages(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEditMessage = (message) => {
    localDispatch(actions.setIsCreatingMessage({ isCreating: true, message }));
  };

  return (
    <MainComponent currentClinic={currentClinic} currentUser={currentUser} currentPath='/messages'>
      <div className={styles['sms-messages-root']}>
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
        <SMSMessagesHeader
          canCreate={hasSMSAlias}
          onCreate={handleStartCreateMessage}
        />
        <div className={styles['sms-messages-root__data-wrapper']}>
          {hasSMSAlias && isLoading && (
            <div className={styles['progress-wrapper']}>
              <CircularProgress classes={{ root: styles.progress }} />
            </div>
          )}
          {!hasSMSAlias && (
            <Typography classes={{ root: styles['no-alias-label'] }}>
              {textForKey('no_sms_alias_message')}
              <a href='tel:37360112286'>+373 (60) 112286</a>
            </Typography>
          )}
          {!isLoading && messages.length === 0 && hasSMSAlias && (
            <Typography classes={{ root: styles['no-alias-label'] }}>
              {textForKey('no_sms_messages')}
            </Typography>
          )}
          {hasSMSAlias && !isLoading && messages.length > 0 && (
            <TableContainer classes={{ root: styles['table-container'] }}>
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
    </MainComponent>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  try {
    const response = await axios.get(`${baseAppUrl}/api/sms`, { headers: req.headers });
    const { data } = response;
    return {
      props: {
        messages: data,
      },
    };
  } catch (error) {
    await handleRequestError(error, req, res);
    return {
      props: {
        messages: [],
      },
    };
  }
}

export default SMSMessages;
