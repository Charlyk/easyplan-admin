import React from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import { days } from '../../utils/constants';
import WorkDay from '../WorkDay';

const DoctorWorkHours = props => {
  const { show, data, onChange } = props;

  const handleDayChange = (day, startHour, endHour, isSelected) => {
    const newDays = data.workDays.map(item => {
      if (item.day !== day.day) return item;
      return {
        ...item,
        startHour,
        endHour,
        selected: isSelected,
      };
    });

    onChange(newDays);
  };

  const classes = clsx('doctor-work-hours', show ? 'expanded' : 'collapsed');
  return (
    <div className={classes} style={{ height: show ? days.length * 48 : 0 }}>
      {data.workDays.map(day => (
        <WorkDay key={day.day} day={day} onChange={handleDayChange} />
      ))}
    </div>
  );
};

export default DoctorWorkHours;

WorkDay.propTypes = {
  onChange: PropTypes.func,
  day: PropTypes.shape({
    day: PropTypes.number,
    startHour: PropTypes.string,
    endHour: PropTypes.string,
    selected: false,
  }),
};

DoctorWorkHours.propTypes = {
  show: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    avatarFile: PropTypes.object,
    workDays: PropTypes.arrayOf(
      PropTypes.shape({
        day: PropTypes.number,
        startHour: PropTypes.string,
        endHour: PropTypes.string,
        selected: false,
      }),
    ),
  }),
  onChange: PropTypes.func,
};
