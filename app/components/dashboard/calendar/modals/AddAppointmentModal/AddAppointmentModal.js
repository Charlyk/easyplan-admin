import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import { Typography } from '@material-ui/core';
import clsx from 'clsx';
import debounce from 'lodash/debounce';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';
import {
  AsyncTypeahead,
  Menu,
  MenuItem,
  Typeahead,
} from 'react-bootstrap-typeahead';
import PhoneInput from 'react-phone-input-2';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import IconAvatar from '../../../../../../components/icons/iconAvatar';
import { toggleAppointmentsUpdate } from '../../../../../../redux/actions/actions';
import { EmailRegex, Role } from '../../../../../utils/constants';
import { urlToLambda } from '../../../../../../utils/helperFuncs';
import { textForKey } from '../../../../../../utils/localization';
import EasyDatePicker from '../../../../../../components/common/EasyDatePicker';
import EasyPlanModal from '../../../../common/modals/EasyPlanModal';
import {
  getAvailableHours,
  getScheduleDetails,
  postSchedule
} from "../../../../../../middleware/api/schedules";
import { getPatients } from "../../../../../../middleware/api/patients";
import { reducer, initialState, actions } from "./AddAppointmentModal.reducer";
import styles from './AddAppointment.module.scss';

const AddAppointmentModal = (
  {
    open,
    currentClinic,
    doctor: selectedDoctor,
    patient: selectedPatient,
    startHour: selectedStartTime,
    endHour: selectedEndTime,
    date,
    schedule,
    onClose,
  }
) => {
  const dispatch = useDispatch();
  const birthdayPickerAnchor = useRef(null);
  const datePickerAnchor = useRef(null);
  const doctors = currentClinic.users.filter((item) => item.roleInClinic === Role.doctor && !item.isHidden);
  const [
    {
      patient,
      patients,
      doctor,
      service,
      loading,
      scheduleId,
      patientLastName,
      patientFirstName,
      patientPhoneNumber,
      patientBirthday,
      patientEmail,
      isPhoneValid,
      isNewPatient,
      appointmentDate,
      appointmentNote,
      appointmentStatus,
      showDatePicker,
      showBirthdayPicker,
      isFetchingHours,
      isPatientValid,
      isDoctorValid,
      isServiceValid,
      isCreatingSchedule,
      isUrgent,
      startTime,
      endTime,
      availableStartTime,
      availableEndTime,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    if (schedule != null) {
      fetchScheduleDetails();
    }
  }, [schedule]);

  useEffect(() => {
    if (!open) {
      localDispatch(actions.resetState());
    }
  }, [open]);

  useEffect(() => {
    if (selectedDoctor != null) {
      localDispatch(
        actions.setDoctor({
          ...selectedDoctor,
          fullName: `${selectedDoctor.firstName} ${selectedDoctor.lastName}`,
        }),
      );
    }

    if (date != null) {
      localDispatch(actions.setAppointmentDate(date));
    }

    if (selectedPatient != null) {
      localDispatch(
        actions.setPatient({
          ...selectedPatient,
          fullName: getLabelKey(selectedPatient),
        }),
      );
    }
  }, [selectedDoctor, date, selectedPatient]);

  useEffect(() => {
    fetchAvailableHours();
  }, [doctor, service, appointmentDate]);

  useEffect(() => {
    if (schedule == null) {
      localDispatch(actions.setStartTime(selectedStartTime || ''));
      localDispatch(actions.setEndTime(selectedEndTime || ''));
    }
  }, [selectedStartTime, selectedEndTime]);

  const fetchScheduleDetails = async () => {
    if (schedule == null) {
      return;
    }
    try {
      const response = await getScheduleDetails(schedule.id);
      const { data: scheduleDetails } = response;
      localDispatch(
        actions.setSchedule({
          ...scheduleDetails,
          doctor: doctors.find((it) => it.id === scheduleDetails.doctor.id),
        }),
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchAvailableHours = async () => {
    if (doctor == null || service == null || appointmentDate == null) {
      return;
    }
    localDispatch(actions.setIsFetchingHours(true));
    try {
      const query = {
        doctorId: doctor.id,
        serviceId: service.serviceId || service.id,
        date: moment(appointmentDate).format('YYYY-MM-DD'),
      };
      if (schedule != null) {
        query.scheduleId = schedule.id;
      }
      const response = await getAvailableHours(query);
      const { data: availableTime } = response;
      localDispatch(actions.setAvailableTime(availableTime));
      updateEndTimeBasedOnService(availableTime);
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(actions.setIsFetchingHours(false));
    }
  };

  const updateEndTimeBasedOnService = (availableTime) => {
    if (schedule != null) {
      return;
    }
    setTimeout(() => {
      const start =
        availableTime.length > 0 && startTime.length === 0
          ? availableTime[0]
          : startTime;
      const [h, m] = start.split(':');
      const end = moment(appointmentDate)
        .set({
          hour: parseInt(h),
          minute: parseInt(m),
          second: 0,
        })
        .add(service.duration, 'minutes')
        .format('HH:mm');
      localDispatch(actions.setEndTime(end));
    }, 300);
  };

  const handlePatientChange = (selectedPatients) => {
    if (selectedPatients.length > 0) {
      if (selectedPatients[0].customOption) {
        const { fullName } = selectedPatients[0];
        localDispatch(
          actions.setIsPatientValid(fullName.replace('+373', '').length === 8),
        );
      } else {
        localDispatch(actions.setPatient(selectedPatients[0]));
      }
    } else {
      localDispatch(actions.setPatient(null));
    }
  };

  const handleDoctorChange = (selectedDoctors) => {
    if (selectedDoctors.length > 0) {
      localDispatch(actions.setDoctor(selectedDoctors[0]));
    } else {
      localDispatch(actions.setDoctor(null));
    }
  };

  const handleServiceChange = (selectedServices) => {
    if (selectedServices.length > 0) {
      localDispatch(actions.setService(selectedServices[0]));
    } else {
      localDispatch(actions.setService(null));
    }
  };

  const getLabelKey = (option) => {
    return option.firstName || option.lastName
      ? `${option.lastName} ${option.firstName}`
      : option.phoneNumber;
  };

  const handlePatientSearch = useCallback(
    debounce(async (query) => {
      localDispatch(actions.setPatientsLoading(true));
      try {
        const updatedQuery = query.replace('+', '');
        const requestQuery = { query: updatedQuery, page: '0', rowsPerPage: '10', short: '1' };
        const { data: response } = await getPatients(requestQuery);
        const patients = response.data.map((item) => ({
          ...item,
          fullName: getLabelKey(item),
        }));
        localDispatch(actions.setPatients(patients));
      } catch (error) {
        toast.error(error.message);
      } finally {
        localDispatch(actions.setPatientsLoading(false));
      }
    }, 500),
    [],
  );

  const handleSearchQueryChange = (query) => {
    localDispatch(actions.setPatientsLoading(true));
    handlePatientSearch(query);
  };

  const handleDateFieldClick = () => {
    localDispatch(actions.setShowDatePicker(true));
  };

  const handleCloseDatePicker = () => {
    localDispatch(actions.setShowDatePicker(false));
  };

  const handleDateChange = (newDate) => {
    localDispatch(actions.setAppointmentDate(newDate));
  };

  const handleBirthdayChange = (newDate) => {
    localDispatch(actions.setPatientBirthday(newDate));
  };

  const handleEmailChange = (event) => {
    const newValue = event.target.value;
    localDispatch(actions.setPatientEmail(newValue));
  };

  const handleCloseBirthdayPicker = () => {
    localDispatch(actions.setShowBirthdayPicker(false));
  };

  const handleOpenBirthdayPicker = () => {
    localDispatch(actions.setShowBirthdayPicker(true));
  };

  const handleHourChange = (event) => {
    const targetId = event.target.id;
    switch (targetId) {
      case 'startTime':
        localDispatch(actions.setStartTime(event.target.value));
        break;
      case 'endTime':
        localDispatch(actions.setEndTime(event.target.value));
        break;
    }
  };

  const handleNoteChange = (event) => {
    localDispatch(actions.setAppointmentNote(event.target.value));
  };

  const handleIsUrgentChange = () => {
    localDispatch(actions.setIsUrgent(!isUrgent));
  };

  const changePatientMode = () => {
    const isNew = !isNewPatient;
    localDispatch(actions.setIsNewPatient(isNew));
    if (isNew) {
      localDispatch(actions.setPatient(null));
      localDispatch(actions.setIsPatientValid(false));
    }
  };

  const handlePatientNameChange = (event) => {
    const newValue = event.target.value;
    switch (event.target.id) {
      case 'patientFirstName':
        localDispatch(actions.setPatientFirstName(newValue));
        break;
      case 'patientLastName':
        localDispatch(actions.setPatientLastName(newValue));
        break;
    }
  };

  const isFormValid = () => {
    return (
      isDoctorValid &&
      (isNewPatient || isPatientValid) &&
      isServiceValid &&
      startTime?.length > 0 &&
      endTime?.length > 0 &&
      (!isNewPatient || isPhoneValid)
    );
  };

  const handleCreateSchedule = async () => {
    if (!isFormValid()) {
      return;
    }
    localDispatch(actions.setIsCreatingSchedule(true));
    try {
      // set start date
      const [startHour, startMinute] = startTime.split(':');
      const startDate = moment(appointmentDate);
      startDate.set({ hour: parseInt(startHour), minute: parseInt(startMinute) });

      // set end date
      const [endHour, endMinute] = endTime.split(':');
      const endDate = moment(appointmentDate);
      endDate.set({ hour: parseInt(endHour), minute: parseInt(endMinute) });

      // build request body
      const requestBody = {
        patientFirstName,
        patientLastName,
        patientPhoneNumber,
        patientBirthday,
        patientEmail,
        isUrgent,
        patientId: patient?.id,
        doctorId: doctor.id,
        serviceId: service.serviceId || service.id,
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
        note: appointmentNote,
        status: appointmentStatus,
        scheduleId: scheduleId,
      };

      await postSchedule(requestBody);
      onClose();
      dispatch(toggleAppointmentsUpdate());
    } catch (error) {
      toast.error(error.messages);
    } finally {
      localDispatch(actions.setIsCreatingSchedule(false));
    }
  };

  const handlePhoneChange = (value, data, event) => {
    localDispatch(
      actions.setPatientPhoneNumber({
        phoneNumber: `+${value}`,
        isPhoneValid: !event.target?.classList.value.includes('invalid-number'),
      }),
    );
  };

  const filterByCallback = () => true;

  const datePicker = (
    <EasyDatePicker
      minDate={new Date()}
      open={Boolean(showDatePicker)}
      pickerAnchor={datePickerAnchor.current}
      onChange={handleDateChange}
      selectedDate={appointmentDate}
      onClose={handleCloseDatePicker}
    />
  );

  const birthdayPicker = (
    <EasyDatePicker
      open={Boolean(showBirthdayPicker)}
      pickerAnchor={birthdayPickerAnchor.current}
      onChange={handleBirthdayChange}
      onClose={handleCloseBirthdayPicker}
      selectedDate={patientBirthday || new Date()}
    />
  );

  const isLoading = isFetchingHours || isCreatingSchedule;

  const isFinished =
    isLoading ||
    appointmentStatus === 'CompletedNotPaid' ||
    appointmentStatus === 'CompletedPaid' ||
    appointmentStatus === 'PartialPaid' ||
    appointmentStatus === 'CompletedFree';

  return (
    <EasyPlanModal
      onClose={onClose}
      open={open}
      className={styles['add-appointment-root']}
      title={
        schedule == null
          ? textForKey('Add appointment')
          : textForKey('Edit appointment')
      }
      isPositiveDisabled={!isFormValid() || isLoading}
      onPositiveClick={handleCreateSchedule}
      isPositiveLoading={isLoading}
    >
      {isNewPatient && (
        <Form.Group>
          <Form.Label>{textForKey('Patient name')}</Form.Label>
          <div className={styles['first-and-last-name']}>
            <Form.Control
              id='patientLastName'
              value={patientLastName}
              onChange={handlePatientNameChange}
              placeholder={textForKey('Last name')}
            />
            <Form.Control
              id='patientFirstName'
              value={patientFirstName}
              onChange={handlePatientNameChange}
              placeholder={textForKey('First name')}
            />
          </div>
        </Form.Group>
      )}
      {isNewPatient && (
        <Form.Group controlId='phoneNumber'>
          <Form.Label>{textForKey('Phone number')}</Form.Label>
          <InputGroup>
            <PhoneInput
              onChange={handlePhoneChange}
              value={patientPhoneNumber}
              alwaysDefaultMask
              countryCodeEditable={false}
              country='md'
              placeholder='079123456'
              isValid={(inputNumber, country) => {
                const phoneNumber = inputNumber.replace(
                  `${country.dialCode}`,
                  '',
                );
                return phoneNumber.length === 0 || phoneNumber.length === 8;
              }}
            />
          </InputGroup>
        </Form.Group>
      )}
      {isNewPatient && (
        <Form.Group controlId='email'>
          <Form.Label>{textForKey('Email')}</Form.Label>
          <InputGroup>
            <Form.Control
              value={patientEmail}
              isInvalid={
                patientEmail.length > 0 && !patientEmail.match(EmailRegex)
              }
              type='email'
              onChange={handleEmailChange}
            />
          </InputGroup>
        </Form.Group>
      )}
      {isNewPatient && (
        <Form.Group ref={birthdayPickerAnchor}>
          <Form.Label>{textForKey('Birthday')}</Form.Label>
          <Form.Control
            value={
              patientBirthday
                ? moment(patientBirthday).format('DD MMM YYYY')
                : ''
            }
            readOnly
            onClick={handleOpenBirthdayPicker}
          />
        </Form.Group>
      )}
      {!isNewPatient && (
        <Form.Group controlId='patient'>
          <Form.Label>{textForKey('Patient')}</Form.Label>
          <AsyncTypeahead
            disabled={isFinished}
            isValid={isPatientValid}
            placeholder={textForKey('Enter patient name or phone')}
            id='patients'
            emptyLabel={`${textForKey('No results')}...`}
            searchText={`${textForKey('Searching')}...`}
            isLoading={loading.patients}
            filterBy={filterByCallback}
            minLength={2}
            labelKey='fullName'
            onSearch={handleSearchQueryChange}
            options={patients}
            selected={patient ? [patient] : []}
            onChange={handlePatientChange}
            renderMenuItemChildren={(option) => (
              <div className={styles['patient-result-item']} id={option.id}>
                <div className={styles['patient-avatar-wrapper']}>
                  {option.photo == null ? (
                    <IconAvatar/>
                  ) : (
                    <img
                      src={urlToLambda(option.photo, 40)}
                      alt={option.fullName}
                    />
                  )}
                </div>
                <div className={styles['patient-info-wrapper']}>
                  <Typography classes={{ root: styles['patient-name'] }}>
                    {option.fullName}
                  </Typography>
                  <Typography classes={{ root: styles['patient-phone'] }}>
                    {option.phoneNumber}
                  </Typography>
                </div>
              </div>
            )}
          />
        </Form.Group>
      )}
      <div
        className={clsx(styles['patient-mode-button'], { [styles.disabled]: isFinished })}
        role='button'
        tabIndex={0}
        onClick={changePatientMode}
      >
        <span>
          {textForKey(isNewPatient ? 'Existent patient' : 'New patient')}?
        </span>
      </div>
      <Form.Group controlId='doctor'>
        <Form.Label>{textForKey('Doctor')}</Form.Label>
        <Typeahead
          disabled={isFinished}
          isValid={isDoctorValid}
          placeholder={textForKey('Enter doctor name or phone')}
          id='doctors'
          emptyLabel={textForKey('No results...')}
          searchText={textForKey('Searching...')}
          filterBy={['firstName', 'lastName']}
          labelKey='fullName'
          options={doctors.filter((item) => !item.isInVacation)}
          selected={doctor ? [doctor] : []}
          onChange={handleDoctorChange}
          renderMenu={(results, menuProps) => {
            return (
              <Menu {...menuProps}>
                {results.map((result, index) => (
                  <MenuItem key={result.id} option={result} position={index}>
                    <Typography classes={{ root: styles['result-item-text'] }}>
                      {result.fullName}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            );
          }}
        />
      </Form.Group>
      <Form.Group controlId='service'>
        <Form.Label>{textForKey('Service')}</Form.Label>
        <Typeahead
          disabled={isFinished}
          isValid={isServiceValid}
          placeholder={textForKey('Enter service name')}
          id='doctors'
          emptyLabel={`${textForKey('No results')}`}
          searchText={`${textForKey('Searching')}...`}
          filterBy={['name']}
          labelKey='name'
          options={doctor?.services || []}
          selected={service ? [service] : []}
          onChange={handleServiceChange}
          renderMenu={(results, menuProps) => {
            return (
              <Menu {...menuProps}>
                {results.map((result, index) => (
                  <MenuItem key={result.id} option={result} position={index}>
                    <Typography classes={{ root: styles['result-item-text'] }}>
                      {result.name}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            );
          }}
        />
      </Form.Group>
      <Form.Group className={styles['date-form-group']}>
        <Form.Label>{textForKey('Date')}</Form.Label>
        <Form.Control
          disabled={isFinished}
          value={moment(appointmentDate).format('DD MMMM YYYY')}
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
            value={startTime}
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
            value={endTime}
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
      <Form.Group controlId='isUrgent'>
        <Form.Check
          onChange={handleIsUrgentChange}
          type='checkbox'
          checked={isUrgent}
          label={textForKey('Is urgent')}
        />
      </Form.Group>
      <Form.Group controlId='description'>
        <Form.Label>{textForKey('Notes')}</Form.Label>
        <InputGroup>
          <Form.Control
            as='textarea'
            value={appointmentNote}
            onChange={handleNoteChange}
            aria-label='With textarea'
          />
        </InputGroup>
      </Form.Group>
      {datePicker}
      {birthdayPicker}
    </EasyPlanModal>
  );
};

export default AddAppointmentModal;

AddAppointmentModal.propTypes = {
  open: PropTypes.bool,
  date: PropTypes.instanceOf(Date),
  doctor: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  patient: PropTypes.object,
  startHour: PropTypes.string,
  endHour: PropTypes.string,
  schedule: PropTypes.shape({
    id: PropTypes.number,
    patientId: PropTypes.number,
    patientName: PropTypes.string,
    patientPhone: PropTypes.string,
    doctorId: PropTypes.number,
    doctorName: PropTypes.string,
    serviceId: PropTypes.number,
    serviceName: PropTypes.string,
    serviceColor: PropTypes.string,
    serviceDuration: PropTypes.string,
    dateAndTime: PropTypes.string,
    isUrgent: PropTypes.string,
    status: PropTypes.string,
    note: PropTypes.string,
  }),
};
