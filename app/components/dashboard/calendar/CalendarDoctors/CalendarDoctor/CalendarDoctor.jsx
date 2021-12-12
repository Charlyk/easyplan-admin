import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import IconAvatar from 'app/components/icons/iconAvatar';
import styles from './CalendarDoctor.module.scss';

const CalendarDoctor = ({ doctor, isSelected, onSelect }) => {
  const services = doctor.services.map((item) => item.name).join(', ');

  const handleDoctorClick = () => {
    onSelect(doctor);
  };

  return (
    <Box
      className={clsx(styles.doctorItem, isSelected && styles.selected)}
      onClick={handleDoctorClick}
    >
      <div>
        <IconAvatar />
      </div>
      <div className={styles.nameAndService}>
        <Typography noWrap classes={{ root: styles.doctorName }}>
          {doctor.firstName} {doctor.lastName}
        </Typography>
        <Typography noWrap classes={{ root: styles.serviceName }}>
          {services}
        </Typography>
      </div>
    </Box>
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
