import React from 'react';
import { useSelector } from 'react-redux';
import styles from './ClinicSettings.module.scss';
import { clinicSettingsSelector } from './ClinicSettings.selector';

const ClinicSettings: React.FC = () => {
  const { settings } = useSelector(clinicSettingsSelector);
  return (
    <div className={styles.clinicSettings}>
      <div />
    </div>
  );
};

export default ClinicSettings;
