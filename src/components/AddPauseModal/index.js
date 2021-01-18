import React, { useEffect, useReducer, useRef } from 'react';

import moment from 'moment';
import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { toggleAppointmentsUpdate } from '../../redux/actions/actions';
import dataAPI from '../../utils/api/dataAPI';
import { generateReducerActions } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import EasyDatePicker from '../EasyDatePicker';
import EasyPlanModal from '../EasyPlanModal/EasyPlanModal';

const initialState = {
  showDatePicker: false,
  pauseDate: new Date(),
  startHour: '',
  endHour: '',
  comment: '',
  isLoading: false,
  availableAllTime: [],
  availableStartTime: [],
  availableEndTime: [],
  isFetchingHours: false,
};

const reducerTypes = {
  setShowDatePicker: 'setShowDatePicker',
  setPauseDate: 'setPauseDate',
  setStartHour: 'setStartHour',
  setEndHour: 'setEndHour',
  setComment: 'setComment',
  setIsLoading: 'setIsLoading',
  setAvailableAllTime: 'setAvailableAllTime',
  setAvailableStartTime: 'setAvailableStartTime',
  setAvailableEndTime: 'setAvailableEndTime',
  setIsFetchingHours: 'setIsFetchingHours',
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setShowDatePicker:
      return { ...state, showDatePicker: action.payload };
    case reducerTypes.setPauseDate:
      return { ...state, pauseDate: action.payload };
    case reducerTypes.setStartHour: {
      const startHour = action.payload;
      const availableEndTime = state.availableAllTime.filter(
        item => item > startHour,
      );
      return {
        ...state,
        startHour,
        availableEndTime,
        endHour:
          state.endHour < startHour
            ? availableEndTime?.length > 0
              ? availableEndTime[0]
              : []
            : state.endHour,
      };
    }
    case reducerTypes.setEndHour:
      return { ...state, endHour: action.payload };
    case reducerTypes.setComment:
      return { ...state, comment: action.payload };
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    case reducerTypes.setAvailableAllTime: {
      const availableAllTime = action.payload;
      const startHour =
        availableAllTime?.length > 0 && state.startHour.length === 0
          ? availableAllTime[0]
          : state.startHour;
      const endHour =
        availableAllTime?.length > 1 && state.endHour.length === 0
          ? availableAllTime[1]
          : state.endHour;
      const availableStartTime = availableAllTime;
      const availableEndTime = availableAllTime.filter(
        item => item > startHour,
      );
      return {
        ...state,
        availableAllTime,
        availableStartTime,
        availableEndTime,
        startHour,
        endHour,
      };
    }
    case reducerTypes.setAvailableStartTime:
      return { ...state, availableStartTime: action.payload };
    case reducerTypes.setAvailableEndTime:
      return { ...state, availableEndTime: action.payload };
    case reducerTypes.setIsFetchingHours:
      return { ...state, isFetchingHours: action.payload };
    default:
      return state;
  }
};

