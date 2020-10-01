import React, { useEffect, useReducer, useState } from 'react';

import './styles.scss';
import dataAPI from '../../utils/api/dataAPI';
import AppointmentsCalendar from './comps/center/AppointmentsCalendar';
import CalendarDoctors from './comps/left/CalendarDoctors';
import ServicesFilter from './comps/left/ServicesFilter';
import CalendarRightContainer from './comps/right/CalendarRightContainer';

const reducerTypes = {
  filters: 'filters',
  selectedService: 'selectedService',
  selectedDoctor: 'selectedDoctor',
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
};

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.filters:
      return { ...state, filters: action.payload };
    case reducerTypes.selectedService:
      return { ...state, selectedService: action.payload };
    case reducerTypes.selectedDoctor:
      return { ...state, selectedDoctor: action.payload };
    default:
      throw new Error('unknown type');
  }
};

const initialState = {
  filters: { doctors: [], services: [] },
  selectedService: null,
  selectedDoctor: null,
};

const Calendar = props => {
  const [
    { filters, selectedService, selectedDoctor },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchFilters();
  }, [props]);

  const fetchFilters = async () => {
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
  };

  const handleServiceSelected = service => {
    localDispatch(reducerActions.setSelectedService(service));
  };

  const handleDoctorSelected = doctor => {
    localDispatch(reducerActions.setSelectedDoctor(doctor));
  };

  return (
    <div className='calendar-root'>
      <div className='calendar-root__content__left-container'>
        <ServicesFilter
          services={filters.services}
          selectedService={selectedService}
          onSelect={handleServiceSelected}
        />
        <CalendarDoctors
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
        <CalendarRightContainer />
      </div>
    </div>
  );
};

export default Calendar;
