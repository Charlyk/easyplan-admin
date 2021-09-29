import React, { useCallback, useEffect, useReducer, useRef } from "react";
import dynamic from 'next/dynamic';
import debounce from 'lodash/debounce';
import Form from "react-bootstrap/Form";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import { toast } from "react-toastify";
import moment from "moment-timezone";

import { countMessageRecipients } from "../../../../../../middleware/api/messages";
import { textForKey } from "../../../../../../utils/localization";
import {
  availableHours,
  charactersRegex,
  messageTypeEnum,
  tags
} from "../CreateMessageDialog.constants";
import ReceiversFilter from "../ReceiversFilter";
import reducer, {
  initialState,
  setHourToSend,
  setLanguage,
  setMaxLength,
  setMessage,
  setMessageData,
  setMessageTitle,
  setMessageDate,
  setShowDatePicker,
  setFilterData,
  setRecipientsCount,
} from './promotionalMessageSlice';
import styles from './PromotionalMessageForm.module.scss';

const EasyDatePicker = dynamic(() => import("../../../../common/EasyDatePicker"));

const PromotionalMessageForm = (
  {
    currentClinic,
    initialMessage,
    isLoading,
    onMessageChange,
    onLanguageChange
  }
) => {
  const datePickerAnchor = useRef(null);
  const availableTags = tags.filter((item) =>
    item.availableFor.includes(messageTypeEnum.PromotionalMessage),
  );
  const [{
    messageTitle,
    language,
    message,
    maxLength,
    hourToSend,
    showDatePicker,
    messageDate,
    filterData,
    recipientsCount,
  }, localDispatch] = useReducer(reducer, initialState);

  const updateRecipientsCount = useCallback(debounce(async () => {
    try {
      const [startDate, endDate] = filterData.range;
      const requestBody = {
        statuses: filterData.statuses.filter(it => it.id !== 'All').map(it => it.id),
        categories: filterData.categories.filter(it => it.id !== -1).map(it => it.id),
        services: filterData.services.filter(it => it.id !== -1).map(it => it.id),
        startDate: startDate,
        endDate: endDate,
      };
      const response = await countMessageRecipients(requestBody);
      const { data } = response;
      if (data.isError) {
        toast.error(data.message);
        return;
      }
      localDispatch(setRecipientsCount(data));
    } catch (error) {
      if (error.response != null) {
        const { data } = error.response;
        toast.error(data.message || textForKey("something_went_wrong"));
      } else {
        toast.error(error.message || textForKey("something_went_wrong"));
      }
    }
  }, 500), [filterData])

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
      messageType: messageTypeEnum.PromotionalMessage,
      messageDate: moment().format('YYYY-MM-DD'),
      hour: hourToSend,
      filter: filterData,
    };
    onMessageChange?.(requestBody);
  }, [message, messageTitle, hourToSend, filterData]);

  useEffect(() => {
    updateRecipientsCount();
  }, [filterData]);

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

  const handleFilterChange = useCallback((filterData) => {
    localDispatch(setFilterData(filterData));
  }, [localDispatch]);

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
    <div className={styles.promotionalMessageRoot}>
      <div className={styles.formContainer}>
        <Typography className={styles.formTitle}>
          {textForKey(messageTypeEnum.PromotionalMessage)}
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
        <Form.Group className={styles.dateField}>
          <Form.Label>{textForKey('Date')}</Form.Label>
          <Form.Control
            readOnly
            value={moment(messageDate).format('DD MMMM')}
            ref={datePickerAnchor}
            onClick={handleShowDatePicker}
          />
        </Form.Group>
        <ReceiversFilter
          currentClinic={currentClinic}
          recipientsCount={recipientsCount}
          initialData={initialMessage?.filter}
          isLoading={isLoading}
          onChange={handleFilterChange}
        />
      </div>
      <div className={styles.descriptionContainer}>
        <Typography className={styles.description}>
          {textForKey('promotionalmessagedesc')}
        </Typography>
      </div>
    </div>
  );
};

export default PromotionalMessageForm;
