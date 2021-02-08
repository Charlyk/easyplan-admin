import React, { useEffect, useReducer, useRef } from 'react';

import { Box } from '@material-ui/core';
import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';

import EasyDatePicker from '../../../components/EasyDatePicker';
import EasyPlanModal from '../../../components/EasyPlanModal/EasyPlanModal';
import dataAPI from '../../../utils/api/dataAPI';
import { generateReducerActions } from '../../../utils/helperFuncs';
import { textForKey } from '../../../utils/localization';
import '../styles.scss';

const charactersRegex = /[а-яА-ЯЁёĂăÎîȘșȚțÂâ]/;

const messageTypeEnum = {
  ScheduleNotification: 'ScheduleNotification',
  BirthdayCongrats: 'BirthdayCongrats',
  HolidayCongrats: 'HolidayCongrats',
  PromotionalMessage: 'PromotionalMessage',
  OnetimeMessage: 'OnetimeMessage',
};

const tags = [
  {
    id: '{{patientFullName}}',
    label: textForKey('Patient full name'),
    availableFor: [
      'ScheduleNotification',
      'BirthdayCongrats',
      'HolidayCongrats',
      'PromotionalMessage',
      'OnetimeMessage',
    ],
  },
  {
    id: '{{patientFirstName}}',
    label: textForKey('Patient first name'),
    availableFor: [
      'ScheduleNotification',
      'BirthdayCongrats',
      'HolidayCongrats',
      'PromotionalMessage',
      'OnetimeMessage',
    ],
  },
  {
    id: '{{patientLastName}}',
    label: textForKey('Patient last name'),
    availableFor: [
      'ScheduleNotification',
      'BirthdayCongrats',
      'HolidayCongrats',
      'PromotionalMessage',
      'OnetimeMessage',
    ],
  },
  {
    id: '{{confirmationLink}}',
    label: textForKey('Confirmation link'),
    availableFor: ['ScheduleNotification'],
  },
  {
    id: '{{clinicName}}',
    label: textForKey('Clinic name'),
    availableFor: ['ScheduleNotification'],
  },
  {
    id: '{{scheduleHour}}',
    label: textForKey('Schedule hour'),
    availableFor: ['ScheduleNotification'],
  },
  {
    id: '{{scheduleDate}}',
    label: textForKey('Schedule date'),
    availableFor: ['ScheduleNotification'],
  },
];

const messageTypeDescription = {
  ScheduleNotification: textForKey('schedulenotificationdesc'),
  BirthdayCongrats: textForKey('birthdaycongratsdesc'),
  HolidayCongrats: textForKey('holidaycongratsdesc'),
  PromotionalMessage: textForKey('promotionalmessagedesc'),
  OnetimeMessage: textForKey('onetimemessagedesc'),
};

const availableLanguages = ['ro', 'ru', 'en'];

const initialState = {
  isLoading: false,
  language: 'ro',
  message: { ro: '', en: '', ru: '' },
  messageTitle: '',
  messageType: messageTypeEnum.ScheduleNotification,
  messageTimeType: 'Minute',
  messageTime: 0,
  showDatePicker: false,
  messageDate: new Date(),
  maxLength: 160,
};

const reducerTypes = {
  setIsLoading: 'setIsLoading',
  setMessage: 'setMessage',
  setMessageTitle: 'setMessageTitle',
  setLanguage: 'setLanguage',
  setMessageType: 'setMessageType',
  setShowDatePicker: 'setShowDatePicker',
  setMessageDate: 'setMessageDate',
  setMessageTimeType: 'setMessageTimeType',
  setMessageTime: 'setMessageTime',
  setMaxLength: 'setMaxLength',
  setMessageData: 'setMessageData',
  resetState: 'resetState',
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    case reducerTypes.setLanguage:
      return { ...state, language: action.payload };
    case reducerTypes.setMessage: {
      return {
        ...state,
        message: { ...state.message, ...action.payload },
      };
    }
    case reducerTypes.setMessageTitle:
      return { ...state, messageTitle: action.payload };
    case reducerTypes.setMessageType:
      return { ...state, messageType: action.payload };
    case reducerTypes.setShowDatePicker:
      return { ...state, showDatePicker: action.payload };
    case reducerTypes.setMessageDate:
      return { ...state, messageDate: action.payload, showDatePicker: false };
    case reducerTypes.setMessageTimeType:
      return { ...state, messageTimeType: action.payload };
    case reducerTypes.setMessageTime:
      return { ...state, messageTime: action.payload };
    case reducerTypes.setMaxLength:
      return { ...state, maxLength: action.payload };
    case reducerTypes.setMessageData: {
      const message = action.payload;
      return {
        ...state,
        messageTitle: message.title,
        message: JSON.parse(message.message),
        messageType: message.type,
        messageTimeType: message.timeType,
        messageTime: message.sendTime,
        messageDate: moment(message.sendDate).toDate(),
      };
    }
    case reducerTypes.resetState:
      return initialState;
    default:
      return state;
  }
};

