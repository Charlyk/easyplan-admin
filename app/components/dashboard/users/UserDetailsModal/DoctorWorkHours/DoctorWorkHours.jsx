import React from 'react';
import PropTypes from 'prop-types';
import WorkDay from 'app/components/common/WorkDay';
import styles from './DoctorWorkHours.module.scss';

const DoctorWorkHours = ({ data, onChange }) => {
  const handleDayChange = (day, startHour, endHour, isSelected) => {
    const newDays = data.workdays.map((item) => {
      if (item.day !== day.day) return item;

      return {
        ...item,
        startHour,
        endHour,
        isDayOff: !isSelected || startHour == null || endHour == null,
        selected: isSelected,
      };
    });

    onChange(newDays);
  };

  const handleApplyToAll = (day) => {
    const newDays = data.workdays.map((item) => {
      return {
        ...item,
        startHour: day.startHour,
        endHour: day.endHour,
        isDayOff: day.isDayOff,
        selected: day.selected,
      };
    });

    onChange(newDays);
  };

  return (
    <div className={styles.doctorWorkHours}>
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
