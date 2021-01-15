import React from 'react';

import { Box, Tooltip, Typography } from '@material-ui/core';
import upperFirst from 'lodash/upperFirst';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { clinicServicesSelector } from '../../../../../redux/selectors/clinicSelector';

const DoctorItem = ({ doctor }) => {
  const clinicServices = useSelector(clinicServicesSelector);

  const doctorServices = () => {
    const servicesIds = doctor.services.map(it => it.serviceId);
    return clinicServices
      .filter(item => servicesIds.includes(item.id))
      .map(it => it.name);
  };

  return (
    <Tooltip
      title={
        <Box display='flex' flexDirection='column' padding='0.5rem'>
          {doctorServices().map((item, index) => (
            <Typography
              classes={{ root: 'calendar-service-tooltip-label' }}
              key={`${item}-${index}`}
            >
              - {item}
            </Typography>
          ))}
        </Box>
      }
    >
      <div
        role='button'
        tabIndex={0}
        className='day-doctors-container__item'
        id={doctor.id}
      >
        <Typography noWrap classes={{ root: 'doctor-name' }}>
          {upperFirst(doctor.firstName.toLowerCase())}{' '}
          {upperFirst(doctor.lastName.toLowerCase())}
        </Typography>
      </div>
    </Tooltip>
  );
};

export default DoctorItem;

DoctorItem.propTypes = {
  doctor: PropTypes.object,
};
