import React, { useEffect, useReducer } from "react";
import moment from "moment-timezone";
import Typography from '@material-ui/core/Typography';

import { textForKey } from "../../../../../../utils/localization";
import {
  availableHours,
  charactersRegex, getRealMessageLength,
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
import MainMessageForm from "../MainMessageForm";

const ScheduleMessageForm = ({ currentClinic, initialMessage, onMessageChange, onLanguageChange, onSubmit }) => {
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

  const handleSubmit = (event) => {
    event?.preventDefault();
    onSubmit?.();
  }

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

  const getMessageLength = (language) => {
    return getRealMessageLength(language, message, currentClinic);
  };

  const isLengthExceeded = getMessageLength(language) > maxLength;

  return (
    <div className={styles.scheduleMessageRoot}>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <Typography className={styles.formTitle}>
          {textForKey(messageTypeEnum.ScheduleNotification)}
        </Typography>
        <MainMessageForm
          currentClinic={currentClinic}
          maxLength={maxLength}
          messageTitle={messageTitle}
          message={message}
          language={language}
          availableTags={availableTags}
          hourToSend={hourToSend}
          availableHours={availableHours}
          isLengthExceeded={isLengthExceeded}
          onMessageTitleChange={handleMessageTitleChange}
          onMessageChange={handleMessageChange}
          onLanguageChange={handleLanguageChange}
          onMessageHourChange={handleMessageHourChange}
          onTagClick={handleTagClick}
        />
      </form>
      <div className={styles.descriptionContainer}>
        <Typography className={styles.description}>
          {textForKey('schedulenotificationdesc')}
        </Typography>
      </div>
    </div>
  );
};

export default ScheduleMessageForm;
