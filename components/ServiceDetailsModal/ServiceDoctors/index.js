import React from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import IconMinus from '../../icons/iconMinus';
import IconPlusBig from '../../icons/iconPlusBig';
import { textForKey } from '../../../utils/localization';
import ServiceDoctor from '../ServiceDoctor';
import styles from '../../../styles/ServiceDoctors.module.scss';

const ServiceDoctors = ({
  isExpanded,
  showStep,
  onToggle,
  doctors,
  serviceId,
  onDoctorChange,
}) => {
  const handleInfoExpand = () => {
    onToggle();
  };

  const contentClasses = clsx(
    styles['service-doctors__content'],
    isExpanded ? styles.expanded : styles.collapsed,
  );

  return (
    <div className={styles['service-doctors']}>
      <div className={styles['service-doctors__header']}>
        <div className={styles['service-doctors__header__title']}>
          {showStep && (
            <div className={styles['service-doctors__header__step']}>
              {textForKey('Step 2.')}
            </div>
          )}
          {textForKey('Doctors who provide this service')}
        </div>
        <div
          tabIndex={0}
          role='button'
          className={styles['service-doctors__header__button']}
          onClick={handleInfoExpand}
        >
          {isExpanded ? <IconMinus /> : <IconPlusBig />}
        </div>
      </div>
      <div className={contentClasses}>
        {doctors?.length === 0 && (
          <div className={styles['service-doctors__content__no-data']}>
            {textForKey('No doctors yet.')}
          </div>
        )}
        {doctors?.map((doctor) => (
          <ServiceDoctor
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
