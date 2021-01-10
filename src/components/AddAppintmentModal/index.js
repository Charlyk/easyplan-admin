import React, { useEffect, useReducer, useRef } from 'react';

import { Typography } from '@material-ui/core';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import PhoneInput from 'react-phone-input-2';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import IconAvatar from '../../assets/icons/iconAvatar';
import { toggleAppointmentsUpdate } from '../../redux/actions/actions';
import dataAPI from '../../utils/api/dataAPI';
import { Action, EmailRegex, ManualStatuses } from '../../utils/constants';
import { logUserAction, urlToLambda } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import EasyDatePicker from '../EasyDatePicker';
import EasyPlanModal from '../EasyPlanModal/EasyPlanModal';
import './styles.scss';

const initialState = {
  patient: null,
  patients: [],
  doctor: null,
  doctors: [],
  service: null,
  services: [],
  hours: [],
  isNewPatient: false,
  patientFirstName: '',
  patientLastName: '',
  patientPhoneNumber: '',
  patientBirthday: null,
  patientEmail: '',
  isFetchingHours: false,
  isCreatingSchedule: false,
  isPatientValid: false,
  isDoctorValid: false,
  isServiceValid: false,
  showDatePicker: false,
  appointmentDate: new Date(),
  scheduleId: null,
  appointmentHour: '',
  appointmentNote: '',
  appointmentStatus: 'Pending',
  isUrgent: false,
  loading: { patients: false, services: false, doctors: false },
};

const reducerTypes = {
  patient: 'patient',
  patients: 'patients',
  doctor: 'doctor',
  doctors: 'doctors',
  service: 'service',
  services: 'services',
  setHours: 'setHours',
  setPatientFirstName: 'setPatientFirstName',
  setPatientLastName: 'setPatientLastName',
  setPatientPhoneNumber: 'setPatientPhoneNumber',
  isPhoneValid: false,
  setIsNewPatient: 'setIsNewPatient',
  patientsLoading: 'patientsLoading',
  servicesLoading: 'servicesLoading',
  doctorsLoading: 'doctorsLoading',
  isPatientValid: 'isPatientValid',
  isDoctorValid: 'isDoctorValid',
  isServiceValid: 'isServiceValid',
  setIsFetchingHours: 'setIsFetchingHours',
  setShowDatePicker: 'setShowDatePicker',
  setShowBirthdayPicker: 'setShowBirthdayPicker',
  setAppointmentDate: 'setAppointmentDate',
  setAppointmentHour: 'setAppointmentHour',
  setAppointmentNote: 'setAppointmentNote',
  setAppointmentStatus: 'setAppointmentStatus',
  setIsCreatingSchedule: 'setIsCreatingSchedule',
  setSchedule: 'setSchedule',
  reset: 'reset',
  setPatientBirthday: 'setPatientBirthday',
  setPatientEmail: 'setPatientEmail',
  setIsUrgent: 'setIsUrgent',
};

