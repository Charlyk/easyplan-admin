import React from 'react';

import { Typography } from '@material-ui/core';
import upperFirst from 'lodash/upperFirst';
import PropTypes from 'prop-types';

const DoctorItem = ({ doctor }) => {
  return (
    <div className='day-doctors-container__item' id={doctor.id}>
      <Typography noWrap classes={{ root: 'doctor-name' }}>
        {upperFirst(doctor.firstName.toLowerCase())}{' '}
        {upperFirst(doctor.lastName.toLowerCase())}
      </Typography>
    </div>
  );
};

export default DoctorItem;

DoctorItem.propTypes = {
  doctor: PropTypes.object,
};
