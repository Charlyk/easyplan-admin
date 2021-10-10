import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

import IconMinus from '../../../../icons/iconMinus';
import IconPlusBig from '../../../../icons/iconPlusBig';
import { textForKey } from '../../../../../utils/localization';
import styles from './ServiceDoctors.module.scss';

const ServiceDoctor = dynamic(() => import('../ServiceDoctor'))

const ServiceDoctors = (
  {
    clinic,
    isExpanded,
    showStep,
    onToggle,
    doctors,
    serviceId,
    onDoctorChange,
  }
) => {
  const handleInfoExpand = () => {
    onToggle();
  };

  const contentClasses = clsx(
    styles.content,
    isExpanded ? styles.expanded : styles.collapsed,
  );

  return (
    <div className={styles.serviceDoctors}>
      <div className={styles.header}>
        <div className={styles.title}>
          {showStep && (
            <div className={styles.step}>
              {textForKey('Step 2.')}
            </div>
          )}
          {textForKey('Doctors who provide this service')}
        </div>
      </div>
      <div className={contentClasses}>
        {doctors?.length === 0 && (
          <div className={styles.noData}>
            {textForKey('No doctors yet.')}
          </div>
        )}
        {doctors?.map((doctor) => (
          <ServiceDoctor
            clinic={clinic}
            onChange={onDoctorChange}
            key={doctor.doctorId}
            serviceId={serviceId}
            serviceData={doctor}
          />
        ))}
      </div>
    </div>
  );
};

export default ServiceDoctors;

ServiceDoctors.propTypes = {
  open: PropTypes.bool,
  serviceId: PropTypes.number,
  doctors: PropTypes.arrayOf(
    PropTypes.shape({
      doctorName: PropTypes.string,
      doctorId: PropTypes.number,
      percentage: PropTypes.number,
      price: PropTypes.number,
      selected: PropTypes.bool,
    }),
  ),
  showStep: PropTypes.bool,
  isExpanded: PropTypes.bool,
  onToggle: PropTypes.func,
  onDoctorChange: PropTypes.func,
};