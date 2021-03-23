import React, { useEffect, useReducer, useRef } from 'react';

import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { generateReducerActions } from '../../../utils/helperFuncs';
import { textForKey } from '../../../utils/localization';
import EasyDatePicker from '../../common/EasyDatePicker';
import EasyPlanModal from '../../common/EasyPlanModal';
import styles from '../../../styles/AddPauseModal.module.scss';
import axios from "axios";
import { baseAppUrl } from "../../../eas.config";

const filterAvailableTime = (availableTime, startTime) => {
  return availableTime.filter((item) => {
    const [startH, startM] = startTime.split(':');
    const [h, m] = item.split(':');
    const startDate = moment().set({
      hour: parseInt(startH),
      minute: parseInt(startM),
      second: 0,
    });
    const endDate = moment().set({
      hour: parseInt(h),
      minute: parseInt(m),
      second: 0,
    });
    const diff = Math.ceil(endDate.diff(startDate) / 1000 / 60);
    return diff >= 15;
  });
};

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
  isDeleting: false,
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
  setIsDeleting: 'setIsDeleting',
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setShowDatePicker:
      return { ...state, showDatePicker: action.payload };
    case reducerTypes.setPauseDate:
      return { ...state, pauseDate: action.payload, showDatePicker: false };
    case reducerTypes.setStartHour: {
      const startHour = action.payload;
      const endHour = state.endHour;
      const availableEndTime = filterAvailableTime(
        state.availableAllTime,
        startHour,
      );
      return {
        ...state,
        startHour,
        availableEndTime,
        endHour: availableEndTime.includes(endHour)
          ? endHour
          : availableEndTime.length > 0
          ? availableEndTime[0]
          : '',
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
      const availableStartTime = availableAllTime;
      const availableEndTime = filterAvailableTime(availableAllTime, startHour);
      return {
        ...state,
        availableAllTime,
        availableStartTime,
        availableEndTime,
        startHour,
      };
    }
    case reducerTypes.setAvailableStartTime:
      return { ...state, availableStartTime: action.payload };
    case reducerTypes.setAvailableEndTime:
      return { ...state, availableEndTime: action.payload };
    case reducerTypes.setIsFetchingHours:
      return { ...state, isFetchingHours: action.payload };
    case reducerTypes.setIsDeleting:
      return { ...state, isDeleting: action.payload };
    default:
      return state;
  }
};

const AddPauseModal = ({
  open,
  viewDate,
  doctor,
  id,
  startTime,
  endTime,
  comment: defaultComment,
  onClose,
}) => {
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
      isDeleting,
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
  }, [startTime, endTime]);

  useEffect(() => {
    if (viewDate != null && typeof viewDate === 'object') {
      localDispatch(actions.setPauseDate(viewDate.toDate()));
      console.log(typeof viewDate === 'string', viewDate.toDate());
    }
  }, [viewDate]);

  useEffect(() => {
    localDispatch(actions.setComment(defaultComment));
  }, [defaultComment]);

  const fetchPauseAvailableTime = async () => {
    localDispatch(actions.setIsFetchingHours(true));
    try {
      const query = {
        date: moment(pauseDate | viewDate).format('YYYY-MM-DD'),
        doctorId: doctor.id,
      };
      const queryString = new URLSearchParams(query).toString();
      const response = await axios.get(`${baseAppUrl}/api/pauses/available-time?${queryString}`);
      const { data: availableTime } = response;
      localDispatch(actions.setAvailableAllTime(availableTime));
      updateEndTimeBasedOnService(availableTime);
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(actions.setIsFetchingHours(false));
    }
  };

  const updateEndTimeBasedOnService = (availableTime) => {
    if (id != null) {
      return;
    }
    setTimeout(() => {
      const start =
        availableTime.length > 0 && startHour.length === 0
          ? availableTime[0]
          : startHour;
      const [h, m] = start.split(':');
      const end = moment(pauseDate)
        .set({
          hour: parseInt(h),
          minute: parseInt(m),
          second: 0,
        })
        .add(15, 'minutes')
        .format('HH:mm');
      localDispatch(actions.setEndHour(end));
    }, 300);
  };

  const handleDateChange = (newDate) => {
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
    try {
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

      await axios.post(`${baseAppUrl}/api/pauses`, requestBody);
      onClose()
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(actions.setIsLoading(false));
    }
  };

  const handleDeletePause = async () => {
    localDispatch(actions.setIsDeleting(true));
    try {
      await axios.delete(`${baseAppUrl}/api/pauses/${id}`);
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(actions.setIsDeleting(false));
    }
  }

  const handleDateFieldClick = () => {
    localDispatch(actions.setShowDatePicker(true));
  };

  const handleCommentChange = (event) => {
    localDispatch(actions.setComment(event.target.value));
  };

  const handleHourChange = (event) => {
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
      placement='bottom'
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
      className={styles['add-pause-root']}
      title={`${textForKey('Add pause')}: ${doctor?.firstName} ${
        doctor?.lastName
      }`}
      onNegativeClick={handleDeletePause}
      isDestroyableLoading={isDeleting}
      isDestroyableDisabled={isDeleting || isLoading}
      isPositiveDisabled={!isFormValid() || isLoading}
      onDestroyClick={id != null && handleDeletePause}
      onPositiveClick={handleCreateSchedule}
      isPositiveLoading={isLoading}
    >
      <Form.Group className={styles['date-form-group']}>
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
            {availableStartTime.map((item) => (
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
            {availableEndTime.map((item) => (
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
            value={comment || ''}
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
  viewDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
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
