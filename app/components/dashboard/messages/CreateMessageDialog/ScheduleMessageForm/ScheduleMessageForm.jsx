import React, { useEffect, useReducer } from "react";
import moment from "moment-timezone";
import Form from "react-bootstrap/Form";
import Box from "@material-ui/core/Box";
import Typography from '@material-ui/core/Typography';
import clsx from "clsx";

import { textForKey } from "../../../../../../utils/localization";
import EASTextField from "../../../../common/EASTextField";
import {
  availableHours,
  charactersRegex,
  messageTypeEnum,
  tags
} from "../CreateMessageDialog.constants";
import reducer, {
  initialState,
  setLanguage,
  setMaxLength,
  setMessage,
  setMessageTitle,
  setHourToSend,
  setMessageData,
} from './scheduleMessageSlice';
import styles from './ScheduleMessageForm.module.scss';
import EASSelect from "../../../../common/EASSelect";
import EASTextarea from "../../../../common/EASTextarea";

const languages = [
  {
    id: 'ro',
    name: 'Română',
  },
  {
    id: 'ru',
    name: 'Русский',
  },
  {
    id: 'en',
    name: 'English',
  },
];

const ScheduleMessageForm = ({ currentClinic, initialMessage, onMessageChange, onLanguageChange }) => {
  const availableTags = tags.filter((item) =>
    item.availableFor.includes(messageTypeEnum.ScheduleNotification),
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
  }, [initialMessage]);

  useEffect(() => {
    onLanguageChange?.(language);
  }, [language]);

  useEffect(() => {
    const messageValue = message[language];
    let maxLength = 160;
    if (charactersRegex.test(messageValue)) {
      maxLength = 70;
    }
    localDispatch(setMaxLength(maxLength));
  }, [message, language]);

  useEffect(() => {
    const requestBody = {
      messageTitle,
      message,
      messageType: messageTypeEnum.ScheduleNotification,
      messageDate: moment().format('YYYY-MM-DD'),
      hour: hourToSend,
    };
    onMessageChange?.(requestBody);
  }, [message, messageTitle, hourToSend]);

  const handleMessageChange = (newValue) => {
    localDispatch(setMessage({ [language]: newValue }));
  };

  const handleMessageTitleChange = (newValue) => {
    localDispatch(setMessageTitle(newValue));
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

  const getMappedHours = (hours) => {
    return hours.map(item => ({
      id: item,
      name: item,
    }));
  };

  const isLengthExceeded = getRealMessageLength(language) > maxLength;

  return (
    <div className={styles.scheduleMessageRoot}>
      <div className={styles.formContainer}>
        <Typography className={styles.formTitle}>
          {textForKey(messageTypeEnum.ScheduleNotification)}
        </Typography>
        <EASTextField
          containerClass={styles.simpleField}
          fieldLabel={textForKey('Message title')}
          value={messageTitle}
          helperText={textForKey('messagetitledesc')}
          onChange={handleMessageTitleChange}
        />

        <EASSelect
          rootClass={styles.simpleField}
          label={textForKey('Message language')}
          labelId="language-select"
          value={language}
          onChange={handleLanguageChange}
          options={languages}
        />

        <EASTextarea
          containerClass={styles.simpleField}
          error={isLengthExceeded}
          value={message[language]}
          fieldLabel={textForKey('Message text')}
          onChange={handleMessageChange}
          helperText={
            <Box
              display='flex'
              alignItems='center'
              justifyContent='space-between'
            >
              <Typography className={styles.descriptionHelper}>
                {textForKey('languagedesc')}
              </Typography>
              <Typography
                className={clsx(
                  styles.messageLength,
                  {
                    [styles.exceeded]: isLengthExceeded
                  }
                )}
              >
                {getRealMessageLength(language)}/{maxLength}
              </Typography>
            </Box>
          }
        />

        <div className={styles.tagsWrapper}>
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

        <EASSelect
          rootClass={styles.simpleField}
          label={textForKey('Send notification at')}
          options={getMappedHours(availableHours)}
          onChange={handleMessageHourChange}
          value={hourToSend}
        />
      </div>
      <div className={styles.descriptionContainer}>
        <Typography className={styles.description}>
          {textForKey('schedulenotificationdesc')}
        </Typography>
      </div>
    </div>
  );
};

export default ScheduleMessageForm;
