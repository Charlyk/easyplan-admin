import React, { useEffect, useState } from 'react';

import IconSuccess from '../../assets/icons/iconSuccess';
import LoadingButton from '../../components/LoadingButton';
import WorkDay from '../../components/WorkDay';
import dataAPI from '../../utils/api/dataAPI';
import { days } from '../../utils/constants';
import { textForKey } from '../../utils/localization';

const ClinicWorkingHours = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [clinic, setClinic] = useState(null);

  useEffect(() => {
    fetchClinicDetails();
  }, [props]);

  const handleDayChange = (day, startHour, endHour, isSelected) => {
    const newDays = clinic.workDays.map(workDay => {
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
    setClinic({ ...clinic, workDays: newDays });
  };

  const fetchClinicDetails = async () => {
    setIsLoading(true);
    const response = await dataAPI.fetchClinicDetails();
    if (response.isError) {
      console.error(response.message);
    } else {
      setClinic({
        ...response.data,
        workDays: response.data.workDays.map(item => ({
          ...item,
          selected: !item.isDayOff,
        })),
      });
    }
    setIsLoading(false);
  };

  const submitForm = async () => {
    setIsLoading(true);
    const response = await dataAPI.updateClinic(clinic);
    setClinic({
      ...response.data,
      workDays: response.data.workDays.map(item => ({
        ...item,
        selected: !item.isDayOff,
      })),
    });
    setIsLoading(false);
  };

  return (
    <div className='company-working-hours'>
      <span className='form-title'>{textForKey('Work Hours')}</span>
      <div className='days-wrapper'>
        {clinic?.workDays.map(day => (
          <WorkDay day={day} key={day.day} onChange={handleDayChange} />
        ))}
      </div>
      <div className='footer'>
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
