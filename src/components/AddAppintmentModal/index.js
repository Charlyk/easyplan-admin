import React, { useEffect, useReducer, useRef } from 'react';

import { ClickAwayListener, Fade, Paper } from '@material-ui/core';
import Popper from '@material-ui/core/Popper';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { Calendar } from 'react-date-range';
import * as locales from 'react-date-range/dist/locale';
import PhoneInput from 'react-phone-input-2';
import { useDispatch } from 'react-redux';

import { toggleAppointmentsUpdate } from '../../redux/actions/actions';
import dataAPI from '../../utils/api/dataAPI';
import { Action, ScheduleStatuses } from '../../utils/constants';
import { logUserAction } from '../../utils/helperFuncs';
import { getAppLanguage, textForKey } from '../../utils/localization';
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
  setAppointmentDate: 'setAppointmentDate',
  setAppointmentHour: 'setAppointmentHour',
  setAppointmentNote: 'setAppointmentNote',
  setAppointmentStatus: 'setAppointmentStatus',
  setIsCreatingSchedule: 'setIsCreatingSchedule',
  setSchedule: 'setSchedule',
  reset: 'reset',
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
  /**
   * Update patient phone
   * @param {{phoneNumber: string, isPhoneValid: boolean}} payload
   * @return {{payload: *, type: string}}
   */
  setPatientPhoneNumber: payload => ({
    type: reducerTypes.setPatientPhoneNumber,
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
      const scheduleDate = moment(schedule.dateAndTime);
      return {
        ...state,
        scheduleId: schedule.id,
        patient: { id: schedule.patientId, fullName: schedule.patientName },
        doctor: { id: schedule.doctorId, fullName: schedule.doctorName },
        service: { id: schedule.serviceId, name: schedule.serviceName },
        appointmentNote: schedule.note,
        appointmentDate: scheduleDate.toDate(),
        appointmentHour: scheduleDate.format('HH:mm'),
        appointmentStatus: schedule.status,
        isPatientValid: true,
        isDoctorValid: true,
        isServiceValid: true,
      };
    }
    case reducerTypes.setIsNewPatient:
      return { ...state, isNewPatient: action.payload };
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
    case reducerTypes.reset:
      return initialState;
  }
};

const AddAppointmentModal = ({
  open,
  doctor: selectedDoctor,
  date,
  schedule,
  onClose,
}) => {
  const dispatch = useDispatch();
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
      isPhoneValid,
      isNewPatient,
      appointmentDate,
      appointmentHour,
      appointmentNote,
      appointmentStatus,
      showDatePicker,
      isFetchingHours,
      isPatientValid,
      isDoctorValid,
      isServiceValid,
      isCreatingSchedule,
    },
    localDispatch,
  ] = useReducer(reducer, { ...initialState });

  useEffect(() => {
    if (schedule != null) {
      localDispatch(reducerActions.setSchedule(schedule));
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
  }, [selectedDoctor, date]);

  useEffect(() => {
    fetchAvailableHours();
  }, [doctor, service, appointmentDate]);

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
      if (response.data.length > 0) {
        localDispatch(reducerActions.setAppointmentHour(response.data[0]));
      } else {
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
      console.error(response.message);
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
      console.error(response.message);
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
      console.error(response.message);
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

  const handleHourChange = event => {
    localDispatch(reducerActions.setAppointmentHour(event.target.value));
  };

  const handleNoteChange = event => {
    localDispatch(reducerActions.setAppointmentNote(event.target.value));
  };

  const handleStatusChange = event => {
    localDispatch(reducerActions.setAppointmentStatus(event.target.value));
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
    const scheduleDate = `${moment(appointmentDate).format(
      'YYYY-MM-DD',
    )} ${appointmentHour}`;
    const requestBody = {
      patientFirstName,
      patientLastName,
      patientPhoneNumber,
      patientId: patient?.id,
      doctorId: doctor.id,
      serviceId: service.id,
      date: scheduleDate,
      note: appointmentNote,
      status: appointmentStatus,
      scheduleId: scheduleId,
    };
    const response = await dataAPI.createNewSchedule(requestBody);
    if (response.isError) {
      console.error(response.message);
      localDispatch(reducerActions.setIsCreatingSchedule(false));
    } else {
      onClose();
      if (schedule != null) {
        logUserAction(
          Action.EditAppointment,
          JSON.stringify({ before: schedule, after: requestBody }),
        );
      } else {
        logUserAction(Action.CreateAppointment, JSON.stringify(requestBody));
      }
      dispatch(toggleAppointmentsUpdate());
    }
  };

  const handlePhoneChange = (value, data, event) => {
    localDispatch(
      reducerActions.setPatientPhoneNumber({
        phoneNumber: `+${value}`,
        isPhoneValid: !event.target.classList.value.includes('invalid-number'),
      }),
    );
  };

  const disableDate = date => {
    console.log(date);
  };

  const datePicker = (
    <Popper
      className='appointment-date-picker-root'
      anchorEl={datePickerAnchor.current}
      open={showDatePicker}
      disablePortal
      placement='bottom'
      transition
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper className='calendar-paper'>
            <ClickAwayListener onClickAway={handleCloseDatePicker}>
              <Calendar
                disabledDay={disableDate}
                minDate={new Date()}
                onChange={handleDateChange}
                locale={locales[getAppLanguage()]}
                date={appointmentDate}
              />
            </ClickAwayListener>
          </Paper>
        </Fade>
      )}
    </Popper>
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
      <Form.Group style={{ width: '100%' }}>
        <Form.Label>{textForKey('Status')}</Form.Label>
        <Form.Control
          as='select'
          onChange={handleStatusChange}
          value={appointmentStatus}
          custom
        >
          {ScheduleStatuses.map(status => (
            <option key={status.id} value={status.id}>
              {status.name}
            </option>
          ))}
        </Form.Control>
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
    </EasyPlanModal>
  );
};

export default AddAppointmentModal;

AddAppointmentModal.propTypes = {
  open: PropTypes.bool,
  date: PropTypes.instanceOf(Date),
  doctor: PropTypes.object,
  onClose: PropTypes.func.isRequired,
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
