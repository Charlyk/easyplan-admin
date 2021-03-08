import React from 'react';

import { TableCell, TableRow, Typography, Box } from '@material-ui/core';
import PropTypes from 'prop-types';

import IconAvatar from '../../../../components/icons/iconAvatar';
import IconEmail from '../../../../components/icons/iconEmail';
import IconPhone from '../../../../components/icons/iconPhone';
import styles from './PatientRow.module.scss';
import clsx from "clsx";

const PatientRow = ({ patient, onSelect }) => {
  const handlePatientNameClick = () => {
    onSelect(patient);
  };

  const stopPropagation = event => {
    event.stopPropagation();
  };

  return (
    <TableRow
      key={`patient-${patient.id}`}
      onClick={handlePatientNameClick}
      classes={{ root: styles['table-body-row'] }}
    >
      <TableCell classes={{ root: styles['name-and-photo'] }}>
        <Box display='flex' alignItems='center'>
          <IconAvatar />
          <Typography
            classes={{ root: clsx(styles['row-label'], styles.name) }}
            onClick={handlePatientNameClick}
          >
            {patient.fullName}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Typography classes={{ root: clsx(styles['row-label'], styles.phone) }}>
          <IconPhone />
          <a
            href={`tel:${patient.phoneNumber.replace('+', '')}`}
            onClick={stopPropagation}
          >
            {patient.phoneNumber}
          </a>
        </Typography>
      </TableCell>
      <TableCell>
        <Typography classes={{ root: clsx(styles['row-label'], styles.email) }}>
          <IconEmail />
          {patient.email ? (
            <a
              href={`mailto:${patient.email}`}
              target='_blank'
              rel='noreferrer'
              onClick={stopPropagation}
            >
              {patient.email}
            </a>
          ) : (
            '-'
          )}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography classes={{ root: styles['row-label'] }}>
          {patient.discount}%
        </Typography>
      </TableCell>
    </TableRow>
  );
};

export default PatientRow;

PatientRow.propTypes = {
  patient: PropTypes.shape({
    id: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    fullName: PropTypes.string,
    phoneNumber: PropTypes.string,
    email: PropTypes.string,
    discount: PropTypes.number,
  }),
  onSelect: PropTypes.func,
};
