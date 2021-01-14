import React, { useEffect, useReducer, useRef } from 'react';

import { Typography } from '@material-ui/core';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';
import {
  AsyncTypeahead,
  Menu,
  MenuItem,
  Typeahead,
} from 'react-bootstrap-typeahead';
import PhoneInput from 'react-phone-input-2';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import IconAvatar from '../../assets/icons/iconAvatar';
import { toggleAppointmentsUpdate } from '../../redux/actions/actions';
import { clinicActiveDoctorsSelector } from '../../redux/selectors/clinicSelector';
import dataAPI from '../../utils/api/dataAPI';
import { Action, EmailRegex } from '../../utils/constants';
import {
  generateReducerActions,
  logUserAction,
  urlToLambda,
} from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import EasyDatePicker from '../EasyDatePicker';
import EasyPlanModal from '../EasyPlanModal/EasyPlanModal';
import './styles.scss';

const initialState = {
  patient: null,
  patients: [],
  availableStartTime: [],
  availableEndTime: [],
  availableTime: [],
  doctor: null,
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
  startTime: '',
  endTime: '',
  appointmentNote: '',
  appointmentStatus: 'Pending',
  isUrgent: false,
  loading: { patients: false, services: false, doctors: false },
};

const reducerTypes = {
  setPatient: 'setPatient',
  setPatients: 'setPatients',
  setDoctor: 'setDoctor',
  setService: 'setService',
  setServices: 'setServices',
  setHours: 'setHours',
  setPatientFirstName: 'setPatientFirstName',
  setPatientLastName: 'setPatientLastName',
  setPatientPhoneNumber: 'setPatientPhoneNumber',
  setIsPhoneValid: 'SetIsPhoneValid',
  setIsNewPatient: 'setIsNewPatient',
  setPatientsLoading: 'setPatientsLoading',
  setServicesLoading: 'setServicesLoading',
  setDoctorsLoading: 'setDoctorsLoading',
  setIsPatientValid: 'setIsPatientValid',
  setIsDoctorValid: 'setIsDoctorValid',
  setIsServiceValid: 'setIsServiceValid',
  setIsFetchingHours: 'setIsFetchingHours',
  setShowDatePicker: 'setShowDatePicker',
  setShowBirthdayPicker: 'setShowBirthdayPicker',
  setAppointmentDate: 'setAppointmentDate',
  setAppointmentHour: 'setAppointmentHour',
  setAppointmentNote: 'setAppointmentNote',
  setAppointmentStatus: 'setAppointmentStatus',
  setIsCreatingSchedule: 'setIsCreatingSchedule',
  setSchedule: 'setSchedule',
  setPatientBirthday: 'setPatientBirthday',
  setPatientEmail: 'setPatientEmail',
  setIsUrgent: 'setIsUrgent',
  setStartTime: 'setStartTime',
  setEndTime: 'setEndTime',
  resetState: 'resetState',
  setAvailableTime: 'setAvailableTime',
  setAvailableStartTime: 'setAvailableStartTime',
  setAvailableEndTime: 'setAvailableEndTime',
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setPatient:
      return {
        ...state,
        patient: action.payload,
        isPatientValid: action.payload != null,
      };
    case reducerTypes.setServices:
      return { ...state, services: action.payload };
    case reducerTypes.setDoctor:
      return {
        ...state,
        doctor: action.payload,
        isDoctorValid: action.payload != null,
      };
    case reducerTypes.setPatients:
      return { ...state, patients: action.payload };
    case reducerTypes.setIsPatientValid:
      return { ...state, isPatientValid: action.payload };
    case reducerTypes.setIsUrgent:
      return { ...state, isUrgent: action.payload };
    case reducerTypes.setStartTime: {
      const startTime = action.payload;
      const availableEndTime = state.availableTime.filter(
        item => item > startTime,
      );
      return { ...state, startTime, availableEndTime };
    }
    case reducerTypes.setEndTime: {
      const endTime = action.payload;
      const availableStartTime = state.availableTime.filter(
        item => item < endTime,
      );
      return { ...state, endTime, availableStartTime };
    }
    case reducerTypes.setDoctorsLoading:
      return {
        ...state,
        loading: { ...state.loading, doctors: action.payload },
      };
    case reducerTypes.setServicesLoading:
      return {
        ...state,
        loading: { ...state.loading, services: action.payload },
      };
    case reducerTypes.setPatientsLoading:
      return {
        ...state,
        loading: { ...state.loading, patients: action.payload },
      };
    case reducerTypes.setIsDoctorValid:
      return { ...state, isDoctorValid: action.payload };
    case reducerTypes.setService:
      return {
        ...state,
        service: action.payload,
        isServiceValid: action.payload != null,
      };
    case reducerTypes.setIsServiceValid:
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
      const scheduleStartDate = moment(schedule.startTime);
      const scheduleEndDate = moment(schedule.endTime);
      return {
        ...state,
        scheduleId: schedule.id,
        patient: schedule.patient,
        doctor: schedule.doctor,
        service: schedule.service,
        appointmentNote: schedule.noteText,
        appointmentDate: scheduleStartDate.toDate(),
        startTime: scheduleStartDate.format('HH:mm'),
        endTime: scheduleEndDate.format('HH:mm'),
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
    case reducerTypes.setAvailableTime: {
      const availableTime = action.payload;
      const startTime =
        availableTime?.length > 0 && state.startTime.length === 0
          ? availableTime[0]
          : state.startTime;
      const endTime =
        availableTime?.length > 1 && state.endTime.length === 0
          ? availableTime[1]
          : state.endTime;
      const availableStartTime = availableTime.filter(item => item < endTime);
      const availableEndTime = availableTime.filter(item => item > startTime);
      return {
        ...state,
        availableTime,
        availableStartTime,
        availableEndTime,
        startTime,
        endTime,
      };
    }
    case reducerTypes.setAvailableStartTime:
      return { ...state, availableStartTime: action.payload };
    case reducerTypes.setAvailableEndTime:
      return { ...state, availableEndTime: action.payload };
    case reducerTypes.reset:
      return initialState;
    default:
      return state;
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
  const doctors = useSelector(clinicActiveDoctorsSelector);
  const [
    {
      patient,
      patients,
      doctor,
      service,
      services,
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

  const fetchScheduleDetails = async () => {
    if (schedule == null) {
      return;
    }
    const response = await dataAPI.fetchScheduleDetails(schedule.id);
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      localDispatch(actions.setSchedule(response.data));
    }
  };

  const fetchAvailableHours = async () => {
    if (doctor == null || service == null || appointmentDate == null) {
      return;
    }
    localDispatch(actions.setIsFetchingHours(true));
    const response = await dataAPI.fetchAvailableTime(
      scheduleId,
      doctor.id,
      service.id,
      appointmentDate,
    );
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      localDispatch(actions.setAvailableTime(response.data));
      if (response.data.length === 0) {
        toast.error(textForKey(response.message));
      }
    }
    localDispatch(actions.setIsFetchingHours(false));
  };

  const handlePatientChange = selectedPatients => {
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

  const handleDoctorChange = selectedDoctors => {
    if (selectedDoctors.length > 0) {
      localDispatch(actions.setDoctor(selectedDoctors[0]));
    } else {
      localDispatch(actions.setDoctor(null));
    }
  };

  const handleServiceChange = selectedServices => {
    if (selectedServices.length > 0) {
      localDispatch(actions.setService(selectedServices[0]));
    } else {
      localDispatch(actions.setService(null));
    }
  };

  const getLabelKey = option => {
    return option.firstName || option.lastName
      ? `${option.firstName} ${option.lastName}`
      : option.phoneNumber;
  };

  const handlePatientSearch = async query => {
    localDispatch(actions.setPatientsLoading(true));
    const updatedQuery = query.replace('+', '');
    const response = await dataAPI.searchPatients(updatedQuery);
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      const patients = response.data.map(item => ({
        ...item,
        fullName: getLabelKey(item),
      }));
      localDispatch(actions.setPatients(patients));
    }
    localDispatch(actions.setPatientsLoading(false));
  };

  const handleServiceSearch = async query => {
    localDispatch(actions.setServicesLoading(true));
    const response = await dataAPI.searchServices(query, doctor.id);
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      localDispatch(actions.setServices(response.data));
    }
    localDispatch(actions.setServicesLoading(false));
  };

  const handleDateFieldClick = () => {
    localDispatch(actions.setShowDatePicker(true));
  };

  const handleCloseDatePicker = () => {
    localDispatch(actions.setShowDatePicker(false));
  };

  const handleDateChange = newDate => {
    localDispatch(actions.setAppointmentDate(newDate));
  };

  const handleBirthdayChange = newDate => {
    localDispatch(actions.setPatientBirthday(newDate));
  };

  const handleEmailChange = event => {
    const newValue = event.target.value;
    localDispatch(actions.setPatientEmail(newValue));
  };

  const handleCloseBirthdayPicker = () => {
    localDispatch(actions.setShowBirthdayPicker(false));
  };

  const handleOpenBirthdayPicker = () => {
    localDispatch(actions.setShowBirthdayPicker(true));
  };

  const handleHourChange = event => {
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

  const handleNoteChange = event => {
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

  const handlePatientNameChange = event => {
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
      serviceId: service.id,
      startDate: startDate.toDate(),
      endDate: endDate.toDate(),
      note: appointmentNote,
      status: appointmentStatus,
      scheduleId: scheduleId,
    };

    // perform the request
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
    } else {
      onClose();
      dispatch(toggleAppointmentsUpdate());
    }
    localDispatch(actions.setIsCreatingSchedule(false));
  };

  const handlePhoneChange = (value, data, event) => {
    localDispatch(
      actions.setPatientPhoneNumber({
        phoneNumber: `+${value}`,
        isPhoneValid: !event.target?.classList.value.includes('invalid-number'),
      }),
    );
  };

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
        <Typeahead
          isValid={isDoctorValid}
          placeholder={textForKey('Enter doctor name or phone')}
          id='doctors'
          emptyLabel={textForKey('No results...')}
          searchText={textForKey('Searching...')}
          filterBy={['firstName', 'lastName']}
          labelKey='fullName'
          options={doctors}
          selected={doctor ? [doctor] : []}
          onChange={handleDoctorChange}
          renderMenu={(results, menuProps) => {
            return (
              <Menu {...menuProps}>
                {results.map((result, index) => (
                  <MenuItem key={result.id} option={result} position={index}>
                    {result.fullName}
                  </MenuItem>
                ))}
              </Menu>
            );
          }}
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
      <Form.Group className='date-form-group'>
        <Form.Label>{textForKey('Date')}</Form.Label>
        <Form.Control
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
            value={endTime}
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
    status: PropTypes.string,
    note: PropTypes.string,
  }),
};
