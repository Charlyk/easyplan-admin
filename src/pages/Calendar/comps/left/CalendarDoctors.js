import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';

import { textForKey } from '../../../../utils/localization';
import CalendarDoctor from './CalendarDoctor';

const CalendarDoctors = ({
  doctors,
  selectedDoctor,
  selectedService,
  onSelect,
}) => {
  const [filteredDoctors, setFilteredDoctors] = useState(doctors);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const newDoctors = doctors.filter(doctor => {
      if (selectedService == null && searchText.length === 0) return true;
      const servicesIds = doctor.services.map(item => item.id);
      const fullName = `${doctor.firstName} ${doctor.lastName}`.toLowerCase();
      return (
        (selectedService == null || servicesIds.includes(selectedService.id)) &&
        (searchText.length === 0 || fullName.includes(searchText.toLowerCase()))
      );
    });
    setFilteredDoctors(newDoctors);
  }, [doctors, selectedService, searchText]);

  const handleSearchTextChange = event => {
    setSearchText(event.target.value);
  };

  return (
    <div className='calendar-root__doctors'>
      <div className='doctors-header'>Doctors</div>
      <div className='doctors-search'>
        <Form.Group>
          <InputGroup>
            <Form.Control
              onChange={handleSearchTextChange}
              value={searchText}
              placeholder={`${textForKey('Search')}...`}
              type='text'
            />
          </InputGroup>
        </Form.Group>
      </div>
      <div className='doctors-content'>
        {filteredDoctors.map(doctor => (
          <CalendarDoctor
            key={doctor.id}
            isSelected={doctor.id === selectedDoctor?.id}
            doctor={doctor}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarDoctors;

CalendarDoctors.propTypes = {
  selectedService: PropTypes.object,
  selectedDoctor: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    avatar: PropTypes.string,
    services: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
      }),
    ),
  }),
  doctors: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      avatar: PropTypes.string,
      services: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          name: PropTypes.string,
        }),
      ),
    }),
  ),
  onSelect: PropTypes.func,
};

CalendarDoctors.defaultProps = {
  doctors: [],
  onSelect: () => null,
};
