import React, { useEffect, useReducer } from 'react';

import './styles.scss';
import { useDispatch, useSelector } from 'react-redux';

import ConfirmationModal from '../../components/ConfirmationModal';
import {
  setAppointmentModal,
  setPaymentModal,
  toggleAppointmentsUpdate,
} from '../../redux/actions/actions';
import {
  clinicDoctorsSelector,
  clinicServicesSelector,
} from '../../redux/selectors/clinicSelector';
import dataAPI from '../../utils/api/dataAPI';
import { Action } from '../../utils/constants';
import { logUserAction } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import AppointmentsCalendar from './comps/center/AppointmentsCalendar';
import CalendarDoctors from './comps/left/CalendarDoctors';

const reducerTypes = {
  filters: 'filters',
  selectedService: 'selectedService',
  selectedDoctor: 'selectedDoctor',
  setViewDate: 'setViewDate',
  isFetching: 'isFetching',
  setSelectedSchedule: 'setSelectedSchedule',
  setDeleteSchedule: 'setDeleteSchedule',
  setIsDeleting: 'setIsDeleting',
  setViewMode: 'setViewMode',
};

const reducerActions = {
  setViewDate: payload => ({ type: reducerTypes.setViewDate, payload }),
  setFilters: payload => ({ type: reducerTypes.filters, payload }),
  setSelectedService: payload => ({
    type: reducerTypes.selectedService,
    payload,
  }),
  setSelectedDoctor: payload => ({
    type: reducerTypes.selectedDoctor,
    payload,
  }),
  setIsFetching: payload => ({ type: reducerTypes.isFetching, payload }),
  setSelectedSchedule: payload => ({
    type: reducerTypes.setSelectedSchedule,
    payload,
  }),
  setDeleteSchedule: payload => ({
    type: reducerTypes.setDeleteSchedule,
    payload,
  }),
  setIsDeleting: payload => ({ type: reducerTypes.setIsDeleting, payload }),
  setViewMode: payload => ({ type: reducerTypes.setViewMode, payload }),
};

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.filters:
      return { ...state, filters: action.payload };
    case reducerTypes.selectedService:
      return { ...state, selectedService: action.payload };
    case reducerTypes.selectedDoctor:
      return {
        ...state,
        selectedDoctor: action.payload,
        selectedSchedule: null,
      };
    case reducerTypes.isFetching:
      return { ...state, isFetching: action.payload };
    case reducerTypes.setViewDate:
      return { ...state, viewDate: action.payload, selectedSchedule: null };
    case reducerTypes.setSelectedSchedule:
      return { ...state, selectedSchedule: action.payload };
    case reducerTypes.setDeleteSchedule:
      return { ...state, deleteSchedule: action.payload };
    case reducerTypes.setIsDeleting:
      return { ...state, isDeleting: action.payload };
    case reducerTypes.setViewMode:
      return { ...state, viewMode: action.payload, selectedSchedule: null };
    default:
      return state;
  }
};

const initialState = {
  filters: { doctors: [], services: [] },
  selectedService: null,
  selectedDoctor: null,
  appointmentModal: { open: false },
  isFetching: false,
  viewDate: new Date(),
  deleteSchedule: { open: false, schedule: null },
  isDeleting: false,
  viewMode: 'day',
};

const Calendar = () => {
  const dispatch = useDispatch();
  const services = useSelector(clinicServicesSelector);
  const doctors = useSelector(clinicDoctorsSelector);
  const [
    {
      filters,
      selectedService,
      selectedDoctor,
      isFetching,
      viewDate,
      selectedSchedule,
      deleteSchedule,
      isDeleting,
      viewMode,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    const newDoctors = doctors.map(item => {
      const servicesIds = item.services.map(service => service.id);
      return {
        ...item,
        services: services.filter(service => servicesIds.includes(service.id)),
      };
    });
    localDispatch(reducerActions.setFilters({ doctors: newDoctors, services }));
    if (newDoctors.length > 0) {
      localDispatch(reducerActions.setSelectedDoctor(newDoctors[0]));
    }
  }, [doctors, services]);

  const handleAppointmentModalOpen = () => {
    dispatch(
      setAppointmentModal({
        open: true,
        doctor: selectedDoctor,
        date: viewDate,
      }),
    );
  };

  const handleDoctorSelected = doctor => {
    localDispatch(reducerActions.setSelectedDoctor(doctor));
  };

  const handleViewDateChange = newDate => {
    localDispatch(reducerActions.setViewDate(newDate));
  };

  const handleScheduleSelected = schedule => {
    localDispatch(reducerActions.setSelectedSchedule(schedule));
  };

  const handleViewModeChange = newMode => {
    localDispatch(reducerActions.setViewMode(newMode));
  };

  const handlePayDebt = debt => {
    dispatch(setPaymentModal({ open: true, invoice: debt }));
  };

  const handleEditSchedule = schedule => {
    dispatch(
      setAppointmentModal({
        open: true,
        schedule,
      }),
    );
  };

  const handleDeleteSchedule = schedule => {
    localDispatch(reducerActions.setDeleteSchedule({ open: true, schedule }));
  };

  const handleConfirmDeleteSchedule = async () => {
    if (deleteSchedule.schedule == null) {
      return;
    }
    localDispatch(reducerActions.setIsDeleting(true));
    await dataAPI.deleteSchedule(deleteSchedule.schedule.id);
    logUserAction(
      Action.DeleteAppointment,
      JSON.stringify(deleteSchedule.schedule),
    );
    localDispatch(
      reducerActions.setDeleteSchedule({ open: false, schedule: null }),
    );
    localDispatch(reducerActions.setIsDeleting(false));
    if (selectedSchedule.id === deleteSchedule.schedule.id) {
      localDispatch(reducerActions.setSelectedSchedule(null));
    }
    dispatch(toggleAppointmentsUpdate());
  };

  const handleCloseDeleteSchedule = () => {
    localDispatch(
      reducerActions.setDeleteSchedule({ open: false, schedule: null }),
    );
  };

  return (
    <div className='calendar-root'>
      <ConfirmationModal
        isLoading={isDeleting}
        show={deleteSchedule.open}
        title={textForKey('Delete appointment')}
        message={textForKey('delete appointment message')}
        onConfirm={handleConfirmDeleteSchedule}
        onClose={handleCloseDeleteSchedule}
      />
      {viewMode !== 'day' && (
        <div className='calendar-root__content__left-container'>
          <CalendarDoctors
            isFetching={isFetching}
            selectedDoctor={selectedDoctor}
            selectedService={selectedService}
            doctors={filters.doctors}
            onSelect={handleDoctorSelected}
          />
        </div>
      )}
      <div className='calendar-root__content__center-container'>
        <AppointmentsCalendar
          onPayDebt={handlePayDebt}
          onDeleteSchedule={handleDeleteSchedule}
          onEditSchedule={handleEditSchedule}
          canAddAppointment={selectedDoctor != null}
          onAddAppointment={handleAppointmentModalOpen}
          selectedSchedule={selectedSchedule}
          onScheduleSelect={handleScheduleSelected}
          onViewDateChange={handleViewDateChange}
          onViewModeChange={handleViewModeChange}
          doctor={selectedDoctor}
          viewDate={viewDate}
        />
      </div>
    </div>
  );
};

export default Calendar;
