import React, { useEffect, useReducer, useRef } from 'react';
import Typography from '@material-ui/core/Typography';
import moment from 'moment-timezone';
import dynamic from 'next/dynamic';
import { useTranslate } from 'react-polyglot';
import EASTextField from 'app/components/common/EASTextField';
import {
  availableHours,
  charactersRegex,
  messageTypeEnum,
  tags,
} from '../CreateMessageDialog.constants';
import MainMessageForm from '../MainMessageForm';
import styles from './HolidayMessageForm.module.scss';
import reducer, {
  initialState,
  setHourToSend,
  setLanguage,
  setMaxLength,
  setMessage,
  setMessageData,
  setMessageDate,
  setMessageTitle,
  setShowDatePicker,
} from './holidayMessageSlice';

const EasyDatePicker = dynamic(() =>
  import('app/components/common/EasyDatePicker'),
);

const HolidayMessageForm = ({
  currentClinic,
  initialMessage,
  onMessageChange,
  onLanguageChange,
  onSubmit,
}) => {
  const textForKey = useTranslate();
  const datePickerAnchor = useRef(null);
  const availableTags = tags.filter((item) =>
    item.availableFor.includes(messageTypeEnum.HolidayCongrats),
  );
  const [
    {
      messageTitle,
      language,
      message,
      maxLength,
      hourToSend,
      showDatePicker,
      messageDate,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    if (initialMessage == null) {
      return;
    }
    localDispatch(setMessageData(initialMessage));
  }, [initialMessage]);

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
      messageDate: moment(messageDate).format('YYYY-MM-DD'),
      hour: hourToSend,
    };
    onMessageChange?.(requestBody);
  }, [message, messageTitle, hourToSend, messageDate]);

  const handleSubmit = (event) => {
    event?.preventDefault();
    onSubmit?.();
  };

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
    localDispatch(setMessage({ [language]: `${currentMessage}${tag.id}` }));
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
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <Typography className={styles.formTitle}>
          {textForKey(messageTypeEnum.HolidayCongrats.toLowerCase())}
        </Typography>
        {showDatePicker && datePicker}
        <MainMessageForm
          currentClinic={currentClinic}
          messageTitle={messageTitle}
          onMessageTitleChange={handleMessageTitleChange}
          language={language}
          onLanguageChange={handleLanguageChange}
          message={message}
          onMessageChange={handleMessageChange}
          isLengthExceeded={isLengthExceeded}
          maxLength={maxLength}
          availableTags={availableTags}
          onTagClick={handleTagClick}
          hourToSend={hourToSend}
          onMessageHourChange={handleMessageHourChange}
          availableHours={availableHours}
        />

        <EASTextField
          readOnly
          ref={datePickerAnchor}
          containerClass={styles.simpleField}
          fieldLabel={textForKey('date')}
          value={moment(messageDate).format('DD MMMM')}
          onPointerUp={handleShowDatePicker}
        />
      </form>
      <div className={styles.descriptionContainer}>
        <Typography className={styles.description}>
          {textForKey('holidaycongratsdesc')}
        </Typography>
      </div>
    </div>
  );
};

export default HolidayMessageForm;
