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
  const { data, onChange, showSteps, onCreateHoliday, onDeleteHoliday } = props;
  const [expandedGroup, setExpandedGroup] = useState(GroupType.account);

  const handleToggleForm = formId => {
    setExpandedGroup(formId);
  };

  const handleAccountInfoChange = newData => {
    onChange(newData);
  };

  const handleServicesChange = services => {
    onChange({ services });
  };

  const handleWorkDaysChange = workDays => {
    onChange({ workDays });
  };

  return (
    <div className='doctor-form'>
      <div className='doctor-form__group'>
        <div className='doctor-form__group-header'>
          <div className='doctor-form__group-header__title-container'>
            {showSteps && (
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
        <DoctorAccountForm
          show={expandedGroup === GroupType.account}
          onChange={handleAccountInfoChange}
          data={data}
        />
      </div>

      <div className='doctor-form__group'>
        <div className='doctor-form__group-header'>
          <div className='doctor-form__group-header__title-container'>
            {showSteps && (
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
        <DoctorServices
          data={data}
          onChange={handleServicesChange}
          show={expandedGroup === GroupType.services}
        />
      </div>

      <div className='doctor-form__group'>
        <div className='doctor-form__group-header'>
          <div className='doctor-form__group-header__title-container'>
            {showSteps && (
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
        <DoctorWorkHours
          onChange={handleWorkDaysChange}
          data={data}
          show={expandedGroup === GroupType.workHours}
        />
      </div>

      <div className='doctor-form__group'>
        <div className='doctor-form__group-header'>
          <div className='doctor-form__group-header__title-container'>
            {showSteps && (
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
        <DoctorHolidays
          data={data}
          show={expandedGroup === GroupType.holidays}
          onCreateOrUpdate={onCreateHoliday}
          onDeleteHoliday={onDeleteHoliday}
        />
      </div>
    </div>
  );
};

export default DoctorForm;

DoctorForm.propTypes = {
  onChange: PropTypes.func,
  onCreateHoliday: PropTypes.func,
  onDeleteHoliday: PropTypes.func,
  showSteps: PropTypes.bool,
  data: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    avatarFile: PropTypes.object,
    holidays: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        startDate: PropTypes.string,
        endDate: PropTypes.string,
        description: PropTypes.string,
      }),
    ),
    services: PropTypes.arrayOf(
      PropTypes.shape({
        serviceId: PropTypes.string,
        price: PropTypes.number,
        percentage: PropTypes.number,
      }),
    ),
    workDays: PropTypes.arrayOf(
      PropTypes.shape({
        day: PropTypes.number,
        endHour: PropTypes.string,
        startHour: PropTypes.string,
        isDayOff: PropTypes.bool,
      }),
    ),
  }).isRequired,
};
