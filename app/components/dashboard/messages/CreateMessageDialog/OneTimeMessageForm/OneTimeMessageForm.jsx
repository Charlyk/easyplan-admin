import React, { useEffect, useReducer } from "react";
import moment from "moment-timezone";
import Typography from "@material-ui/core/Typography";

import { textForKey } from "../../../../../utils/localization";
import {
  charactersRegex,
  messageTypeEnum,
  tags
} from "../CreateMessageDialog.constants";
import reducer, {
  initialState,
  setLanguage,
  setMaxLength,
  setMessage,
  setMessageData,
  setMessageTitle
} from "./oneTimeMessageSlice";
import styles from "./OneTimeMessageForm.module.scss";
import MainMessageForm from "../MainMessageForm";

const OneTimeMessageForm = ({ currentClinic, initialMessage, onMessageChange, onLanguageChange }) => {
  const availableTags = tags.filter((item) =>
    item.availableFor.includes(messageTypeEnum.OnetimeMessage),
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
      messageType: messageTypeEnum.OnetimeMessage,
      messageDate: moment().format('YYYY-MM-DD'),
      hour: '',
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
    <div className={styles.oneTimeMessageRoot}>
      <div className={styles.formContainer}>
        <Typography className={styles.formTitle}>
          {textForKey(messageTypeEnum.OnetimeMessage)}
        </Typography>
        <MainMessageForm
          hideHour
          currentClinic={currentClinic}
          messageTitle={messageTitle}
          onMessageTitleChange={handleMessageTitleChange}
          language={language}
          onLanguageChange={handleLanguageChange}
          message={message}
          onMessageChange={handleMessageChange}
          availableTags={availableTags}
          onTagClick={handleTagClick}
          maxLength={maxLength}
          isLengthExceeded={isLengthExceeded}
        />
      </div>
      <div className={styles.descriptionContainer}>
        <Typography className={styles.description}>
          {textForKey('onetimemessagedesc')}
        </Typography>
      </div>
    </div>
  );
};

export default OneTimeMessageForm;
