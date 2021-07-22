import React, { useEffect, useReducer, useRef } from 'react';

import { Box } from '@material-ui/core';
import clsx from 'clsx';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import { toast } from 'react-toastify';

import EasyDatePicker from '../../../../../components/common/EasyDatePicker';
import EasyPlanModal from '../../../common/modals/EasyPlanModal';
import { textForKey } from '../../../../../utils/localization';
import { createMessage, updateMessage } from "../../../../../middleware/api/messages";
import {
  charactersRegex,
  tags,
  messageTypeDescription,
  availableLanguages,
  availableHours,
  messageTypeEnum
} from './CreateMessageModal.constants'
import { initialState, actions, reducer } from './CreateMessageModal.reducer'
import styles from './CreateMessageModal.module.scss';

const CreateMessageModal = ({
                              open,
                              message: messageData,
                              onClose,
                              onCreateMessage,
                              currentClinic,
                            }) => {
  const datePickerAnchor = useRef(null);
  const [
    {
      isLoading,
      message,
      language,
      messageType,
      messageTitle,
      showDatePicker,
      messageDate,
      hourToSend,
      maxLength,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!open) {
      localDispatch(actions.resetState());
    }
  }, [open]);

  useEffect(() => {
    if (messageData != null) {
      localDispatch(actions.setMessageData(messageData));
    }
  }, [messageData]);

  useEffect(() => {
    const messageValue = message[language];
    let maxLength = 160;
    if (charactersRegex.test(messageValue)) {
      maxLength = 70;
    }
    localDispatch(actions.setMaxLength(maxLength));
  }, [message, language]);

  const handleMessageChange = (event) => {
    const newMessage = event.target.value;
    localDispatch(actions.setMessage({ [language]: newMessage }));
  };

  const handleMessageTypeChange = (event) => {
    localDispatch(actions.setMessageType(event.target.value));
  };

  const handleMessageTitleChange = (event) => {
    localDispatch(actions.setMessageTitle(event.target.value));
  };

  const handleLanguageChange = (event) => {
    localDispatch(actions.setLanguage(event.target.value));
  };

  const handleDateChange = (newDate) => {
    localDispatch(actions.setMessageDate(newDate));
  };

  const handleShowDatePicker = () => {
    localDispatch(actions.setShowDatePicker(true));
  };

  const handleCloseDatePicker = () => {
    localDispatch(actions.setShowDatePicker(false));
  };

  const handleMessageHourChange = (event) => {
    localDispatch(actions.setHourToSend(event.target.value));
  };

  const handleTagClick = (tag) => () => {
    const currentMessage = message[language];
    localDispatch(
      actions.setMessage({ [language]: `${currentMessage}${tag.id}` }),
    );
  };

  const getRealMessageLength = (language) => {
    let messageValue = message[language];
    tags.forEach((tag) => {
      messageValue = messageValue.replace(
        tag.id,
        tag.id !== '{{clinicName}}' ? tag.placeholder : currentClinic.smsAlias,
      );
    });
    return messageValue.length;
  };

  const isLengthExceeded = getRealMessageLength(language) > maxLength;

  const isFormValid = availableLanguages.some(
    (language) => getRealMessageLength(language) > 0 && !isLengthExceeded,
  );

  const handleSubmit = async () => {
    if (!isFormValid) {
      return;
    }
    localDispatch(actions.setIsLoading(true));
    try {
      const requestBody = {
        messageTitle,
        messageText: JSON.stringify(message),
        messageType,
        messageDate: moment(messageDate).format('YYYY-MM-DD'),
        hour: hourToSend,
      };
      const response =
        messageData == null
          ? await createMessage(requestBody)
          : await updateMessage(messageData.id, requestBody);
      onCreateMessage(response.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(actions.setIsLoading(false));
    }
  };

  const availableTags = tags.filter((item) =>
    item.availableFor.includes(messageType),
  );

  const datePicker = (
    <EasyDatePicker
      open={Boolean(showDatePicker)}
      pickerAnchor={datePickerAnchor.current}
      onChange={handleDateChange}
      selectedDate={messageDate}
      onClose={handleCloseDatePicker}
    />
  );

  return (
    <EasyPlanModal
      className={styles['create-message-modal']}
      title={textForKey('Create message')}
      open={open}
      onClose={onClose}
      onPositiveClick={handleSubmit}
      isPositiveDisabled={!isFormValid}
      isPositiveLoading={isLoading}
    >
      <div className={styles['form-container']}>
        {showDatePicker && datePicker}
        <Form.Group>
          <Form.Label>{textForKey('Message title')}</Form.Label>
          <Form.Control
            value={messageTitle}
            onChange={handleMessageTitleChange}
          />
        </Form.Group>
        <Form.Text className={styles['message-title']}>
          {textForKey('messagetitledesc')}
        </Form.Text>
        <Form.Group controlId='messageText' className={styles.messageGroup}>
          <Form.Label>{textForKey('Message text')}</Form.Label>
          <Form.Control
            className={styles['languages-select']}
            as='select'
            onChange={handleLanguageChange}
            value={language}
            custom
          >
            <option value='ro'>Română</option>
            <option value='ru'>Русский</option>
            <option value='en'>English</option>
          </Form.Control>
          <Form.Control
            isInvalid={isLengthExceeded}
            as='textarea'
            value={message[language]}
            onChange={handleMessageChange}
            aria-label='With textarea'
          />
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <Form.Text className={styles.languageDesc}>{textForKey('languagedesc')}</Form.Text>
            <Form.Text
              className={clsx(styles['message-length'], { [styles.exceeded]: isLengthExceeded })}
            >
              {getRealMessageLength(language)}/{maxLength}
            </Form.Text>
          </Box>
          <div className={styles['tags-wrapper']}>
            {availableTags.map((tag) => (
              <span
                role='button'
                tabIndex={0}
                key={tag.id}
                className={styles['tag-label']}
                onClick={handleTagClick(tag)}
              >
                #{tag.label}
              </span>
            ))}
          </div>
        </Form.Group>
        <Form.Group controlId='messageType'>
          <Form.Label>{textForKey('Message type')}</Form.Label>
          <Form.Control
            as='select'
            onChange={handleMessageTypeChange}
            value={messageType}
            custom
          >
            <option value={messageTypeEnum.ScheduleNotification}>
              {textForKey(messageTypeEnum.ScheduleNotification)}
            </option>
            <option value={messageTypeEnum.PromotionalMessage}>
              {textForKey(messageTypeEnum.PromotionalMessage)}
            </option>
            <option value={messageTypeEnum.HolidayCongrats}>
              {textForKey(messageTypeEnum.HolidayCongrats)}
            </option>
            <option value={messageTypeEnum.BirthdayCongrats}>
              {textForKey(messageTypeEnum.BirthdayCongrats)}
            </option>
            <option value={messageTypeEnum.OnetimeMessage}>
              {textForKey(messageTypeEnum.OnetimeMessage)}
            </option>
          </Form.Control>
          <Form.Text className={styles.messageTypeDesc}>{messageTypeDescription[messageType]}</Form.Text>
        </Form.Group>
        {(messageType === messageTypeEnum.HolidayCongrats ||
          messageType === messageTypeEnum.PromotionalMessage) && (
          <Form.Group className={styles['date-form-group']}>
            <Form.Label>{textForKey('Date')}</Form.Label>
            <Form.Control
              value={moment(messageDate).format('DD MMMM')}
              ref={datePickerAnchor}
              readOnly
              onClick={handleShowDatePicker}
            />
          </Form.Group>
        )}
        {messageType !== messageTypeEnum.OnetimeMessage && (
          <Form.Group controlId='hourToSendAt'>
            <Form.Label>{textForKey('Send notification at')}:</Form.Label>
            <Form.Control
              as='select'
              onChange={handleMessageHourChange}
              value={hourToSend}
              custom
            >
              {availableHours.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        )}
      </div>
    </EasyPlanModal>
  );
};

export default CreateMessageModal;

CreateMessageModal.propTypes = {
  open: PropTypes.bool,
  message: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    message: PropTypes.string,
    type: PropTypes.oneOf([
      'ScheduleNotification',
      'BirthdayCongrats',
      'HolidayCongrats',
      'PromotionalMessage',
      'OnetimeMessage',
    ]),
    timeType: PropTypes.oneOf(['Hour', 'Minute']),
    sendTime: PropTypes.number,
    sendDate: PropTypes.string,
    disabled: PropTypes.bool,
  }),
  onClose: PropTypes.func,
  onCreateMessage: PropTypes.func,
};
