import React, { useMemo } from 'react';
import orderBy from 'lodash/orderBy';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-polyglot';
import { Role } from 'app/utils/constants';
import DoctorBracesSettings from '../DoctorBracesSettings';
import DoctorCabinets from '../DoctorCabinets';
import DoctorHolidays from '../DoctorHolidays';
import DoctorScheduleCreation from '../DoctorSchedulesCreation';
import DoctorServices from '../DoctorServices';
import DoctorWorkHours from '../DoctorWorkHours';
import styles from './DoctorForm.module.scss';

const DoctorForm = ({
  user,
  data,
  currentClinic,
  onChange,
  onCreateHoliday,
  onDeleteHoliday,
}) => {
  const textForKey = useTranslate();

  const handleServicesChange = (services) => {
    onChange({ services });
  };

  const handleBracesChange = (braces) => {
    onChange({ braces });
  };

  const handleWorkDaysChange = (workdays) => {
    onChange({ workdays });
  };

  const clinicCabinets = useMemo(() => {
    return currentClinic.cabinets;
  }, [currentClinic]);

  const clinicServices = useMemo(() => {
    const activeServices = currentClinic.services.filter(
      (item) => !item.deleted,
    );
    return orderBy(activeServices, 'name', 'asc');
  }, [currentClinic]);

  const clinicBraces = useMemo(() => {
    return orderBy(currentClinic.braces, 'name', 'asc');
  }, []);

  return (
    <div className={styles.doctorForm}>
      <div className={styles.group}>
        <div className={styles.groupHeader}>
          <div className={styles.titleContainer}>
            {textForKey('work hours')}
          </div>
        </div>
        <DoctorWorkHours show data={data} onChange={handleWorkDaysChange} />
      </div>

      <div className={styles.group}>
        <div className={styles.groupHeader}>
          <div className={styles.titleContainer}>{textForKey('holidays')}</div>
        </div>
        <DoctorHolidays
          show
          data={data}
          onCreateOrUpdate={onCreateHoliday}
          onDeleteHoliday={onDeleteHoliday}
        />
      </div>

      <div className={styles.group}>
        <div className={styles.groupHeader}>
          <div className={styles.titleContainer}>
            {textForKey('clinic_cabinets')}
          </div>
        </div>
        <DoctorCabinets clinicCabinets={clinicCabinets} user={user} />
      </div>

      {user.roleInClinic === Role.doctor && (
        <div className={styles.group}>
          <DoctorScheduleCreation user={user} />
        </div>
      )}

      <div className={styles.group}>
        <div className={styles.groupHeader}>
          <div className={styles.titleContainer}>{textForKey('braces')}</div>
        </div>
        <DoctorBracesSettings
          show
          clinicBraces={clinicBraces}
          data={data}
          onChange={handleBracesChange}
        />
      </div>

      <div className={styles.group}>
        <div className={styles.groupHeader}>
          <div className={styles.titleContainer}>
            {textForKey('provided services')}
          </div>
        </div>
        <DoctorServices
          show
          data={data}
          clinicServices={clinicServices}
          onChange={handleServicesChange}
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
