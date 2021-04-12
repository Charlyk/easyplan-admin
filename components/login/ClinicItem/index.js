import React from "react";
import PropTypes from 'prop-types';
import { Role } from "../../../utils/constants";
import { Typography } from "@material-ui/core";
import styles from '../../../styles/auth/ClinicItem.module.scss'
import IconNext from "../../icons/iconNext";

const ClinicItem = ({ clinic, onSelected }) => {

  const handleItemClick = () => {
    onSelected(clinic);
  }

  return (
    <div className={styles.clinicItemRoot} onClick={handleItemClick}>
      <div className={styles.clinicNameWrapper}>
        <Typography className={styles.clinicName}>
          {clinic.clinicName}
        </Typography>
        <Typography className={styles.clinicUrl}>
          {clinic.clinicDomain}.easyplan.pro
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
