import React from 'react';

import { Typography } from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import IconAvatar from '../../../../assets/icons/iconAvatar';

const CalendarDoctor = ({ doctor, isSelected, onSelect }) => {
  const services = doctor.services.map(item => item.name).join(', ');

  const handleDoctorClick = () => {
    onSelect(doctor);
  };

  return (
    <div
      role='button'
      tabIndex={0}
      className={clsx('doctor-item', isSelected && 'selected')}
      onClick={handleDoctorClick}
    >
      <div>
        <IconAvatar />
      </div>
      <div className='name-and-service'>
        <Typography noWrap classes={{ root: 'doctor-name' }}>
          {doctor.firstName} {doctor.lastName}
        </Typography>
        <Typography noWrap classes={{ root: 'service-name' }}>
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
