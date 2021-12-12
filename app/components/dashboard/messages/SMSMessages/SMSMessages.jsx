import React, { useContext, useEffect, useReducer } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import dynamic from 'next/dynamic';
import NotificationsContext from 'app/context/notificationsContext';
import { textForKey } from 'app/utils/localization';
import {
  deleteMessage,
  getMessages,
  toggleMessageStatus,
} from 'middleware/api/messages';
import SMSMessageItem from './SMSMessageItem';
import styles from './SMSMessages.module.scss';
import { initialState, actions, reducer } from './SMSMessages.reducer';
import SMSMessagesHeader from './SMSMessagesHeader';

const ConfirmationModal = dynamic(() =>
  import('app/components/common/modals/ConfirmationModal'),
);
const CreateMessageDialog = dynamic(() => import('../CreateMessageDialog'));

const SMSMessages = ({ currentClinic, messages: initialMessages }) => {
  const toast = useContext(NotificationsContext);
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
  }, []);

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
    <div className={styles.smsMessagesRoot}>
      <CreateMessageDialog
        open={isCreatingMessage}
        initialMessage={messageToEdit}
        currentClinic={currentClinic}
        onClose={handleCloseCreateMessage}
        onCreateMessage={handleMessageCreated}
      />
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
      <SMSMessagesHeader
        canCreate={hasSMSAlias}
        onCreate={handleStartCreateMessage}
      />
      <div className={styles.dataWrapper}>
        {hasSMSAlias && isLoading && (
          <div className={styles.progressWrapper}>
            <CircularProgress classes={{ root: styles.progress }} />
          </div>
        )}
        {!hasSMSAlias && (
          <Typography classes={{ root: styles.noAliasLabel }}>
            {textForKey('no_sms_alias_message')}
            <a href='tel:37360112286'>+373 (60) 112286</a>
          </Typography>
        )}
        {!isLoading && messages.length === 0 && hasSMSAlias && (
          <Typography classes={{ root: styles.noAliasLabel }}>
            {textForKey('no_sms_messages')}
          </Typography>
        )}
        {hasSMSAlias && !isLoading && messages.length > 0 && (
          <TableContainer classes={{ root: styles.tableContainer }}>
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
