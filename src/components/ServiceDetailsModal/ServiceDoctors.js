import React from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import IconMinus from '../../assets/icons/iconMinus';
import IconPlusBig from '../../assets/icons/iconPlusBig';
import { textForKey } from '../../utils/localization';
import ServiceDoctor from './ServiceDoctor';

const ServiceDoctors = props => {
  const { isExpanded, showStep, onToggle, doctors } = props;

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
      <div className={contentClasses}>
        {doctors.length === 0 && (
          <div className='service-doctors__content__no-data'>
            {textForKey('There are not doctors yet.')}{' '}
            <Link to='/users'>{textForKey('Add one +')}</Link>
          </div>
        )}
        {doctors.map(doctor => (
          <ServiceDoctor doctor={doctor} />
        ))}
      </div>
    </div>
  );
};

export default ServiceDoctors;

ServiceDoctors.propTypes = {
  doctors: PropTypes.arrayOf(
    PropTypes.shape({
      doctorName: PropTypes.string,
      doctorId: PropTypes.string,
      percentage: PropTypes.string,
      price: PropTypes.string,
    }),
  ),
  showStep: PropTypes.bool,
  isExpanded: PropTypes.bool,
  onToggle: PropTypes.func,
};