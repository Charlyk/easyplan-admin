import React, { useState } from 'react';

import PropTypes from 'prop-types';

import IconMinus from '../../assets/icons/iconMinus';
import IconPlusBig from '../../assets/icons/iconPlusBig';
import { textForKey } from '../../utils/localization';
import DoctorAccountForm from './DoctorAccountForm';
import DoctorHolidays from './DoctorHolidays';
import DoctorServices from './DoctorServices';
import DoctorWorkHours from './DoctorWorkHours';

const GroupType = {
  account: 'Account',
  services: 'Services',
  workHours: 'Work Hours',
  holidays: 'Holidays',
};

const DoctorForm = props => {
  const [expandedGroup, setExpandedGroup] = useState(GroupType.account);
  const showStep = true;

  const handleToggleForm = formId => {
    setExpandedGroup(formId);
  };

  return (
    <div className='doctor-form'>
      <div className='doctor-form__group'>
        <div className='doctor-form__group-header'>
          <div className='doctor-form__group-header__title-container'>
            {showStep && (
              <div className='doctor-form__group-header__step'>
                {textForKey('Step 1.')}
              </div>
            )}
            {textForKey('Account information')}
          </div>
          <div
            tabIndex={0}
            role='button'
            className='doctor-form__group-header__button'
            onClick={() => handleToggleForm(GroupType.account)}
          >
            {expandedGroup === GroupType.account ? (
              <IconMinus />
            ) : (
              <IconPlusBig />
            )}
          </div>
        </div>
        <DoctorAccountForm show={expandedGroup === GroupType.account} />
      </div>

      <div className='doctor-form__group'>
        <div className='doctor-form__group-header'>
          <div className='doctor-form__group-header__title-container'>
            {showStep && (
              <div className='doctor-form__group-header__step'>
                {textForKey('Step 2.')}
              </div>
            )}
            {textForKey('Provided services')}
          </div>
          <div
            tabIndex={0}
            role='button'
            className='doctor-form__group-header__button'
            onClick={() => handleToggleForm(GroupType.services)}
          >
            {expandedGroup === GroupType.services ? (
              <IconMinus />
            ) : (
              <IconPlusBig />
            )}
          </div>
        </div>
        <DoctorServices show={expandedGroup === GroupType.services} />
      </div>

      <div className='doctor-form__group'>
        <div className='doctor-form__group-header'>
          <div className='doctor-form__group-header__title-container'>
            {showStep && (
              <div className='doctor-form__group-header__step'>
                {textForKey('Step 3.')}
              </div>
            )}
            {textForKey('Work hours')}
          </div>
          <div
            tabIndex={0}
            role='button'
            className='doctor-form__group-header__button'
            onClick={() => handleToggleForm(GroupType.workHours)}
          >
            {expandedGroup === GroupType.workHours ? (
              <IconMinus />
            ) : (
              <IconPlusBig />
            )}
          </div>
        </div>
        <DoctorWorkHours show={expandedGroup === GroupType.workHours} />
      </div>

      <div className='doctor-form__group'>
        <div className='doctor-form__group-header'>
          <div className='doctor-form__group-header__title-container'>
            {showStep && (
              <div className='doctor-form__group-header__step'>
                {textForKey('Step 4.')}
              </div>
            )}
            {textForKey('Holidays')}
          </div>
          <div
            tabIndex={0}
            role='button'
            className='doctor-form__group-header__button'
            onClick={() => handleToggleForm(GroupType.holidays)}
          >
            {expandedGroup === GroupType.holidays ? (
              <IconMinus />
            ) : (
              <IconPlusBig />
            )}
          </div>
        </div>
        <DoctorHolidays show={expandedGroup === GroupType.holidays} />
      </div>
    </div>
  );
};

export default DoctorForm;

DoctorForm.propTypes = {};
