import React from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import { days } from '../../../../utils/constants';
import WorkDay from '../../../common/WorkDay';
import styles from '../../../../styles/DoctorWorkHours.module.scss';

const DoctorWorkHours = props => {
  const { show, data, onChange } = props;

  const handleDayChange = (day, startHour, endHour, isSelected) => {
    const newDays = data.workdays.map(item => {
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

  const handleApplyToAll = day => {
    const newDays = data.workdays.map(item => {
      return {
        ...item,
        startHour: day.startHour,
        endHour: day.endHour,
        selected: true,
      };
    });

    onChange(newDays);
  };

  const classes = clsx(styles['doctor-work-hours'], show ? styles.expanded : styles.collapsed);
  return (
    <div className={classes} style={{ height: show ? days.length * 48 : 0 }}>
      <table>
        <tbody>
          {data.workdays.map((day, index) => (
            <WorkDay
              onApplyToAll={handleApplyToAll}
              key={day.day}
              day={day}
              onChange={handleDayChange}
              isFirst={index === 0}
            />
          ))}
        </tbody>
      </table>
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
    workdays: PropTypes.arrayOf(
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
