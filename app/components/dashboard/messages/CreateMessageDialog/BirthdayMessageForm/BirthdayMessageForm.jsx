import React, { useEffect, useReducer } from "react";
import moment from "moment-timezone";
import Typography from "@material-ui/core/Typography";

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
import MainMessageForm from "../MainMessageForm";

const BirthdayMessageForm = ({ currentClinic, initialMessage, onMessageChange, onLanguageChange, onSubmit }) => {
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
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <Typography className={styles.formTitle}>
          {textForKey(messageTypeEnum.BirthdayCongrats)}
        </Typography>
        <MainMessageForm
          currentClinic={currentClinic}
          messageTitle={messageTitle}
          onMessageTitleChange={handleMessageTitleChange}
          language={language}
          onLanguageChange={handleLanguageChange}
          message={message}
          onMessageChange={handleMessageChange}
          maxLength={maxLength}
          isLengthExceeded={isLengthExceeded}
          availableTags={availableTags}
          onTagClick={handleTagClick}
          hourToSend={hourToSend}
          availableHours={availableHours}
          onMessageHourChange={handleMessageHourChange}
        />
      </form>
      <div className={styles.descriptionContainer}>
        <Typography className={styles.description}>
          {textForKey('birthdaycongratsdesc')}
        </Typography>
      </div>
    </div>
  )
};

export default BirthdayMessageForm;
