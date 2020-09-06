import React from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import IconMinus from '../../assets/icons/iconMinus';
import IconPlusBig from '../../assets/icons/iconPlusBig';
import { textForKey } from '../../utils/localization';
import ServiceDoctor from './ServiceDoctor';

const ServiceDoctors = props => {
  const { isExpanded, showStep, onToggle } = props;

  const handleInfoExpand = () => {
    onToggle();
  };

  const contentClasses = clsx(
    'service-doctors__content',
    isExpanded ? 'expanded' : 'collapsed',
  );

  return (
    <div className='service-doctors'>
      <div className='service-doctors__header'>
        <div className='service-information__header__title'>
          {showStep && (
            <div className='service-information__header__step'>
              {textForKey('Step 2.')}
            </div>
          )}
          {textForKey('Doctors who provide this service')}
        </div>
        <div
          tabIndex={0}
          role='button'
          className='service-information__header__button'
          onClick={handleInfoExpand}
        >
          {isExpanded ? <IconMinus /> : <IconPlusBig />}
        </div>
      </div>
      <div
        className={contentClasses}
        style={{ height: isExpanded ? '17rem' : 0 }}
      >
        <ServiceDoctor />
        <ServiceDoctor />
        <ServiceDoctor />
        <ServiceDoctor />
        <ServiceDoctor />
        <ServiceDoctor />
        <ServiceDoctor />
        <ServiceDoctor />
      </div>
    </div>
  );
};

export default ServiceDoctors;

ServiceDoctors.propTypes = {
  showStep: PropTypes.bool,
  isExpanded: PropTypes.bool,
  onToggle: PropTypes.func,
};
