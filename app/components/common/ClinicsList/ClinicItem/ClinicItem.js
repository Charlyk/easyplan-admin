import React from "react";
import PropTypes from 'prop-types';
import { Typography } from "@material-ui/core";

import { Role } from "../../../../utils/constants";
import IconNext from "../../../../../components/icons/iconNext";
import { environment } from "../../../../../eas.config";
import styles from './ClinicItem.module.scss'

const ClinicItem = ({ clinic, onSelected }) => {

  const handleItemClick = () => {
    onSelected(clinic);
  }

  const getRedirectUrl = () => {
    switch (environment) {
      case 'local':
        return '.easyplan.loc';
      case 'testing':
        return '.dev.easyplan.pro';
      default:
        return '.easyplan.pro';
    }
  }

  return (
    <div className={styles.clinicItemRoot} onClick={handleItemClick}>
      <div className={styles.clinicNameWrapper}>
        <Typography className={styles.clinicName}>
          {clinic.clinicName}
        </Typography>
        <Typography className={styles.clinicUrl}>
          {clinic.clinicDomain}{getRedirectUrl()}
        </Typography>
      </div>
      <IconNext circleColor='transparent' />
    </div>
  )
}

export default ClinicItem;

ClinicItem.propTypes = {
  clinic: PropTypes.shape({
    id: PropTypes.number,
    clinicId: PropTypes.number,
    clinicName: PropTypes.string,
    roleInClinic: PropTypes.oneOf(
      [Role.doctor, Role.reception, Role.admin, Role.manager]
    ),
    clinicLogo: PropTypes.string,
    canRegisterPayments: PropTypes.bool,
    clinicDomain: PropTypes.string
  }),
  onSelected: PropTypes.func,
}
