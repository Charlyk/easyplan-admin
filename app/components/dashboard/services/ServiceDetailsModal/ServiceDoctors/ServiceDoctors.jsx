import React from 'react';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { textForKey } from 'app/utils/localization';
import styles from './ServiceDoctors.module.scss';

const ServiceDoctor = dynamic(() => import('../ServiceDoctor'));

const ServiceDoctors = ({
  clinic,
  isExpanded,
  showStep,
  doctors,
  serviceId,
  onDoctorChange,
}) => {
  const contentClasses = clsx(
    styles.content,
    isExpanded ? styles.expanded : styles.collapsed,
  );

  return (
    <div className={styles.serviceDoctors}>
      <div className={styles.header}>
        <div className={styles.title}>
          {showStep && (
            <div className={styles.step}>{textForKey('Step 2.')}</div>
          )}
          {textForKey('Doctors who provide this service')}
        </div>
      </div>
      <div className={contentClasses}>
        {doctors?.length === 0 && (
          <div className={styles.noData}>{textForKey('No doctors yet.')}</div>
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