const reducerActions = {
  setPatient: payload => ({ type: reducerTypes.patient, payload }),
  setPatients: payload => ({ type: reducerTypes.patients, payload }),
  setDoctor: payload => ({ type: reducerTypes.doctor, payload }),
  setDoctors: payload => ({ type: reducerTypes.doctors, payload }),
  setService: payload => ({ type: reducerTypes.service, payload }),
  setServices: payload => ({ type: reducerTypes.services, payload }),
  setHours: payload => ({ type: reducerTypes.setHours, payload }),
  setIsDoctorValid: payload => ({ type: reducerTypes.isDoctorValid, payload }),
  setIsUrgent: payload => ({ type: reducerTypes.setIsUrgent, payload }),
  setIsFetchingHours: payload => ({
    type: reducerTypes.setIsFetchingHours,
    payload,
  }),
  setAppointmentDate: payload => ({
    type: reducerTypes.setAppointmentDate,
    payload,
  }),
  setIsServiceValid: payload => ({
    type: reducerTypes.isServiceValid,
    payload,
  }),
  setIsPatientValid: payload => ({
    type: reducerTypes.isPatientValid,
    payload,
  }),
  setPatientsLoading: payload => ({
    type: reducerTypes.patientsLoading,
    payload,
  }),
  setServicesLoading: payload => ({
    type: reducerTypes.servicesLoading,
    payload,
  }),
  setDoctorsLoading: payload => ({
    type: reducerTypes.doctorsLoading,
    payload,
  }),
  setShowDatePicker: payload => ({
    type: reducerTypes.setShowDatePicker,
    payload,
  }),
  setAppointmentNote: payload => ({
    type: reducerTypes.setAppointmentNote,
    payload,
  }),
  setAppointmentHour: payload => ({
    type: reducerTypes.setAppointmentHour,
    payload,
  }),
  setIsCreatingSchedule: payload => ({
    type: reducerTypes.setIsCreatingSchedule,
    payload,
  }),
  setSchedule: payload => ({ type: reducerTypes.setSchedule, payload }),
  setAppointmentStatus: payload => ({
    type: reducerTypes.setAppointmentStatus,
    payload,
  }),
  resetState: () => ({ type: reducerTypes.reset }),
  setIsNewPatient: payload => ({ type: reducerTypes.setIsNewPatient, payload }),
  setPatientFirstName: payload => ({
    type: reducerTypes.setPatientFirstName,
    payload,
  }),
  setPatientLastName: payload => ({
    type: reducerTypes.setPatientLastName,
    payload,
  }),
  setPatientBirthday: payload => ({
    type: reducerTypes.setPatientBirthday,
    payload,
  }),
  setPatientEmail: payload => ({ type: reducerTypes.setPatientEmail, payload }),
  /**
   * Update patient phone
   * @param {{phoneNumber: string, isPhoneValid: boolean}} payload
   * @return {{payload: *, type: string}}
   */
  setPatientPhoneNumber: payload => ({
    type: reducerTypes.setPatientPhoneNumber,
    payload,
  }),
  setShowBirthdayPicker: payload => ({
    type: reducerTypes.setShowBirthdayPicker,
    payload,
  }),
};

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.patient:
      return { ...state, patient: action.payload };
    case reducerTypes.services:
      return { ...state, services: action.payload };
    case reducerTypes.doctor:
      return { ...state, doctor: action.payload };
    case reducerTypes.doctors:
      return { ...state, doctors: action.payload };
    case reducerTypes.patients:
      return { ...state, patients: action.payload };
    case reducerTypes.isPatientValid:
      return { ...state, isPatientValid: action.payload };
    case reducerTypes.setIsUrgent:
      return { ...state, isUrgent: action.payload };
    case reducerTypes.doctorsLoading:
      return {
        ...state,
        loading: { ...state.loading, doctors: action.payload },
      };
    case reducerTypes.servicesLoading:
      return {
        ...state,
        loading: { ...state.loading, services: action.payload },
      };
    case reducerTypes.patientsLoading:
      return {
        ...state,
        loading: { ...state.loading, patients: action.payload },
      };
    case reducerTypes.isDoctorValid:
      return { ...state, isDoctorValid: action.payload };
    case reducerTypes.service:
      return { ...state, service: action.payload };
    case reducerTypes.isServiceValid:
      return { ...state, isServiceValid: action.payload };
    case reducerTypes.setShowDatePicker:
      return { ...state, showDatePicker: action.payload };
    case reducerTypes.setAppointmentDate:
      return {
        ...state,
        appointmentDate: action.payload,
        showDatePicker: false,
      };
    case reducerTypes.setHours:
      return { ...state, hours: action.payload };
    case reducerTypes.setIsFetchingHours:
      return { ...state, isFetchingHours: action.payload };
    case reducerTypes.setAppointmentHour:
      return { ...state, appointmentHour: action.payload };
    case reducerTypes.setAppointmentNote:
      return { ...state, appointmentNote: action.payload };
    case reducerTypes.setAppointmentStatus:
      return { ...state, appointmentStatus: action.payload };
    case reducerTypes.setIsCreatingSchedule:
      return { ...state, isCreatingSchedule: action.payload };
    case reducerTypes.setSchedule: {
      const schedule = action.payload;
      const scheduleDate = moment(schedule.startTime);
      return {
        ...state,
        scheduleId: schedule.id,
        patient: schedule.patient,
        doctor: schedule.doctor,
        service: schedule.service,
        appointmentNote: schedule.noteText,
        appointmentDate: scheduleDate.toDate(),
        appointmentHour: scheduleDate.format('HH:mm'),
        appointmentStatus: schedule.scheduleStatus,
        isPatientValid: true,
        isDoctorValid: true,
        isServiceValid: true,
      };
    }
    case reducerTypes.setIsNewPatient: {
      const isNewPatient = action.payload;
      return {
        ...state,
        isNewPatient,
        patientBirthday: null,
        patientEmail: '',
        patientFirstName: '',
        patientLastName: '',
        patientPhoneNumber: '',
      };
    }
    case reducerTypes.setPatientFirstName:
      return { ...state, patientFirstName: action.payload };
    case reducerTypes.setPatientLastName:
      return { ...state, patientLastName: action.payload };
    case reducerTypes.setPatientPhoneNumber:
      return {
        ...state,
        patientPhoneNumber: action.payload.phoneNumber,
        isPhoneValid: action.payload.isPhoneValid,
      };
    case reducerTypes.setPatientBirthday:
      return {
        ...state,
        patientBirthday: action.payload,
        showBirthdayPicker: false,
      };
    case reducerTypes.setPatientEmail:
      return {
        ...state,
        patientEmail: action.payload,
      };
    case reducerTypes.setShowBirthdayPicker:
      return {
        ...state,
        showBirthdayPicker: action.payload,
      };
    case reducerTypes.reset:
      return initialState;
  }
};

