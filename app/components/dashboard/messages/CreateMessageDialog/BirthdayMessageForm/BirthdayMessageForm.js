import React, { useEffect, useReducer } from "react";
import moment from "moment-timezone";
import Form from "react-bootstrap/Form";
import Box from "@material-ui/core/Box";
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
  setMessageData, setMessageTitle
} from "./birthdayMessageSlice";
import styles from './BirthdayMessageForm.module.scss';
import Typography from "@material-ui/core/Typography";

const BirthdayMessageForm = ({ currentClinic, initialMessage, onMessageChange, onLanguageChange }) => {
  const availableTags = tags.filter((item) =>
    item.availableFor.includes(messageTypeEnum.BirthdayCongrats),
  );
  const [{
    messageTitle,
    language,
    message,
    maxLength,
    hourToSend,
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
      messageType: messageTypeEnum.BirthdayCongrats,
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

  return (
    <div className={styles.birthdayMessageRoot}>
      <div className={styles.formContainer}>
        <Typography className={styles.formTitle}>
          {textForKey(messageTypeEnum.BirthdayCongrats)}
        </Typography>
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
      </div>
      <div className={styles.descriptionContainer}>
        <Typography className={styles.description}>
          {textForKey('birthdaycongratsdesc')}
        </Typography>
      </div>
    </div>
  )
};

export default BirthdayMessageForm;
