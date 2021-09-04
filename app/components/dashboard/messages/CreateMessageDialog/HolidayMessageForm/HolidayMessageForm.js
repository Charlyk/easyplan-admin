import React, { useEffect, useReducer, useRef } from "react";
import dynamic from 'next/dynamic';
import moment from "moment-timezone";
import Form from "react-bootstrap/Form";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";

import { textForKey } from "../../../../../../utils/localization";
import {
  availableHours,
  charactersRegex,
  messageTypeEnum,
  tags
} from "../CreateMessageDialog.constants";
import reducer, {
  initialState, setHourToSend, setLanguage,
  setMaxLength,
  setMessage,
  setMessageData,
  setMessageDate,
  setMessageTitle,
  setShowDatePicker,
} from "./holidayMessageSlice";
import styles from './HolidayMessageForm.module.scss';

const EasyDatePicker = dynamic(() => import("../../../../../../components/common/EasyDatePicker"));

const HolidayMessageForm = ({ currentClinic, initialMessage, onMessageChange, onLanguageChange }) => {
  const datePickerAnchor = useRef(null);
  const availableTags = tags.filter((item) =>
    item.availableFor.includes(messageTypeEnum.HolidayCongrats),
  );
  const [{
    messageTitle,
    language,
    message,
    maxLength,
    hourToSend,
    showDatePicker,
    messageDate,
  }, localDispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (initialMessage == null) {
      return;
    }
    localDispatch(setMessageData(initialMessage));
  }, [initialMessage])

  useEffect(() => {
    const messageValue = message[language];
    let maxLength = 160;
    if (charactersRegex.test(messageValue)) {
      maxLength = 70;
    }
    localDispatch(setMaxLength(maxLength));
  }, [message, language]);

  useEffect(() => {
    onLanguageChange?.(language);
  }, [language]);

  useEffect(() => {
    const requestBody = {
      messageTitle,
      message,
      messageType: messageTypeEnum.HolidayCongrats,
      messageDate: moment().format('YYYY-MM-DD'),
      hour: hourToSend,
    };
    onMessageChange?.(requestBody);
  }, [message, messageTitle, hourToSend]);

  const handleMessageChange = (event) => {
    const newMessage = event.target.value;
    localDispatch(setMessage({ [language]: newMessage }));
  };

  const handleMessageTitleChange = (event) => {
    localDispatch(setMessageTitle(event.target.value));
  };

  const handleLanguageChange = (event) => {
    localDispatch(setLanguage(event.target.value));
  };

  const handleMessageHourChange = (event) => {
    localDispatch(setHourToSend(event.target.value));
  };

  const handleTagClick = (tag) => () => {
    const currentMessage = message[language];
    localDispatch(
      setMessage({ [language]: `${currentMessage}${tag.id}` }),
    );
  };

  const handleDateChange = (newDate) => {
    localDispatch(setMessageDate(newDate));
  };

  const handleShowDatePicker = () => {
    localDispatch(setShowDatePicker(true));
  };

  const handleCloseDatePicker = () => {
    localDispatch(setShowDatePicker(false));
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
    <div className={styles.holidayMessageRoot}>
      <div className={styles.formContainer}>
        <Typography className={styles.formTitle}>
          {textForKey(messageTypeEnum.HolidayCongrats)}
        </Typography>
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
            custom
            className={styles.languagesSelect}
            as='select'
            onChange={handleLanguageChange}
            value={language}
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
        <Form.Group controlId='hourToSendAt'>
          <Form.Label>{textForKey('Send notification at')}:</Form.Label>
          <Form.Control
            custom
            className={styles.languagesSelect}
            as='select'
            onChange={handleMessageHourChange}
            value={hourToSend}
          >
            {availableHours.map((hour) => (
              <option key={hour} value={hour}>
                {hour}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group className={styles['date-form-group']}>
          <Form.Label>{textForKey('Date')}</Form.Label>
          <Form.Control
            readOnly
            value={moment(messageDate).format('DD MMMM')}
            ref={datePickerAnchor}
            onClick={handleShowDatePicker}
          />
        </Form.Group>
      </div>
      <div className={styles.descriptionContainer}>
        <Typography className={styles.description}>
          {textForKey('holidaycongratsdesc')}
        </Typography>
      </div>
    </div>
  );
};

export default HolidayMessageForm;
