import React, { useEffect, useState } from 'react';

import IconSuccess from '../../icons/iconSuccess';
import LoadingButton from '../../common/LoadingButton';
import WorkDay from '../../../src/components/WorkDay';
import { textForKey } from '../../../utils/localization';
import styles from '../../../styles/ClinicWorkingHours.module.scss';
import { toast } from "react-toastify";
import axios from "axios";
import { baseAppUrl } from "../../../eas.config";
import { useRouter } from "next/router";

const ClinicWorkingHours = ({ currentClinic: clinic }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [workdays, setWorkDays] = useState([]);

  useEffect(() => {
    setWorkDays(
      clinic.workdays.map(it => ({
        ...it,
        selected: !it.isDayOff,
      })),
    );
  }, [clinic]);

  const handleDayChange = (day, startHour, endHour, isSelected) => {
    const newDays = workdays.map(workDay => {
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
      const response = await axios.put(`${baseAppUrl}/api/clinic`, requestBody);
      router.replace(router.asPath);
      toast.success(textForKey('Saved successfully'));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyToAll = day => {
    const newDays = workdays.map(workDay => {
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
          className='positive-button'
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
