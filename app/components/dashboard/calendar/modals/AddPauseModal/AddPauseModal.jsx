import React, { useEffect, useReducer, useRef } from 'react';
import { CircularProgress } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import EASSelect from 'app/components/common/EASSelect';
import EASTextarea from 'app/components/common/EASTextarea';
import EASTextField from 'app/components/common/EASTextField';
import EasyDatePicker from 'app/components/common/EasyDatePicker';
import EASModal from 'app/components/common/modals/EASModal';
import areComponentPropsEqual from 'app/utils/areComponentPropsEqual';
import { textForKey } from 'app/utils/localization';
import {
  createPauseRecord,
  deletePauseRecord,
  fetchPausesAvailableTime,
} from 'middleware/api/pauses';
import styles from './AddPauseModal.module.scss';
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
  resetState,
} from './AddPauseModal.reducer';

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
    if (!open) {
      localDispatch(resetState());
    }
  }, [open]);

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

  const getMappedTime = (hours) => {
    return hours.map((item) => ({
      id: item,
      name: item,
    }));
  };

  const fetchPauseAvailableTime = async () => {
    localDispatch(setIsFetchingHours(true));
    try {
      const date = moment(pauseDate | viewDate).format('YYYY-MM-DD');
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

  const handleCreateSchedule = async (event) => {
    event?.preventDefault();
    if (!isFormValid()) {
      return;
    }
    // toggle loading spinner
    localDispatch(setIsLoading(true));
    try {
      // build.yml request body
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
      onClose();
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
  };

  const handleDateFieldClick = () => {
    localDispatch(setShowDatePicker(true));
  };

  const handleCommentChange = (newValue) => {
    localDispatch(setComment(newValue));
  };

  const handleStartHourChange = (event) => {
    localDispatch(setStartHour(event.target.value));
  };

  const handleEndHourChange = (event) => {
    localDispatch(setEndHour(event.target.value));
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
        {isFetchingHours ? (
          <div className='progress-bar-wrapper'>
            <CircularProgress className='circular-progress-bar' />
          </div>
        ) : (
          <>
            <form onSubmit={handleCreateSchedule}>
              <EASTextField
                readOnly
                containerClass={styles.simpleField}
                ref={datePickerAnchor}
                fieldLabel={textForKey('Date')}
                value={moment(pauseDate).format('DD MMMM YYYY')}
                onPointerUp={handleDateFieldClick}
              />
              <div className={styles.timePickerContainer}>
                <EASSelect
                  id='startTime'
                  rootClass={styles.timeSelect}
                  label={textForKey('Start time')}
                  labelId='start-time-select'
                  onChange={handleStartHourChange}
                  value={startHour}
                  options={getMappedTime(availableStartTime)}
                  disabled={isFetchingHours || availableStartTime.length === 0}
                />
                <EASSelect
                  id='endTime'
                  rootClass={styles.timeSelect}
                  label={textForKey('Ent time')}
                  labelId='end-time-select'
                  onChange={handleEndHourChange}
                  value={endHour}
                  options={getMappedTime(availableEndTime)}
                  disabled={isFetchingHours || availableEndTime.length === 0}
                />
              </div>

              <EASTextarea
                fieldLabel={textForKey('Notes')}
                value={comment || ''}
                onChange={handleCommentChange}
              />
            </form>
            {datePicker}
          </>
        )}
      </Box>
    </EASModal>
  );
};

export default React.memo(AddPauseModal, areComponentPropsEqual);

AddPauseModal.propTypes = {
  open: PropTypes.bool,
  viewDate: PropTypes.any,
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
