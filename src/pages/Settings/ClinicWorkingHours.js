import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import IconSuccess from '../../assets/icons/iconSuccess';
import LoadingButton from '../../components/LoadingButton';
import WorkDay from '../../components/WorkDay';
import { setClinic } from '../../redux/actions/clinicActions';
import { clinicDetailsSelector } from '../../redux/selectors/clinicSelector';
import dataAPI from '../../utils/api/dataAPI';
import { textForKey } from '../../utils/localization';

const ClinicWorkingHours = () => {
  const dispatch = useDispatch();
  const clinic = useSelector(clinicDetailsSelector);
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
    const response = await dataAPI.updateClinic({ ...clinic, workdays });
    console.log(response.data);
    dispatch(setClinic(response.data));
    setIsLoading(false);
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
    <div className='company-working-hours'>
      <span className='form-title'>{textForKey('Work Hours')}</span>
      <table className='days-wrapper'>
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
