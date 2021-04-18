import React from 'react';
import { Typography } from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import IconAvatar from '../../../../../../components/icons/iconAvatar';
import styles from './CalendarDoctor.module.scss';

const CalendarDoctor = ({ doctor, isSelected, onSelect }) => {
  const services = doctor.services.map(item => item.name).join(', ');

  const handleDoctorClick = () => {
    onSelect(doctor);
  };

  return (
    <div
      role='button'
      tabIndex={0}
      className={clsx(styles['doctor-item'], isSelected && styles.selected)}
      onClick={handleDoctorClick}
    >
      <div>
        <IconAvatar />
      </div>
      <div className={styles['name-and-service']}>
        <Typography noWrap classes={{ root: styles['doctor-name'] }}>
          {doctor.firstName} {doctor.lastName}
        </Typography>
        <Typography noWrap classes={{ root: styles['service-name'] }}>
          {services}
        </Typography>
      </div>
    </div>
  );
};

export default CalendarDoctor;

CalendarDoctor.propTypes = {
  doctor: PropTypes.shape({
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
  }).isRequired,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func,
};

CalendarDoctor.defaultProps = {
  onSelect: () => null,
};
