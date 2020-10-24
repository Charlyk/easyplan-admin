import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';

import IconSuccess from '../../assets/icons/iconSuccess';
import LoadingButton from '../../components/LoadingButton';
import WorkDay from '../../components/WorkDay';
import { userSelector } from '../../redux/selectors/rootSelector';
import dataAPI from '../../utils/api/dataAPI';
import { textForKey } from '../../utils/localization';

const ClinicWorkingHours = props => {
  const currentUser = useSelector(userSelector);
  const [isLoading, setIsLoading] = useState(false);
  const [clinic, setClinic] = useState(null);

  useEffect(() => {
    fetchClinicDetails();
  }, [props, currentUser]);

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

  const handleApplyToAll = day => {
    const newDays = clinic.workDays.map(workDay => {
      return {
        ...workDay,
        isDayOff: false,
        startHour: day.startHour,
        endHour: day.endHour,
        selected: true,
      };
    });
    setClinic({ ...clinic, workDays: newDays });
  };

  return (
    <div className='company-working-hours'>
      <span className='form-title'>{textForKey('Work Hours')}</span>
      <table className='days-wrapper'>
        <tbody>
          {clinic?.workDays.map((day, index) => (
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
