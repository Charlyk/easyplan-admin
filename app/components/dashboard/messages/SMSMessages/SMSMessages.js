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

import ConfirmationModal from '../../../common/ConfirmationModal';
import { textForKey } from '../../../../../utils/localization';
import { deleteMessage, getMessages, toggleMessageStatus } from "../../../../../middleware/api/messages";
import CreateMessageModal from '../CreateMessageModal';
import SMSMessageItem from './SMSMessageItem';
import SMSMessagesHeader from './SMSMessagesHeader';
import { initialState, actions, reducer } from './SMSMessages.reducer'
import styles from './SMSMessages.module.scss';

const SMSMessages = ({ currentClinic, messages: initialMessages }) => {
  const hasSMSAlias = currentClinic?.smsAlias != null;
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
            <CircularProgress classes={{ root: styles.progress }}/>
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
  );
};

export default SMSMessages;