const AddPauseModal = ({
  open,
  doctor,
  id,
  startTime,
  endTime,
  comment: defaultComment,
  onClose,
}) => {
  const dispatch = useDispatch();
  const datePickerAnchor = useRef(null);
  const [
    {
      isLoading,
      showDatePicker,
      pauseDate,
      availableStartTime,
      availableEndTime,
      isFetchingHours,
      startHour,
      endHour,
      comment,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    if (doctor != null) {
      fetchPauseAvailableTime();
    }
  }, [pauseDate, doctor]);

  useEffect(() => {
    if (startTime == null || endTime == null) {
      return;
    }
    const startHour = moment(startTime).format('HH:mm');
    const endHour = moment(endTime).format('HH:mm');
    localDispatch(actions.setStartHour(startHour));
    localDispatch(actions.setEndHour(endHour));
    localDispatch(actions.setPauseDate(moment(startTime).toDate()));
  }, [startTime, endTime]);

  useEffect(() => {
    localDispatch(actions.setComment(defaultComment));
  }, [defaultComment]);

  const fetchPauseAvailableTime = async () => {
    localDispatch(actions.setIsFetchingHours(true));
    const response = await dataAPI.getPauseAvailableTime({
      date: pauseDate,
      doctorId: doctor.id,
    });
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      localDispatch(actions.setAvailableAllTime(response.data));
    }
    localDispatch(actions.setIsFetchingHours(false));
  };

  const handleDateChange = newDate => {
    localDispatch(actions.setPauseDate(newDate));
  };

  const handleCloseDatePicker = () => {
    localDispatch(actions.setShowDatePicker(false));
  };

  const handleCreateSchedule = async () => {
    if (!isFormValid()) {
      return;
    }
    // toggle loading spinner
    localDispatch(actions.setIsLoading(true));
    // build request body
    const startHourParts = startHour.split(':');
    const endHourParts = endHour.split(':');
    const requestBody = {
      pauseId: id,
      doctorId: doctor.id,
      startTime: moment(pauseDate)
        .set({
          hour: parseInt(startHourParts[0]),
          minute: parseInt(startHourParts[1]),
          second: 0,
        })
        .toDate(),
      endTime: moment(pauseDate)
        .set({
          hour: parseInt(endHourParts[0]),
          minute: parseInt(endHourParts[1]),
          second: 0,
        })
        .toDate(),
      comment,
    };
    // perform request
    const response = await dataAPI.createPauseRecord(requestBody);
    // handle response
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      onClose();
      dispatch(toggleAppointmentsUpdate());
    }
    // toggle loading spinner
    localDispatch(actions.setIsLoading(false));
  };

  const handleDateFieldClick = () => {
    localDispatch(actions.setShowDatePicker(true));
  };

  const handleCommentChange = event => {
    localDispatch(actions.setComment(event.target.value));
  };

  const handleHourChange = event => {
    const targetId = event.target.id;
    switch (targetId) {
      case 'startTime':
        localDispatch(actions.setStartHour(event.target.value));
        break;
      case 'endTime':
        localDispatch(actions.setEndHour(event.target.value));
        break;
    }
  };

  const datePicker = (
    <EasyDatePicker
      disablePortal
      minDate={new Date()}
      open={Boolean(showDatePicker)}
      pickerAnchor={datePickerAnchor.current}
      onChange={handleDateChange}
      selectedDate={pauseDate}
      onClose={handleCloseDatePicker}
    />
  );

  const isFormValid = () => {
    return (
      pauseDate != null &&
      doctor != null &&
      startHour.length === 5 &&
      endHour.length === 5
    );
  };

  return (
    <EasyPlanModal
      onClose={onClose}
      open={open}
      className='add-appointment-root'
      title={`${textForKey('Add pause')}: ${doctor?.firstName} ${
        doctor?.lastName
      }`}
      isPositiveDisabled={!isFormValid() || isLoading}
      onPositiveClick={handleCreateSchedule}
      isPositiveLoading={isLoading}
    >
      <Form.Group className='date-form-group'>
        <Form.Label>{textForKey('Date')}</Form.Label>
        <Form.Control
          value={moment(pauseDate).format('DD MMMM YYYY')}
          ref={datePickerAnchor}
          readOnly
          onClick={handleDateFieldClick}
        />
      </Form.Group>
      <InputGroup>
        <Form.Group style={{ width: '50%' }} controlId='startTime'>
          <Form.Label>{textForKey('Start time')}</Form.Label>
          <Form.Control
            as='select'
            onChange={handleHourChange}
            value={startHour}
            disabled={isFetchingHours || availableStartTime.length === 0}
            custom
          >
            {availableStartTime.map(item => (
              <option key={`start-${item}`} value={item}>
                {item}
              </option>
            ))}
            {availableStartTime.length === 0 && (
              <option value={-1}>{textForKey('No available time')}</option>
            )}
          </Form.Control>
        </Form.Group>
        <Form.Group style={{ width: '50%' }} controlId='endTime'>
          <Form.Label>{textForKey('End time')}</Form.Label>
          <Form.Control
            as='select'
            onChange={handleHourChange}
            value={endHour}
            disabled={isFetchingHours || availableEndTime.length === 0}
            custom
          >
            {availableEndTime.map(item => (
              <option key={`end-${item}`} value={item}>
                {item}
              </option>
            ))}
            {availableEndTime.length === 0 && (
              <option value={-1}>{textForKey('No available time')}</option>
            )}
          </Form.Control>
        </Form.Group>
      </InputGroup>
      <Form.Group controlId='description'>
        <Form.Label>{textForKey('Notes')}</Form.Label>
        <InputGroup>
          <Form.Control
            as='textarea'
            value={comment}
            onChange={handleCommentChange}
            aria-label='With textarea'
          />
        </InputGroup>
      </Form.Group>
      {datePicker}
    </EasyPlanModal>
  );
};

export default AddPauseModal;

AddPauseModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  doctor: PropTypes.shape({
    id: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }),
  id: PropTypes.number,
  startTime: PropTypes.instanceOf(Date),
  endTime: PropTypes.instanceOf(Date),
  comment: PropTypes.string,
};

AddPauseModal.defaultProps = {
  open: false,
  onClose: () => null,
};
