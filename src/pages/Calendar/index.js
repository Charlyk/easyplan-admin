import React, { useEffect, useReducer } from 'react';

import './styles.scss';
import { useSelector } from 'react-redux';

import AddAppointmentModal from '../../components/AddAppintmentModal';
import { userSelector } from '../../redux/selectors/rootSelector';
import dataAPI from '../../utils/api/dataAPI';
import AppointmentsCalendar from './comps/center/AppointmentsCalendar';
import CalendarDoctors from './comps/left/CalendarDoctors';
import ServicesFilter from './comps/left/ServicesFilter';
import CalendarRightContainer from './comps/right/CalendarRightContainer';

const reducerTypes = {
  filters: 'filters',
  selectedService: 'selectedService',
  selectedDoctor: 'selectedDoctor',
  appointmentModal: 'appointmentModal',
  isFetching: 'isFetching',
};

const reducerActions = {
  setFilters: payload => ({ type: reducerTypes.filters, payload }),
  setSelectedService: payload => ({
    type: reducerTypes.selectedService,
    payload,
  }),
  setSelectedDoctor: payload => ({
    type: reducerTypes.selectedDoctor,
    payload,
  }),
  setAppointmentModal: payload => ({
    type: reducerTypes.appointmentModal,
    payload,
  }),
  setIsFetching: payload => ({ type: reducerTypes.isFetching, payload }),
};

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.filters:
      return { ...state, filters: action.payload };
    case reducerTypes.selectedService:
      return { ...state, selectedService: action.payload };
    case reducerTypes.selectedDoctor:
      return { ...state, selectedDoctor: action.payload };
    case reducerTypes.appointmentModal:
      return { ...state, appointmentModal: action.payload };
    case reducerTypes.isFetching:
      return { ...state, isFetching: action.payload };
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
};

const Calendar = props => {
  const currentUser = useSelector(userSelector);
  const [
    { filters, selectedService, selectedDoctor, appointmentModal, isFetching },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchFilters();
  }, [props, currentUser]);

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

  const handleAppointmentModalClose = () => {
    localDispatch(reducerActions.setAppointmentModal({ open: false }));
  };

  const handleAppointmentModalOpen = () => {
    localDispatch(reducerActions.setAppointmentModal({ open: true }));
  };

  const handleServiceSelected = service => {
    localDispatch(reducerActions.setSelectedService(service));
  };

  const handleDoctorSelected = doctor => {
    localDispatch(reducerActions.setSelectedDoctor(doctor));
  };

  return (
    <div className='calendar-root'>
      <AddAppointmentModal
        onClose={handleAppointmentModalClose}
        open={appointmentModal.open}
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
        <AppointmentsCalendar />
      </div>
      <div className='calendar-root__content__right-container'>
        <CalendarRightContainer onAddAppointment={handleAppointmentModalOpen} />
      </div>
    </div>
  );
};

export default Calendar;
