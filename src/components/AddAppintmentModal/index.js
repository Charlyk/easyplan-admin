import React, { useEffect, useReducer } from 'react';

import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';

import dataAPI from '../../utils/api/dataAPI';
import { textForKey } from '../../utils/localization';
import EasyPlanModal from '../EasyPlanModal/EasyPlanModal';
import './styles.scss';

const initialState = {
  patient: null,
  patients: [],
  doctor: null,
  doctors: [],
  service: null,
  services: [],
  isPatientValid: false,
  isDoctorValid: false,
  isServiceValid: false,
  loading: { patients: false, services: false, doctors: false },
};

const reducerTypes = {
  patient: 'patient',
  patients: 'patients',
  doctor: 'doctor',
  doctors: 'doctors',
  service: 'service',
  services: 'services',
  patientsLoading: 'patientsLoading',
  servicesLoading: 'servicesLoading',
  doctorsLoading: 'doctorsLoading',
  isPatientValid: 'isPatientValid',
  isDoctorValid: 'isDoctorValid',
  isServiceValid: 'isServiceValid',
  reset: 'reset',
};

const reducerActions = {
  setPatient: payload => ({ type: reducerTypes.patient, payload }),
  setPatients: payload => ({ type: reducerTypes.patients, payload }),
  setDoctor: payload => ({ type: reducerTypes.doctor, payload }),
  setDoctors: payload => ({ type: reducerTypes.doctors, payload }),
  setService: payload => ({ type: reducerTypes.service, payload }),
  setServices: payload => ({ type: reducerTypes.services, payload }),
  setIsDoctorValid: payload => ({ type: reducerTypes.isDoctorValid, payload }),
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
  resetState: () => ({ type: reducerTypes.reset }),
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
    case reducerTypes.reset:
      return initialState;
  }
};

const AddAppointmentModal = ({ open, onClose }) => {
  const [
    {
      patient,
      patients,
      doctor,
      doctors,
      service,
      services,
      loading,
      isPatientValid,
      isDoctorValid,
      isServiceValid,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!open) {
      localDispatch(reducerActions.resetState());
    }
  }, [open]);

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

  return (
    <EasyPlanModal
      onClose={onClose}
      open={open}
      className='add-appointment-root'
      title={textForKey('Add appointment')}
      isPositiveDisabled={!isDoctorValid || !isPatientValid || !isServiceValid}
    >
      <Form.Group controlId='patient'>
        <Form.Label>{textForKey('Patient')}</Form.Label>
        <AsyncTypeahead
          isValid={isPatientValid}
          allowNew
          newSelectionPrefix={textForKey('New patient')}
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
          emptyLabel={textForKey('No results...')}
          searchText={textForKey('Searching...')}
          isLoading={loading.services}
          filterBy={['name']}
          labelKey='name'
          onSearch={handleServiceSearch}
          options={services}
          selected={service ? [service] : []}
          onChange={handleServiceChange}
        />
      </Form.Group>
    </EasyPlanModal>
  );
};

export default AddAppointmentModal;

AddAppointmentModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};
