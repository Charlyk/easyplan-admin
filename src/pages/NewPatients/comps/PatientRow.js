import React from 'react';

import { TableCell, TableRow, Typography, Box } from '@material-ui/core';
import PropTypes from 'prop-types';

import IconAvatar from '../../../assets/icons/iconAvatar';
import IconEmail from '../../../assets/icons/iconEmail';
import IconPhone from '../../../assets/icons/iconPhone';

const PatientRow = ({ patient, onSelect }) => {
  const handlePatientNameClick = () => {
    onSelect(patient);
  };

  return (
    <TableRow key={patient.id} classes={{ root: 'table-body-row' }}>
      <TableCell classes={{ root: 'name-and-photo' }}>
        <Box display='flex' alignItems='center'>
          <IconAvatar />
          <Typography
            classes={{ root: 'row-label name' }}
            onClick={handlePatientNameClick}
          >
            {patient.fullName}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Typography classes={{ root: 'row-label phone' }}>
          <IconPhone />
          <a href={`tel:${patient.phoneNumber}`}>{patient.phoneNumber}</a>
        </Typography>
      </TableCell>
      <TableCell>
        <Typography classes={{ root: 'row-label email' }}>
          <IconEmail />
          {patient.email ? (
            <a
              href={`mailto:${patient.email}`}
              target='_blank'
              rel='noreferrer'
            >
              {patient.email}
            </a>
          ) : (
            '-'
          )}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography classes={{ root: 'row-label' }}>0%</Typography>
      </TableCell>
    </TableRow>
  );
};

export default PatientRow;

PatientRow.propTypes = {
  patient: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    fullName: PropTypes.string,
    phoneNumber: PropTypes.string,
    email: PropTypes.string,
    discount: PropTypes.number,
  }),
  onSelect: PropTypes.func,
};