const CreateMessageModal = ({
  open,
  message: messageData,
  onClose,
  onCreateMessage,
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
      messageTimeType,
      messageTime,
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
      maxLength = 60;
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

  const handleMessageTimeTypeChange = (event) => {
    localDispatch(actions.setMessageTimeType(event.target.value));
  };

  const handleMessageTimeChange = (event) => {
    localDispatch(actions.setMessageTime(event.target.value));
  };

  const handleTagClick = (tag) => () => {
    const currentMessage = message[language];
    localDispatch(
      actions.setMessage({ [language]: `${currentMessage}${tag.id}` }),
    );
  };

  const currentLength = message[language].length;
  const isLengthExceeded = currentLength > maxLength;

  const isFormValid = availableLanguages.some(
    (language) => message[language].length > 0 && !isLengthExceeded,
  );

  const handleSubmit = async () => {
    if (!isFormValid) {
      return;
    }
    localDispatch(actions.setIsLoading(true));
    const requestBody = {
      messageTitle,
      messageText: JSON.stringify(message),
      messageType,
      timeType: messageTimeType,
      timeBeforeSchedule: messageTime,
      messageDate: moment(messageDate).format('YYYY-MM-DD'),
    };
    const response =
      messageData == null
        ? await dataAPI.createNewSMSMessage(requestBody)
        : await dataAPI.editSMSMessage(messageData.id, requestBody);
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      onCreateMessage(response.data);
    }
    localDispatch(actions.setIsLoading(false));
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
      className='create-message-modal'
      title={textForKey('Create message')}
      open={open}
      onClose={onClose}
      onPositiveClick={handleSubmit}
      isPositiveDisabled={!isFormValid}
      isPositiveLoading={isLoading}
    >
      <div className='form-container'>
        {showDatePicker && datePicker}
        <Form.Group>
          <Form.Label>{textForKey('Message title')}</Form.Label>
          <Form.Control
            value={messageTitle}
            onChange={handleMessageTitleChange}
          />
        </Form.Group>
        <Form.Text className='message-title'>
          {textForKey('messagetitledesc')}
        </Form.Text>
        <Form.Group controlId='messageText'>
          <Form.Label>{textForKey('Message text')}</Form.Label>
          <Form.Control
            className='languages-select'
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
            <Form.Text>{textForKey('languagedesc')}</Form.Text>
            <Form.Text
              className={clsx('message-length', { exceeded: isLengthExceeded })}
            >
              {currentLength}/{maxLength}
            </Form.Text>
          </Box>
          <div className='tags-wrapper'>
            {availableTags.map((tag) => (
              <span
                role='button'
                tabIndex={0}
                key={tag.id}
                className='tag-label'
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
          <Form.Text>{messageTypeDescription[messageType]}</Form.Text>
        </Form.Group>
        {(messageType === messageTypeEnum.HolidayCongrats ||
          messageType === messageTypeEnum.PromotionalMessage) && (
          <Form.Group className='date-form-group'>
            <Form.Label>{textForKey('Date')}</Form.Label>
            <Form.Control
              value={moment(messageDate).format('DD MMMM')}
              ref={datePickerAnchor}
              readOnly
              onClick={handleShowDatePicker}
            />
          </Form.Group>
        )}
        {messageType === messageTypeEnum.ScheduleNotification && (
          <InputGroup controlId='timeBeforeSchedule'>
            <Form.Label>{textForKey('Time before schedule')}</Form.Label>
            <div className='input-group-fields'>
              <Form.Control
                type='number'
                value={messageTime}
                onChange={handleMessageTimeChange}
              />
              <InputGroup.Append>
                <Form.Control
                  as='select'
                  onChange={handleMessageTimeTypeChange}
                  value={messageTimeType}
                  custom
                >
                  <option value='Minute'>{textForKey('Minutes')}</option>
                  <option value='Hour'>{textForKey('Hours')}</option>
                </Form.Control>
              </InputGroup.Append>
            </div>
          </InputGroup>
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
