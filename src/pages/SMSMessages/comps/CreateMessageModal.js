import React, { useReducer, useRef } from 'react';

import moment from 'moment';
import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';

import EasyDatePicker from '../../../components/EasyDatePicker';
import EasyPlanModal from '../../../components/EasyPlanModal/EasyPlanModal';
import { generateReducerActions } from '../../../utils/helperFuncs';
import { textForKey } from '../../../utils/localization';
import '../styles.scss';

const messageTypeEnum = {
  ScheduleNotification: 'ScheduleNotification',
  BirthdayCongrats: 'BirthdayCongrats',
  HolidayCongrats: 'HolidayCongrats',
  PromotionalMessage: 'PromotionalMessage',
  OnetimeMessage: 'OnetimeMessage',
};

const initialState = {
  language: 'ro',
  message: { ro: '', en: '', ru: '' },
  messageTitle: '',
  messageType: messageTypeEnum.ScheduleNotification,
  showDatePicker: false,
  messageDate: new Date(),
};

const reducerTypes = {
  setMessage: 'setMessage',
  setMessageTitle: 'setMessageTitle',
  setLanguage: 'setLanguage',
  setMessageType: 'setMessageType',
  setShowDatePicker: 'setShowDatePicker',
  setMessageDate: 'setMessageDate',
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setLanguage:
      return { ...state, language: action.payload };
    case reducerTypes.setMessage:
      return { ...state, message: { ...state.message, ...action.payload } };
    case reducerTypes.setMessageTitle:
      return { ...state, messageTitle: action.payload };
    case reducerTypes.setMessageType:
      return { ...state, messageType: action.payload };
    case reducerTypes.setShowDatePicker:
      return { ...state, showDatePicker: action.payload };
    case reducerTypes.setMessageDate:
      return { ...state, messageDate: action.payload, showDatePicker: false };
    default:
      return state;
  }
};

const CreateMessageModal = ({ open, onClose }) => {
  const datePickerAnchor = useRef(null);
  const [
    {
      message,
      language,
      messageType,
      messageTitle,
      showDatePicker,
      messageDate,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  const handleMessageChange = (event) => {
    localDispatch(actions.setMessage({ [language]: event.target.value }));
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
      title={textForKey('Create message')}
      open={open}
      onClose={onClose}
    >
      {showDatePicker && datePicker}
      <Form.Group>
        <Form.Label>{textForKey('Message title')}</Form.Label>
        <Form.Control
          value={messageTitle}
          onChange={handleMessageTitleChange}
        />
      </Form.Group>
      <Form.Group controlId='messageType'>
        <Form.Label>{textForKey('Language')}</Form.Label>
        <Form.Control
          as='select'
          onChange={handleLanguageChange}
          value={language}
          custom
        >
          <option value='ro'>Română</option>
          <option value='ru'>Русский</option>
          <option value='en'>English</option>
        </Form.Control>
      </Form.Group>
      <Form.Group controlId='messageText'>
        <Form.Label>{textForKey('Message text')}</Form.Label>
        <InputGroup>
          <Form.Control
            as='textarea'
            value={message[language]}
            onChange={handleMessageChange}
            aria-label='With textarea'
          />
        </InputGroup>
      </Form.Group>
      <Form.Group controlId='messageType'>
        <Form.Label>{textForKey('Message type')}</Form.Label>
        <Form.Control
          as='select'
          onChange={handleMessageTypeChange}
          value={messageType}
          custom
        >
          <option value={messageTypeEnum.PromotionalMessage}>
            {textForKey('Promotional message')}
          </option>
          <option value={messageTypeEnum.OnetimeMessage}>
            {textForKey('One time message')}
          </option>
          <option value={messageTypeEnum.HolidayCongrats}>
            {textForKey('Holiday congratulations')}
          </option>
          <option value={messageTypeEnum.BirthdayCongrats}>
            {textForKey('Birthday congratulations')}
          </option>
          <option value={messageTypeEnum.ScheduleNotification}>
            {textForKey('Appointment notification')}
          </option>
        </Form.Control>
      </Form.Group>
      {messageType === messageTypeEnum.HolidayCongrats && (
        <Form.Group className='date-form-group'>
          <Form.Label>{textForKey('Date')}</Form.Label>
          <Form.Control
            value={moment(messageDate).format('DD MMMM YYYY')}
            ref={datePickerAnchor}
            readOnly
            onClick={handleShowDatePicker}
          />
        </Form.Group>
      )}
    </EasyPlanModal>
  );
};

export default CreateMessageModal;

CreateMessageModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
