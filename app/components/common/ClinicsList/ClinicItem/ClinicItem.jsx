import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import IconNext from 'app/components/icons/iconNext';
import { Role } from 'app/utils/constants';
import { environment } from 'eas.config';
import styles from './ClinicItem.module.scss';

const ClinicItem = ({ clinic, onSelected }) => {
  const handleItemClick = () => {
    onSelected(clinic);
  };

  const getRedirectUrl = () => {
    switch (environment) {
      case 'local':
        return '.easyplan.loc';
      case 'testing':
        return '.dev.easyplan.pro';
      default:
        return '.easyplan.pro';
    }
  };

  return (
    <Box className={styles.clinicItemRoot} onClick={handleItemClick}>
      <div className={styles.clinicNameWrapper}>
        <Typography className={styles.clinicName}>
          {clinic.clinicName}
        </Typography>
        <Typography className={styles.clinicUrl}>
          {clinic.clinicDomain}
          {getRedirectUrl()}
        </Typography>
      </div>
      <IconNext circleColor='transparent' />
    </Box>
  );
};

export default ClinicItem;

ClinicItem.propTypes = {
  clinic: PropTypes.shape({
    id: PropTypes.number,
    clinicId: PropTypes.number,
    clinicName: PropTypes.string,
    roleInClinic: PropTypes.oneOf([
      Role.doctor,
      Role.reception,
      Role.admin,
      Role.manager,
    ]),
    clinicLogo: PropTypes.string,
    canRegisterPayments: PropTypes.bool,
    clinicDomain: PropTypes.string,
    accessBlocked: PropTypes.bool,
  }),
  onSelected: PropTypes.func,
};
