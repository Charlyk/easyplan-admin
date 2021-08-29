import React, { useMemo } from 'react';
import sortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';

import { textForKey } from '../../../../../../utils/localization';
import DoctorBracesSettings from '../DoctorBracesSettings';
import DoctorHolidays from '../DoctorHolidays';
import DoctorServices from '../DoctorServices';
import DoctorWorkHours from '../DoctorWorkHours';
import styles from './DoctorForm.module.scss';

const DoctorForm = ({ data, currentClinic, onChange, onCreateHoliday, onDeleteHoliday }) => {
  const handleServicesChange = services => {
    onChange({ services });
  };

  const handleBracesChange = braces => {
    onChange({ braces });
  };

  const handleWorkDaysChange = workdays => {
    onChange({ workdays });
  };

  const clinicServices = useMemo(() => {
    const activeServices = currentClinic.services.filter(item => !item.deleted);
    return sortBy(activeServices, item => item.name.toLowerCase());
  }, [currentClinic]);

  const clinicBraces = useMemo(() => {
    return currentClinic.braces
  }, []);

  return (
    <div className={styles['doctor-form']}>
      <div className={styles['doctor-form__group']}>
        <div className={styles['doctor-form__group-header']}>
          <div className={styles['doctor-form__group-header__title-container']}>
            {textForKey('Work hours')}
          </div>
        </div>
        <DoctorWorkHours show data={data} onChange={handleWorkDaysChange} />
      </div>

      <div className={styles['doctor-form__group']}>
        <div className={styles['doctor-form__group-header']}>
          <div className={styles['doctor-form__group-header__title-container']}>
            {textForKey('Holidays')}
          </div>
        </div>
        <DoctorHolidays
          show
          data={data}
          onCreateOrUpdate={onCreateHoliday}
          onDeleteHoliday={onDeleteHoliday}
        />
      </div>

      <div className={styles['doctor-form__group']}>
        <div className={styles['doctor-form__group-header']}>
          <div className={styles['doctor-form__group-header__title-container']}>
            {textForKey('Braces')}
          </div>
        </div>
        <DoctorBracesSettings show clinicBraces={clinicBraces} data={data} onChange={handleBracesChange} />
      </div>

      <div className={styles['doctor-form__group']}>
        <div className={styles['doctor-form__group-header']}>
          <div className={styles['doctor-form__group-header__title-container']}>
            {textForKey('Provided services')}
          </div>
        </div>
        <DoctorServices show data={data} clinicServices={clinicServices} onChange={handleServicesChange} />
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
        id: PropTypes.number,
        startDate: PropTypes.string,
        endDate: PropTypes.string,
        description: PropTypes.string,
      }),
    ),
    services: PropTypes.arrayOf(
      PropTypes.shape({
        serviceId: PropTypes.number,
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
