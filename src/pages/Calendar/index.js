import React, { useEffect, useReducer } from 'react';

import './styles.scss';
import { useDispatch, useSelector } from 'react-redux';

import ConfirmationModal from '../../components/ConfirmationModal';
import {
  setAppointmentModal,
  toggleAppointmentsUpdate,
} from '../../redux/actions/actions';
import { userSelector } from '../../redux/selectors/rootSelector';
import dataAPI from '../../utils/api/dataAPI';
import { textForKey } from '../../utils/localization';
import AppointmentsCalendar from './comps/center/AppointmentsCalendar';
import CalendarDoctors from './comps/left/CalendarDoctors';
import ServicesFilter from './comps/left/ServicesFilter';
import CalendarRightContainer from './comps/right/CalendarRightContainer';

const reducerTypes = {
  filters: 'filters',
  selectedService: 'selectedService',
  selectedDoctor: 'selectedDoctor',
  setViewDate: 'setViewDate',
  isFetching: 'isFetching',
  setSelectedSchedule: 'setSelectedSchedule',
  setDeleteSchedule: 'setDeleteSchedule',
  setIsDeleting: 'setIsDeleting',
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
};

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.filters:
      return { ...state, filters: action.payload };
    case reducerTypes.selectedService:
      return { ...state, selectedService: action.payload };
    case reducerTypes.selectedDoctor:
      return { ...state, selectedDoctor: action.payload };
    case reducerTypes.isFetching:
      return { ...state, isFetching: action.payload };
    case reducerTypes.setViewDate:
      return { ...state, viewDate: action.payload };
    case reducerTypes.setSelectedSchedule:
      return { ...state, selectedSchedule: action.payload };
    case reducerTypes.setDeleteSchedule:
      return { ...state, deleteSchedule: action.payload };
    case reducerTypes.setIsDeleting:
      return { ...state, isDeleting: action.payload };
    default:
      throw new Error('unknown type');
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
};

const Calendar = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(userSelector);
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
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchFilters();
  }, [currentUser]);

  const fetchFilters = async () => {
    localDispatch(reducerActions.setIsFetching(true));
    const response = await dataAPI.fetchCalendarFilters();
    if (response.isError) {
      console.error(response.message);
    } else {
      const { doctors, services } = response.data;
      const newDoctors = doctors.map(item => {
        const servicesIds = item.services.map(service => service.id);
        return {
          ...item,
          services: services.filter(service =>
            servicesIds.includes(service.id),
          ),
        };
      });
      localDispatch(
        reducerActions.setFilters({ doctors: newDoctors, services }),
      );
      if (newDoctors.length > 0) {
        localDispatch(reducerActions.setSelectedDoctor(newDoctors[0]));
      }
    }
    localDispatch(reducerActions.setIsFetching(false));
  };

  const handleAppointmentModalOpen = () => {
    dispatch(
      setAppointmentModal({
        open: true,
        doctor: selectedDoctor,
        date: viewDate,
      }),
    );
  };

  const handleServiceSelected = service => {
    localDispatch(reducerActions.setSelectedService(service));
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

  const handleEditSchedule = schedule => {
    dispatch(
      setAppointmentModal({
        open: true,
        doctor: selectedDoctor,
        date: viewDate,
        schedule: schedule,
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
    localDispatch(
      reducerActions.setDeleteSchedule({ open: false, schedule: null }),
    );
    localDispatch(reducerActions.setIsDeleting(false));
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
      <div className='calendar-root__content__left-container'>
        <ServicesFilter
          services={filters.services}
          selectedService={selectedService}
          onSelect={handleServiceSelected}
        />
        <CalendarDoctors
          isFetching={isFetching}
          selectedDoctor={selectedDoctor}
          selectedService={selectedService}
          doctors={filters.doctors}
          onSelect={handleDoctorSelected}
        />
      </div>
      <div className='calendar-root__content__center-container'>
        <AppointmentsCalendar
          selectedSchedule={selectedSchedule}
          onScheduleSelect={handleScheduleSelected}
          onViewDateChange={handleViewDateChange}
          doctor={selectedDoctor}
          viewDate={viewDate}
        />
      </div>
      <div className='calendar-root__content__right-container'>
        <CalendarRightContainer
          onDeleteSchedule={handleDeleteSchedule}
          onEditSchedule={handleEditSchedule}
          selectedSchedule={selectedSchedule}
          onDateChange={handleViewDateChange}
          selectedDate={viewDate}
          canAddAppointment={selectedDoctor != null}
          onAddAppointment={handleAppointmentModalOpen}
        />
      </div>
    </div>
  );
};

export default Calendar;
