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
import { toast } from 'react-toastify';

import ConfirmationModal from '../../components/common/ConfirmationModal';
import { generateReducerActions, handleRequestError, redirectToUrl, redirectUserTo } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import CreateMessageModal from '../../components/messages/CreateMessageModal';
import SMSMessageItem from '../../components/messages/SMSMessageItem';
import SMSMessagesHeader from '../../components/messages/SMSMessagesHeader';
import styles from '../../styles/SMSMessages.module.scss';
import MainComponent from "../../components/common/MainComponent";
import { deleteMessage, getMessages, toggleMessageStatus } from "../../middleware/api/messages";
import { fetchAppData } from "../../middleware/api/initialization";
import { parseCookies } from "../../utils";

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

const SMSMessages = ({ currentUser, currentClinic, messages: initialMessages, authToken }) => {
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
      const response = await getMessages();
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
      await deleteMessage(messageToDelete.id);
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
      await toggleMessageStatus(message.id, status);
      await fetchMessages(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEditMessage = (message) => {
    localDispatch(actions.setIsCreatingMessage({ isCreating: true, message }));
  };

  return (
    <MainComponent
      currentClinic={currentClinic}
      currentUser={currentUser}
      currentPath='/messages'
      authToken={authToken}
    >
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
            currentClinic={currentClinic}
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
    const { auth_token: authToken } = parseCookies(req);
    const appData = await fetchAppData(req.headers);
    const { currentUser, currentClinic } = appData;
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/messages');
    if (redirectTo != null) {
      redirectUserTo(redirectTo, res);
      return { props: { ...appData } };
    }

    const response = await getMessages(req.headers);
    const { data } = response;
    return {
      props: {
        authToken,
        messages: data,
        ...appData,
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
