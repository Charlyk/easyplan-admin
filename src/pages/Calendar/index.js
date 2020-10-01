import React, { useEffect, useState } from 'react';

import './styles.scss';
import dataAPI from '../../utils/api/dataAPI';
import AppointmentsCalendar from './comps/center/AppointmentsCalendar';
import CalendarDoctors from './comps/left/CalendarDoctors';
import ServicesFilter from './comps/left/ServicesFilter';
import CalendarRightContainer from './comps/right/CalendarRightContainer';

const Calendar = props => {
  const [filters, setFilters] = useState({ doctors: [], services: [] });
  const [selectedService, setSelectedService] = useState(null);

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
      setFilters({ doctors: newDoctors, services });
    }
  };

  const handleServiceSelected = service => {
    setSelectedService(service);
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
          selectedService={selectedService}
          doctors={filters.doctors}
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
