import React, {
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import Box from '@material-ui/core/Box';
import { Alert } from '@material-ui/lab';
import orderBy from 'lodash/orderBy';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import EASAutocomplete from 'app/components/common/EASAutocomplete';
import EASSelect from 'app/components/common/EASSelect';
import EASTextarea from 'app/components/common/EASTextarea';
import EASTextField from 'app/components/common/EASTextField';
import EasyDatePicker from 'app/components/common/EasyDatePicker';
import NotificationsContext from 'app/context/notificationsContext';
import areComponentPropsEqual from 'app/utils/areComponentPropsEqual';
import { textForKey } from 'app/utils/localization';
import {
  createPauseRecord,
  deletePauseRecord,
  fetchPausesAvailableTime,
} from 'middleware/api/pauses';
import {
  activeClinicDoctorsSelector,
  clinicCabinetsSelector,
} from 'redux/selectors/appDataSelector';
import { pauseSelector } from 'redux/selectors/scheduleSelector';
import EASModal from '../../../../common/modals/EASModal';
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
  setDoctor,
  setCabinet,
  setInitialData,
  setHoursError,
  resetState,
} from './AddPauseModal.reducer';

const AddPauseModal = ({
  open,
  viewDate,
  doctor: initialDoctor,
  cabinet: initialCabinet,
  id,
  startTime,
  endTime,
  comment: defaultComment,
  onClose,
}) => {
  const toast = useContext(NotificationsContext);
  const datePickerAnchor = useRef(null);
  const clinicDoctors = useSelector(activeClinicDoctorsSelector);
  const clinicCabinets = useSelector(clinicCabinetsSelector);
  const pauseArr = useSelector(pauseSelector);
  const hasCabinets = clinicCabinets.length > 0;
  const [state, localDispatch] = useReducer(reducer, initialState);

  const {
    isLoading,
    showDatePicker,
    pauseDate,
    availableStartTime,
    availableEndTime,
    isFetchingHours,
    startHour,
    endHour,
    comment,
    doctor,
    cabinet,
    isDeleting,
    hoursError,
  } = state;

  const doctorPauses = useMemo(() => {
    let neededItem;
    if (initialCabinet !== null) {
      neededItem = pauseArr.find((item) => item.id === initialCabinet?.id);
    } else if (initialDoctor !== null) {
      neededItem = pauseArr.find((item) => item.id === initialDoctor?.id);
    }
    if (!neededItem) return [];
    let selectedDoctorsPauses = [];
    if (doctor !== null) {
      selectedDoctorsPauses = neededItem?.schedules?.filter(
        (schedule) => schedule.doctorId === doctor.id,
      );

      if (selectedDoctorsPauses?.length === 0) return [];
      return selectedDoctorsPauses.map((pause) => {
        const startTime = new Date(pause.startTime);
        const endTime = new Date(pause.endTime);

        const startTimeInMinutes =
          startTime.getHours() * 60 + startTime.getMinutes();
        const endTimeInMinutes = endTime.getHours() * 60 + endTime.getMinutes();

        return {
          ...pause,
          startTimeInMinutes,
          endTimeInMinutes,
        };
      });
    }
    return [];
  }, [doctor, cabinet]);

  const cabinets = useMemo(() => {
    const mappedCabinets = clinicCabinets.map((cabinet) => ({
      ...cabinet,
      label: cabinet.name,
    }));
    return orderBy(mappedCabinets, 'name', 'asc');
  }, [clinicCabinets]);

  const doctors = useMemo(() => {
    const mappedDoctors = clinicDoctors
      .filter((item) => {
        const isInCabinet = item.cabinets.some((cab) => cab.id === cabinet?.id);
        return cabinet == null || isInCabinet;
      })
      .map((item) => {
        const { phoneNumber, fullName } = item;
        const name = phoneNumber ? `${fullName} ${phoneNumber}` : fullName;
        return {
          ...item,
          name: name,
          label: item.fullName,
        };
      });
    return orderBy(mappedDoctors, 'name', 'asc');
  }, [clinicDoctors, cabinet]);

  useEffect(() => {
    if (!open) {
      localDispatch(resetState());
    }
  }, [open]);

  useEffect(() => {
    localDispatch(
      setInitialData({ cabinet: initialCabinet, doctor: initialDoctor }),
    );
  }, [initialCabinet, initialDoctor]);

  useEffect(() => {
    if (doctor != null) {
      fetchPauseAvailableTime();
    }
  }, [pauseDate, doctor]);

  useEffect(() => {
    if (startTime == null || endTime == null) {
      return;
    }
    const startHourInEffect = moment(startTime).format('HH:mm');
    const endHourInEffect = moment(endTime).format('HH:mm');
    localDispatch(setStartHour(startHourInEffect));
    localDispatch(setEndHour(endHourInEffect));
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
      const date = moment(pauseDate ?? viewDate).format('YYYY-MM-DD');
      const response = await fetchPausesAvailableTime(date, doctor.id);
      const { data: availableTime } = response;
      let filteredAvailableTime;
      if (doctorPauses.some((pause) => pause.doctorId === doctor.id)) {
        filteredAvailableTime = availableTime.filter((time) => {
          const [hours, minutes] = time.split(':');
          const timeInMinutes = parseInt(hours) * 60 + parseInt(minutes);
          for (const doctorPause of doctorPauses) {
            if (
              timeInMinutes > doctorPause.startTimeInMinutes &&
              timeInMinutes < doctorPause.endTimeInMinutes
            ) {
              return false;
            }
            return true;
          }
        });
      } else {
        filteredAvailableTime = availableTime;
      }
      localDispatch(setAvailableAllTime(filteredAvailableTime));
      updateEndTimeBasedOnService(filteredAvailableTime);
    } catch (error) {
      if (error.response != null) {
        const { data } = error.response;
        localDispatch(setHoursError(data.message || error.message));
      } else {
        localDispatch(setHoursError(error.message));
      }
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
        cabinetId: cabinet?.id,
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

  const handleDoctorChange = (event, selectedDoctor) => {
    localDispatch(setDoctor(selectedDoctor));
  };

  const handleCabinetChange = (event, selectedCabinet) => {
    localDispatch(setCabinet(selectedCabinet));
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
      title={id === null ? textForKey('Add pause') : textForKey('edit_pause')}
      onNegativeClick={handleDeletePause}
      primaryBtnText={textForKey('Save')}
      secondaryBtnText={textForKey('Close')}
      isPositiveDisabled={!isFormValid() || isLoading || isDeleting}
      onDestroyClick={id != null && handleDeletePause}
      onPrimaryClick={handleCreateSchedule}
      isPositiveLoading={isLoading || isDeleting || isFetchingHours}
    >
      <Box display='flex' flexDirection='column' padding='16px'>
        <form onSubmit={handleCreateSchedule}>
          {hasCabinets && (
            <EASAutocomplete
              filterLocally
              options={cabinets}
              value={cabinet}
              fieldLabel={textForKey('add_appointment_cabinet')}
              placeholder={textForKey('type_to_search')}
              onChange={handleCabinetChange}
            />
          )}
          <EASAutocomplete
            filterLocally
            containerClass={styles.simpleField}
            options={doctors}
            value={doctor}
            fieldLabel={textForKey('Doctor')}
            placeholder={textForKey('Enter doctor name or phone')}
            onChange={handleDoctorChange}
          />
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
              label={textForKey('End time')}
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
        {hoursError && (
          <Alert severity='warning' style={{ width: '100%', marginTop: 16 }}>
            {hoursError}
          </Alert>
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
  startTime: PropTypes.string,
  endTime: PropTypes.string,
  comment: PropTypes.string,
};

AddPauseModal.defaultProps = {
  open: false,
  onClose: () => null,
};
