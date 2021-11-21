import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import BottomSheetDialog from 'app/components/common/BottomSheetDialog';
import NotificationsContext from 'app/context/notificationsContext';
import { textForKey } from 'app/utils/localization';
import { createMessage, updateMessage } from 'middleware/api/messages';
import BirthdayMessageForm from './BirthdayMessageForm';
import {
  availableLanguages,
  charactersRegex,
  messageTypeEnum,
  tags,
} from './CreateMessageDialog.constants';
import styles from './CreateMessageDialog.module.scss';
import reducer, {
  initialState,
  setSelectedMenu,
  setMessage,
  setCurrentLanguage,
  setMaxLength,
  setIsLoading,
} from './createMessageDialogSlice';
import HolidayMessageForm from './HolidayMessageForm';
import OneTimeMessageForm from './OneTimeMessageForm';
import PromotionalMessageForm from './PromotionalMessageForm';
import ScheduleMessageForm from './ScheduleMessageForm';

const CreateMessageDialog = ({
  open,
  currentClinic,
  initialMessage,
  onClose,
  onCreateMessage,
}) => {
  const toast = useContext(NotificationsContext);
  const [
    { selectedMenu, currentLanguage, maxLength, message, isLoading },
    localDispatch,
  ] = useReducer(reducer, initialState);

  const handleMessageChange = useCallback(
    (message) => {
      localDispatch(setMessage(message));
    },
    [localDispatch],
  );

  const handleLanguageChange = useCallback(
    (language) => {
      localDispatch(setCurrentLanguage(language));
    },
    [localDispatch],
  );

  const currentForm = useMemo(() => {
    switch (selectedMenu) {
      case messageTypeEnum.ScheduleNotification:
        return (
          <ScheduleMessageForm
            isLoading={isLoading}
            currentClinic={currentClinic}
            initialMessage={initialMessage}
            onLanguageChange={handleLanguageChange}
            onMessageChange={handleMessageChange}
          />
        );
      case messageTypeEnum.PromotionalMessage:
        return (
          <PromotionalMessageForm
            isLoading={isLoading}
            currentClinic={currentClinic}
            initialMessage={initialMessage}
            onLanguageChange={handleLanguageChange}
            onMessageChange={handleMessageChange}
          />
        );
      case messageTypeEnum.HolidayCongrats:
        return (
          <HolidayMessageForm
            isLoading={isLoading}
            currentClinic={currentClinic}
            initialMessage={initialMessage}
            onLanguageChange={handleLanguageChange}
            onMessageChange={handleMessageChange}
          />
        );
      case messageTypeEnum.BirthdayCongrats:
        return (
          <BirthdayMessageForm
            isLoading={isLoading}
            currentClinic={currentClinic}
            initialMessage={initialMessage}
            onLanguageChange={handleLanguageChange}
            onMessageChange={handleMessageChange}
          />
        );
      case messageTypeEnum.OnetimeMessage:
        return (
          <OneTimeMessageForm
            isLoading={isLoading}
            currentClinic={currentClinic}
            initialMessage={initialMessage}
            onLanguageChange={handleLanguageChange}
            onMessageChange={handleMessageChange}
          />
        );
    }
  }, [
    selectedMenu,
    handleMessageChange,
    handleLanguageChange,
    initialMessage,
    isLoading,
  ]);

  useEffect(() => {
    const messageValue = message.message[currentLanguage];
    let maxLength = 160;
    if (charactersRegex.test(messageValue)) {
      maxLength = 70;
    }
    localDispatch(setMaxLength(maxLength));
  }, [message, currentLanguage]);

  useEffect(() => {
    if (initialMessage == null) {
      return;
    }

    localDispatch(setSelectedMenu(initialMessage.messageType));
  }, [initialMessage]);

  const handleMenuClick = (menu) => {
    localDispatch(setSelectedMenu(menu));
  };

  const getRealMessageLength = (language) => {
    let messageValue = message.message[language];
    tags.forEach((tag) => {
      messageValue = messageValue.replace(
        tag.id,
        tag.id !== '{{clinicName}}' ? tag.placeholder : currentClinic.smsAlias,
      );
    });
    return messageValue.length;
  };

  const isLengthExceeded = getRealMessageLength(currentLanguage) > maxLength;

  const isFormValid = availableLanguages.some(
    (language) => getRealMessageLength(language) > 0 && !isLengthExceeded,
  );

  const handleSubmit = async () => {
    if (!isFormValid) {
      return;
    }
    localDispatch(setIsLoading(true));
    try {
      const { filter } = message;
      const requestBody = {
        messageTitle: message.messageTitle,
        messageText: JSON.stringify(message.message),
        messageType: selectedMenu,
        messageDate: moment(message.messageDate).format('YYYY-MM-DD'),
        hour: message.hour,
        filter:
          selectedMenu === messageTypeEnum.PromotionalMessage
            ? {
                statuses: filter.statuses
                  .filter((item) => item.id !== 'All')
                  .map((item) => item.id),
                categories: filter.categories
                  .filter((item) => item.id !== -1)
                  .map((item) => item.id),
                services: filter.services
                  .filter((item) => item.id !== -1)
                  .map((item) => item.id),
                startDate:
                  filter.range.length === 0
                    ? null
                    : moment(filter.range[0]).format('YYYY-MM-DD'),
                endDate:
                  filter.range.length === 0
                    ? null
                    : moment(filter.range[1]).format('YYYY-MM-DD'),
              }
            : null,
      };
      const response =
        initialMessage == null
          ? await createMessage(requestBody)
          : await updateMessage(initialMessage.id, requestBody);
      onCreateMessage?.(response.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(setIsLoading(false));
    }
  };

  const title =
    initialMessage == null
      ? textForKey('Create message')
      : textForKey('Edit message');

  return (
    <BottomSheetDialog
      open={open}
      isLoading={isLoading}
      title={title}
      onSave={handleSubmit}
      onClose={onClose}
    >
      <Drawer
        variant='permanent'
        className={styles.dialogDrawer}
        classes={{ paper: styles.drawerPaper }}
      >
        <Toolbar />
        <div className={styles.drawerContainer}>
          <List>
            {(initialMessage == null ||
              selectedMenu === messageTypeEnum.ScheduleNotification) && (
              <ListItem
                button
                selected={selectedMenu === messageTypeEnum.ScheduleNotification}
                onPointerUp={() =>
                  handleMenuClick(messageTypeEnum.ScheduleNotification)
                }
                classes={{ selected: styles.listItemSelected }}
              >
                <ListItemText
                  primaryTypographyProps={{
                    className: styles.listItemText,
                  }}
                  primary={textForKey(messageTypeEnum.ScheduleNotification)}
                />
              </ListItem>
            )}
            <Divider />
            {(initialMessage == null ||
              selectedMenu === messageTypeEnum.PromotionalMessage) && (
              <ListItem
                button
                selected={selectedMenu === messageTypeEnum.PromotionalMessage}
                onPointerUp={() =>
                  handleMenuClick(messageTypeEnum.PromotionalMessage)
                }
                classes={{ selected: styles.listItemSelected }}
              >
                <ListItemText
                  primaryTypographyProps={{
                    className: styles.listItemText,
                  }}
                  primary={textForKey(messageTypeEnum.PromotionalMessage)}
                />
              </ListItem>
            )}
            <Divider />
            {(initialMessage == null ||
              selectedMenu === messageTypeEnum.HolidayCongrats) && (
              <ListItem
                button
                selected={selectedMenu === messageTypeEnum.HolidayCongrats}
                onPointerUp={() =>
                  handleMenuClick(messageTypeEnum.HolidayCongrats)
                }
                classes={{ selected: styles.listItemSelected }}
              >
                <ListItemText
                  primaryTypographyProps={{
                    className: styles.listItemText,
                  }}
                  primary={textForKey(messageTypeEnum.HolidayCongrats)}
                />
              </ListItem>
            )}
            <Divider />
            {(initialMessage == null ||
              selectedMenu === messageTypeEnum.BirthdayCongrats) && (
              <ListItem
                button
                selected={selectedMenu === messageTypeEnum.BirthdayCongrats}
                onPointerUp={() =>
                  handleMenuClick(messageTypeEnum.BirthdayCongrats)
                }
                classes={{ selected: styles.listItemSelected }}
              >
                <ListItemText
                  primaryTypographyProps={{
                    className: styles.listItemText,
                  }}
                  primary={textForKey(messageTypeEnum.BirthdayCongrats)}
                />
              </ListItem>
            )}
            <Divider />
            {(initialMessage == null ||
              selectedMenu === messageTypeEnum.OnetimeMessage) && (
              <ListItem
                button
                selected={selectedMenu === messageTypeEnum.OnetimeMessage}
                onPointerUp={() =>
                  handleMenuClick(messageTypeEnum.OnetimeMessage)
                }
                classes={{ selected: styles.listItemSelected }}
              >
                <ListItemText
                  primaryTypographyProps={{
                    className: styles.listItemText,
                  }}
                  primary={textForKey(messageTypeEnum.OnetimeMessage)}
                />
              </ListItem>
            )}
          </List>
        </div>
      </Drawer>
      <div className={styles.dataContainer}>{currentForm}</div>
    </BottomSheetDialog>
  );
};

export default CreateMessageDialog;

CreateMessageDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  currentClinic: PropTypes.any.isRequired,
  onClose: PropTypes.func,
};
