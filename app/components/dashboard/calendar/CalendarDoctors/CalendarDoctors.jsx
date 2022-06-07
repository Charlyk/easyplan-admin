import React, { useEffect, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-polyglot';
import EASTextField from 'app/components/common/EASTextField';
import areComponentPropsEqual from 'app/utils/areComponentPropsEqual';
import CalendarDoctor from './CalendarDoctor';
import styles from './CalendarDoctors.module.scss';

const CalendarDoctors = ({
  doctors,
  isFetching,
  selectedDoctor,
  selectedService,
  onSelect,
}) => {
  const textForKey = useTranslate();
  const [filteredDoctors, setFilteredDoctors] = useState(doctors);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const newDoctors = doctors.filter((doctor) => {
      if (selectedService == null && searchText.length === 0) return true;
      const servicesIds = doctor.services.map((item) => item.serviceId);
      const fullName = `${doctor.firstName} ${doctor.lastName}`.toLowerCase();
      return (
        (selectedService == null || servicesIds.includes(selectedService.id)) &&
        (searchText.length === 0 || fullName.includes(searchText.toLowerCase()))
      );
    });
    setFilteredDoctors(newDoctors);
  }, [doctors, selectedService, searchText]);

  const handleSearchTextChange = (newValue) => {
    setSearchText(newValue);
  };

  return (
    <div className={styles.calendarDoctors}>
      <div className={styles.doctorsHeader}>{textForKey('all doctors')}</div>
      <div className={styles.doctorsSearch}>
        <EASTextField
          type='text'
          value={searchText}
          placeholder={`${textForKey('search')}...`}
          onChange={handleSearchTextChange}
        />
      </div>
      <div className={styles.doctorsContent}>
        {isFetching && (
          <div className='progress-bar-wrapper'>
            <CircularProgress className='circular-progress-bar' />
          </div>
        )}
        {filteredDoctors.map((doctor) => (
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

export default React.memo(CalendarDoctors, areComponentPropsEqual);

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
