import React from 'react';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-polyglot';
import { useSelector } from 'react-redux';
import { currentClinicSelector } from 'redux/selectors/appDataSelector';
import styles from './ServiceDoctors.module.scss';

const ServiceDoctor = dynamic(() => import('../ServiceDoctor'));

const ServiceDoctors = ({
  isExpanded,
  showStep,
  doctors,
  serviceId,
  onDoctorChange,
}) => {
  const textForKey = useTranslate();
  const clinic = useSelector(currentClinicSelector);
  const contentClasses = clsx(
    styles.content,
    isExpanded ? styles.expanded : styles.collapsed,
  );

  return (
    <div className={styles.serviceDoctors}>
      <div className={styles.header}>
        <div className={styles.title}>
          {showStep && (
            <div className={styles.step}>{textForKey('step 3.')}</div>
          )}
          {textForKey('doctors who provide this service')}
        </div>
      </div>
      <div className={contentClasses}>
        {doctors?.length === 0 && (
          <div className={styles.noData}>{textForKey('no doctors yet.')}</div>
        )}
        {doctors?.map((doctor) => (
          <ServiceDoctor
            clinic={clinic}
            onChange={onDoctorChange}
            key={doctor.id}
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
      fullName: PropTypes.string,
      id: PropTypes.number,
      percentage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      selected: PropTypes.bool,
    }),
  ),
  showStep: PropTypes.bool,
  isExpanded: PropTypes.bool,
  onToggle: PropTypes.func,
  onDoctorChange: PropTypes.func,
};
