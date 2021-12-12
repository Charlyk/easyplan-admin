import React from 'react';
import Box from '@material-ui/core/Box';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import EASImage from 'app/components/common/EASImage';
import IconAvatar from 'app/components/icons/iconAvatar';
import IconEmail from 'app/components/icons/iconEmail';
import IconPhone from 'app/components/icons/iconPhone';
import { textForKey } from 'app/utils/localization';
import styles from './PatientRow.module.scss';

const PatientRow = ({ patient, onSelect }) => {
  const handlePatientNameClick = () => {
    onSelect(patient);
  };

  const stopPropagation = (event) => {
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
          <EASImage
            enableLoading
            src={patient.avatar}
            placeholder={<IconAvatar />}
            className={styles.avatarRoot}
          />
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
            href={`tel:${patient.countryCode}${patient.phoneNumber}`}
            onClick={stopPropagation}
          >
            {`+${patient.countryCode}${patient.phoneNumber}`}
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
        <Typography classes={{ root: clsx(styles['row-label'], styles.email) }}>
          {textForKey(patient.source)}
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
    countryCode: PropTypes.string,
    email: PropTypes.string,
    discount: PropTypes.number,
  }),
  onSelect: PropTypes.func,
};
