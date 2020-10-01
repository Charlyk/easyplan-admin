import React from 'react';

import PropTypes from 'prop-types';

import IconAvatar from '../../../../assets/icons/iconAvatar';

const CalendarDoctor = ({ doctor }) => {
  const services = doctor.services.map(item => item.name).join(', ');
  return (
    <div className='doctor-item'>
      <IconAvatar />
      <div className='name-and-service'>
        <span className='doctor-name'>
          {doctor.firstName} {doctor.lastName}
        </span>
        <span className='service-name'>{services}</span>
      </div>
    </div>
  );
};

export default CalendarDoctor;

CalendarDoctor.propTypes = {
  doctor: PropTypes.shape({
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
  }).isRequired,
};