const AddAppointmentModal = ({
  open,
  doctor: selectedDoctor,
  patient: selectedPatient,
  date,
  schedule,
  onClose,
}) => {
  const dispatch = useDispatch();
  const birthdayPickerAnchor = useRef(null);
  const datePickerAnchor = useRef(null);
  const [
    {
      patient,
      patients,
      doctor,
      doctors,
      service,
      services,
      loading,
      hours,
      scheduleId,
      patientLastName,
      patientFirstName,
      patientPhoneNumber,
      patientBirthday,
      patientEmail,
      isPhoneValid,
      isNewPatient,
      appointmentDate,
      appointmentHour,
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
    },
    localDispatch,
  ] = useReducer(reducer, { ...initialState });

  useEffect(() => {
    if (schedule != null) {
      fetchScheduleDetails();
    }
  }, [schedule]);

  useEffect(() => {
    if (!open) {
      localDispatch(reducerActions.resetState());
    }
  }, [open]);

  useEffect(() => {
    if (selectedDoctor != null) {
      localDispatch(
        reducerActions.setDoctor({
          ...selectedDoctor,
          fullName: `${selectedDoctor.firstName} ${selectedDoctor.lastName}`,
        }),
      );
      localDispatch(reducerActions.setIsDoctorValid(true));
    }

    if (date != null) {
      localDispatch(reducerActions.setAppointmentDate(date));
    }

    if (selectedPatient != null) {
      localDispatch(
        reducerActions.setPatient({
          ...selectedPatient,
          fullName: getLabelKey(selectedPatient),
        }),
      );
      localDispatch(reducerActions.setIsPatientValid(true));
    }
  }, [selectedDoctor, date, selectedPatient]);

  useEffect(() => {
    fetchAvailableHours();
  }, [doctor, schedule, service, appointmentDate]);

  const fetchScheduleDetails = async () => {
    if (schedule == null) {
      return;
    }
    const response = await dataAPI.fetchScheduleDetails(schedule.id);
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      localDispatch(reducerActions.setSchedule(response.data));
    }
  };

  const fetchAvailableHours = async () => {
    if (doctor == null || service == null || appointmentDate == null) {
      return;
    }
    localDispatch(reducerActions.setIsFetchingHours(true));
    const response = await dataAPI.fetchAvailableTime(
      scheduleId,
      doctor.id,
      service.id,
      appointmentDate,
    );
    if (response.isError) {
      console.log(response.message);
    } else {
      localDispatch(reducerActions.setHours(response.data));
      if (response.data.length > 0 && schedule == null) {
        localDispatch(reducerActions.setAppointmentHour(response.data[0]));
      } else if (schedule == null) {
        localDispatch(reducerActions.setAppointmentHour(''));
      }
    }
    localDispatch(reducerActions.setIsFetchingHours(false));
  };

  const handlePatientChange = selectedPatients => {
    if (selectedPatients.length > 0) {
      if (selectedPatients[0].customOption) {
        const { fullName } = selectedPatients[0];
        localDispatch(
          reducerActions.setIsPatientValid(
            fullName.replace('+373', '').length === 8,
          ),
        );
      } else {
        localDispatch(reducerActions.setPatient(selectedPatients[0]));
        localDispatch(reducerActions.setIsPatientValid(true));
      }
    } else {
      localDispatch(reducerActions.setPatient(null));
      localDispatch(reducerActions.setIsPatientValid(false));
    }
  };

  const handleDoctorChange = selectedDoctors => {
    if (selectedDoctors.length > 0) {
      localDispatch(reducerActions.setDoctor(selectedDoctors[0]));
      localDispatch(reducerActions.setIsDoctorValid(true));
    } else {
      localDispatch(reducerActions.setDoctor(null));
      localDispatch(reducerActions.setIsDoctorValid(false));
    }
  };

  const handleServiceChange = selectedServices => {
    if (selectedServices.length > 0) {
      localDispatch(reducerActions.setService(selectedServices[0]));
      localDispatch(reducerActions.setIsServiceValid(true));
    } else {
      localDispatch(reducerActions.setService(null));
      localDispatch(reducerActions.setIsServiceValid(false));
    }
  };

  const getLabelKey = option => {
    return option.firstName || option.lastName
      ? `${option.firstName} ${option.lastName}`
      : option.phoneNumber;
  };

  const handlePatientSearch = async query => {
    localDispatch(reducerActions.setPatientsLoading(true));
    const response = await dataAPI.searchPatients(query);
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      const patients = response.data.map(item => ({
        ...item,
        fullName: getLabelKey(item),
      }));
      localDispatch(reducerActions.setPatients(patients));
    }
    localDispatch(reducerActions.setPatientsLoading(false));
  };

  const handleDoctorSearch = async query => {
    localDispatch(reducerActions.setDoctorsLoading(true));
    const response = await dataAPI.searchDoctors(query);
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      const doctors = response.data.map(item => ({
        ...item,
        fullName: getLabelKey(item),
      }));
      localDispatch(reducerActions.setDoctors(doctors));
    }
    localDispatch(reducerActions.setDoctorsLoading(false));
  };

  const handleServiceSearch = async query => {
    localDispatch(reducerActions.setServicesLoading(true));
    const response = await dataAPI.searchServices(query, doctor.id);
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      localDispatch(reducerActions.setServices(response.data));
    }
    localDispatch(reducerActions.setServicesLoading(false));
  };

  const handleDateFieldClick = () => {
    localDispatch(reducerActions.setShowDatePicker(true));
  };

  const handleCloseDatePicker = () => {
    localDispatch(reducerActions.setShowDatePicker(false));
  };

  const handleDateChange = newDate => {
    localDispatch(reducerActions.setAppointmentDate(newDate));
  };

  const handleBirthdayChange = newDate => {
    localDispatch(reducerActions.setPatientBirthday(newDate));
  };

  const handleEmailChange = event => {
    const newValue = event.target.value;
    localDispatch(reducerActions.setPatientEmail(newValue));
  };

  const handleCloseBirthdayPicker = () => {
    localDispatch(reducerActions.setShowBirthdayPicker(false));
  };

  const handleOpenBirthdayPicker = () => {
    localDispatch(reducerActions.setShowBirthdayPicker(true));
  };

  const handleHourChange = event => {
    localDispatch(reducerActions.setAppointmentHour(event.target.value));
  };

  const handleNoteChange = event => {
    localDispatch(reducerActions.setAppointmentNote(event.target.value));
  };

  const handleStatusChange = event => {
    localDispatch(reducerActions.setAppointmentStatus(event.target.value));
  };

  const handleIsUrgentChange = () => {
    localDispatch(reducerActions.setIsUrgent(!isUrgent));
  };

  const changePatientMode = () => {
    const isNew = !isNewPatient;
    localDispatch(reducerActions.setIsNewPatient(isNew));
    if (isNew) {
      localDispatch(reducerActions.setPatient(null));
      localDispatch(reducerActions.setIsPatientValid(false));
    }
  };

  const handlePatientNameChange = event => {
    const newValue = event.target.value;
    switch (event.target.id) {
      case 'patientFirstName':
        localDispatch(reducerActions.setPatientFirstName(newValue));
        break;
      case 'patientLastName':
        localDispatch(reducerActions.setPatientLastName(newValue));
        break;
    }
  };

  const isFormValid = () => {
    return (
      isDoctorValid &&
      (isNewPatient || isPatientValid) &&
      isServiceValid &&
      appointmentDate != null &&
      appointmentHour.length > 0 &&
      (!isNewPatient || isPhoneValid)
    );
  };

  const handleCreateSchedule = async () => {
    if (!isFormValid()) {
      return;
    }
    localDispatch(reducerActions.setIsCreatingSchedule(true));
    const [hour, minute] = appointmentHour.split(':');
    const date = moment(appointmentDate);
    date.set({ hour: parseInt(hour), minute: parseInt(minute) });
    const scheduleDate = date.format();
    const requestBody = {
      patientFirstName,
      patientLastName,
      patientPhoneNumber,
      patientBirthday,
      patientEmail,
      isUrgent,
      patientId: patient?.id,
      doctorId: doctor.id,
      serviceId: service.id,
      date: scheduleDate,
      note: appointmentNote,
      status: appointmentStatus,
      scheduleId: scheduleId,
    };
    const response = await dataAPI.createNewSchedule(requestBody);
    // log user action
    if (schedule != null) {
      logUserAction(
        Action.EditAppointment,
        JSON.stringify({
          before: schedule,
          after: response.data || response,
        }),
      );
    } else {
      logUserAction(
        Action.CreateAppointment,
        JSON.stringify(response.data || response),
      );
    }

    // update states
    if (response.isError) {
      toast.error(textForKey(response.message));
      localDispatch(reducerActions.setIsCreatingSchedule(false));
    } else {
      onClose();
      dispatch(toggleAppointmentsUpdate());
    }
  };

  const handlePhoneChange = (value, data, event) => {
    localDispatch(
      reducerActions.setPatientPhoneNumber({
        phoneNumber: `+${value}`,
        isPhoneValid: !event.target?.classList.value.includes('invalid-number'),
      }),
    );
  };

  const datePicker = (
    <EasyDatePicker
      minDate={new Date()}
      open={showDatePicker}
      pickerAnchor={datePickerAnchor.current}
      onChange={handleDateChange}
      selectedDate={appointmentDate}
      onClose={handleCloseDatePicker}
    />
  );

  const birthdayPicker = (
    <EasyDatePicker
      open={showBirthdayPicker}
      pickerAnchor={birthdayPickerAnchor.current}
      onChange={handleBirthdayChange}
      onClose={handleCloseBirthdayPicker}
      selectedDate={patientBirthday || new Date()}
    />
  );

  const isLoading = isFetchingHours || isCreatingSchedule;

  return (
    <EasyPlanModal
      onClose={onClose}
      open={open}
      className='add-appointment-root'
      title={textForKey('Add appointment')}
      isPositiveDisabled={!isFormValid() || isLoading}
      onPositiveClick={handleCreateSchedule}
      isPositiveLoading={isLoading}
    >
      {isNewPatient && (
        <Form.Group>
          <Form.Label>{textForKey('Patient name')}</Form.Label>
          <div className='first-and-last-name'>
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
            isValid={isPatientValid}
            placeholder={textForKey('Enter patient name or phone')}
            id='patients'
            emptyLabel={textForKey('No results...')}
            searchText={textForKey('Searching...')}
            isLoading={loading.patients}
            filterBy={['firstName', 'lastName', 'phoneNumber']}
            labelKey='fullName'
            onSearch={handlePatientSearch}
            options={patients}
            selected={patient ? [patient] : []}
            onChange={handlePatientChange}
            renderMenuItemChildren={option => (
              <div className='patient-result-item'>
                <div className='patient-avatar-wrapper'>
                  {option.photo == null ? (
                    <IconAvatar />
                  ) : (
                    <img
                      src={urlToLambda(option.photo, 40)}
                      alt={option.fullName}
                    />
                  )}
                </div>
                <div className='patient-info-wrapper'>
                  <Typography classes={{ root: 'patient-name' }}>
                    {option.fullName}
                  </Typography>
                  <Typography classes={{ root: 'patient-phone' }}>
                    {option.phoneNumber}
                  </Typography>
                </div>
              </div>
            )}
          />
        </Form.Group>
      )}
      <div
        className='patient-mode-button'
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
        <AsyncTypeahead
          isValid={isDoctorValid}
          placeholder={textForKey('Enter doctor name or phone')}
          id='doctors'
          emptyLabel={textForKey('No results...')}
          searchText={textForKey('Searching...')}
          isLoading={loading.doctors}
          filterBy={['firstName', 'lastName', 'phoneNumber']}
          labelKey='fullName'
          onSearch={handleDoctorSearch}
          options={doctors}
          selected={doctor ? [doctor] : []}
          onChange={handleDoctorChange}
        />
      </Form.Group>
      <Form.Group controlId='service'>
        <Form.Label>{textForKey('Service')}</Form.Label>
        <AsyncTypeahead
          disabled={doctor == null}
          isValid={isServiceValid}
          placeholder={textForKey('Enter service name')}
          id='services'
          emptyLabel={`${textForKey('No results')}`}
          searchText={`${textForKey('Searching')}...`}
          isLoading={loading.services}
          filterBy={['name']}
          labelKey='name'
          onSearch={handleServiceSearch}
          options={services}
          selected={service ? [service] : []}
          onChange={handleServiceChange}
        />
      </Form.Group>
      <InputGroup className='date-and-time-group'>
        <Form.Group className='date-form-group'>
          <Form.Label>{textForKey('Date')}</Form.Label>
          <Form.Control
            value={moment(appointmentDate).format('DD MMMM YYYY')}
            ref={datePickerAnchor}
            readOnly
            onClick={handleDateFieldClick}
          />
        </Form.Group>
        <InputGroup.Append className='date-append'>
          <Form.Group style={{ width: '100%' }}>
            <Form.Label>{textForKey('Time')}</Form.Label>
            <Form.Control
              as='select'
              onChange={handleHourChange}
              value={appointmentHour}
              disabled={isFetchingHours || hours.length === 0}
              custom
            >
              {hours.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
              {hours.length === 0 && (
                <option value={-1}>{textForKey('No available time')}</option>
              )}
            </Form.Control>
          </Form.Group>
        </InputGroup.Append>
      </InputGroup>
      <Form.Group controlId='isUrgent'>
        <Form.Check
          onChange={handleIsUrgentChange}
          type='checkbox'
          checked={isUrgent}
          label={textForKey('Is urgent')}
        />
      </Form.Group>
      {schedule != null && (
        <Form.Group style={{ width: '100%' }}>
          <Form.Label>{textForKey('Status')}</Form.Label>
          <Form.Control
            as='select'
            onChange={handleStatusChange}
            value={appointmentStatus}
            custom
          >
            {ManualStatuses.map(status => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      )}
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
  schedule: PropTypes.shape({
    id: PropTypes.string,
    patientId: PropTypes.string,
    patientName: PropTypes.string,
    patientPhone: PropTypes.string,
    doctorId: PropTypes.string,
    doctorName: PropTypes.string,
    serviceId: PropTypes.string,
    serviceName: PropTypes.string,
    serviceColor: PropTypes.string,
    serviceDuration: PropTypes.string,
    dateAndTime: PropTypes.string,
    status: PropTypes.string,
    note: PropTypes.string,
  }),
};
