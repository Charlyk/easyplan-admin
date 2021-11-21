import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LoadingButton from 'app/components/common/LoadingButton';
import WorkDay from 'app/components/common/WorkDay';
import IconSuccess from 'app/components/icons/iconSuccess';
import NotificationsContext from 'app/context/notificationsContext';
import { textForKey } from 'app/utils/localization';
import { updateClinic } from 'middleware/api/clinic';
import styles from './ClinicWorkingHours.module.scss';

const ClinicWorkingHours = ({ currentClinic: clinic }) => {
  const toast = useContext(NotificationsContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [workdays, setWorkDays] = useState([]);

  useEffect(() => {
    setWorkDays(
      clinic.workdays.map((it) => ({
        ...it,
        selected: !it.isDayOff,
      })),
    );
  }, []);

  const handleDayChange = (day, startHour, endHour, isSelected) => {
    const newDays = workdays.map((workDay) => {
      if (workDay.day !== day.day) {
        return workDay;
      }

      return {
        ...workDay,
        isDayOff: !isSelected || startHour == null || endHour == null,
        startHour: isSelected ? startHour : null,
        endHour: isSelected ? endHour : null,
        selected: isSelected,
      };
    });
    setWorkDays(newDays);
  };

  const submitForm = async () => {
    setIsLoading(true);
    try {
      const requestBody = { ...clinic, workdays };
      await updateClinic(requestBody);
      router.replace(router.asPath);
      toast.success(textForKey('Saved successfully'));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyToAll = (day) => {
    const newDays = workdays.map((workDay) => {
      return {
        ...workDay,
        isDayOff: false,
        startHour: day.startHour,
        endHour: day.endHour,
        selected: true,
      };
    });
    setWorkDays(newDays);
  };

  return (
    <div className={styles['company-working-hours']}>
      <span className={styles['form-title']}>{textForKey('Work Hours')}</span>
      <table className={styles['days-wrapper']}>
        <tbody>
          {workdays.map((day, index) => (
            <WorkDay
              onApplyToAll={handleApplyToAll}
              day={day}
              key={day.day}
              onChange={handleDayChange}
              isFirst={index === 0}
            />
          ))}
        </tbody>
      </table>
      <div className={styles['footer']}>
        <LoadingButton
          onClick={submitForm}
          className={styles.saveButton}
          isLoading={isLoading}
          disabled={isLoading || !clinic}
        >
          {textForKey('Save')}
          {!isLoading && <IconSuccess />}
        </LoadingButton>
      </div>
    </div>
  );
};

export default ClinicWorkingHours;
