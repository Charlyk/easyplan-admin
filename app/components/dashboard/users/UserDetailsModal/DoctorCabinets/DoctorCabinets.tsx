import React from 'react';
import { ClinicCabinet } from 'types';
import styles from './DoctorCabinets.module.scss';

interface Props {
  clinicCabinets: ClinicCabinet[];
}

const DoctorCabinets: React.FC<Props> = () => {
  return (
    <div className={styles.wrapper}>
      <h3>This is Cabinets Info</h3>
    </div>
  );
};

export default DoctorCabinets;
