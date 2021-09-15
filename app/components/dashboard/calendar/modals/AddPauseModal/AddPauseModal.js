import React, { useEffect, useReducer, useRef } from 'react';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup'
import { toast } from 'react-toastify';

import { textForKey } from '../../../../../../utils/localization';
import EasyDatePicker from '../../../../../../components/common/EasyDatePicker';
import EasyPlanModal from '../../../../common/modals/EasyPlanModal';
import {
  createPauseRecord,
  deletePauseRecord,
  fetchPausesAvailableTime
} from "../../../../../../middleware/api/pauses";
import reducer, {
  initialState,
  setShowDatePicker,
  setAvailableAllTime,
  setComment,
  setEndHour,
  setIsFetchingHours,
  setPauseDate,
  setStartHour,
  setIsDeleting,
  setIsLoading,
} from './AddPauseModal.reducer';
import styles from './AddPauseModal.module.scss';
import areComponentPropsEqual from "../../../../../utils/areComponentPropsEqual";
import Box from "@material-ui/core/Box";
import EASModal from "../../../../common/modals/EASModal";

const AddPauseModal = (
  {
    open,
    viewDate,
    doctor,
    id,
    startTime,
    endTime,
    comment: defaultComment,
    onClose,
  }
) => {
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
    localDispatch(setStartHour(startHour));
    localDispatch(setEndHour(endHour));
  }, [startTime, endTime]);

  useEffect(() => {
    if (viewDate != null && typeof viewDate === 'object') {
      localDispatch(setPauseDate(viewDate.toDate()));
    }
  }, [viewDate]);

  useEffect(() => {
    localDispatch(setComment(defaultComment));
  }, [defaultComment]);

  const fetchPauseAvailableTime = async () => {
    localDispatch(setIsFetchingHours(true));
    try {
      const date = moment(pauseDate | viewDate).format('YYYY-MM-DD')
      const response = await fetchPausesAvailableTime(date, doctor.id);
      const { data: availableTime } = response;
      localDispatch(setAvailableAllTime(availableTime));
      updateEndTimeBasedOnService(availableTime);
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(setIsFetchingHours(false));
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
      localDispatch(setEndHour(end));
    }, 300);
  };

  const handleDateChange = (newDate) => {
    localDispatch(setPauseDate(newDate));
  };

  const handleCloseDatePicker = () => {
    localDispatch(setShowDatePicker(false));
  };

  const handleCreateSchedule = async () => {
    if (!isFormValid()) {
      return;
    }
    // toggle loading spinner
    localDispatch(setIsLoading(true));
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

      await createPauseRecord(requestBody);
      onClose()
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(setIsLoading(false));
    }
  };

  const handleDeletePause = async () => {
    localDispatch(setIsDeleting(true));
    try {
      await deletePauseRecord(id);
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(setIsDeleting(false));
    }
  }

  const handleDateFieldClick = () => {
    localDispatch(setShowDatePicker(true));
  };

  const handleCommentChange = (event) => {
    localDispatch(setComment(event.target.value));
  };

  const handleHourChange = (event) => {
    const targetId = event.target.id;
    switch (targetId) {
      case 'startTime':
        localDispatch(setStartHour(event.target.value));
        break;
      case 'endTime':
        localDispatch(setEndHour(event.target.value));
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
    <EASModal
      onClose={onClose}
      open={open}
      paperClass={styles.modalPaper}
      className={styles['add-pause-root']}
      title={`${textForKey('Add pause')}: ${doctor?.firstName} ${
        doctor?.lastName
      }`}
      onNegativeClick={handleDeletePause}
      isPositiveDisabled={!isFormValid() || isLoading || isDeleting}
      onDestroyClick={id != null && handleDeletePause}
      onPrimaryClick={handleCreateSchedule}
      isPositiveLoading={isLoading || isDeleting}
    >
      <Box display='flex' flexDirection='column' padding='16px'>
        <Form.Group className={styles['date-form-group']}>
          <Form.Label>{textForKey('Date')}</Form.Label>
          <Form.Control
            value={moment(pauseDate).format('DD MMMM YYYY')}
            ref={datePickerAnchor}
            readOnly
            onClick={handleDateFieldClick}
          />
        </Form.Group>
        <InputGroup className={styles.inputGroup}>
          <Form.Group controlId='startTime' className={styles.formGroup}>
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
          <Form.Group controlId='endTime' className={styles.formGroup}>
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
      </Box>
    </EASModal>
  );
};

export default React.memo(AddPauseModal, areComponentPropsEqual);

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
