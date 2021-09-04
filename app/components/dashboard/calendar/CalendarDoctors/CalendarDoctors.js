import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from 'react-bootstrap/Spinner';
import { textForKey } from '../../../../../utils/localization';
import CalendarDoctor from './CalendarDoctor';
import styles from './CalendarDoctors.module.scss';

const CalendarDoctors = (
  {
    doctors,
    isFetching,
    selectedDoctor,
    selectedService,
    onSelect,
  }
) => {
  const [filteredDoctors, setFilteredDoctors] = useState(doctors);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const newDoctors = doctors.filter(doctor => {
      if (selectedService == null && searchText.length === 0) return true;
      const servicesIds = doctor.services.map(item => item.serviceId);
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
    <div className={styles.calendarDoctors}>
      <div className={styles['doctors-header']}>Doctors</div>
      <div className={styles['doctors-search']}>
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
      <div className={styles['doctors-content']}>
        {isFetching && (
          <Spinner animation='border' className={styles['loading-spinner']}/>
        )}
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
  isFetching: PropTypes.bool,
  selectedDoctor: PropTypes.shape({
    id: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    avatar: PropTypes.string,
    services: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        serviceId: PropTypes.number,
        name: PropTypes.string,
      }),
    ),
  }),
  doctors: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      avatar: PropTypes.string,
      services: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          serviceId: PropTypes.number,
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
