import React, { useState } from 'react';

import clsx from 'clsx';
import { cloneDeep, remove } from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';

import { textForKey } from '../../utils/localization';
import SwitchButton from '../SwitchButton';

function createHoursList() {
  return [].concat(
    ...Array.from(Array(24), (_, hour) => [
      moment({ hour }).format('HH:mm'),
      moment({ hour, minute: 30 }).format('HH:mm'),
    ]),
  );
}
const days = [
  textForKey('Monday'),
  textForKey('Tuesday'),
  textForKey('Wednesday'),
  textForKey('Thursday'),
  textForKey('Friday'),
  textForKey('Saturday'),
  textForKey('Sunday'),
];

const WorkDay = ({ day, onChange }) => {
  const hours = createHoursList();
  const titleClasses = clsx('day-title', day.selected ? 'selected' : 'default');

  const handleDayToggle = () => {
    onChange(day, day.startHour, day.endHour, !day.selected);
  };

  const handleStartHourChange = event => {
    const newValue = event.target.value;
    onChange(
      day,
      newValue === 'choose' ? null : newValue,
      day.endHour,
      day.selected,
    );
  };

  const handleEndHourChange = event => {
    const newValue = event.target.value;
    onChange(
      day,
      day.startHour,
      newValue === 'choose' ? null : newValue,
      day.selected,
    );
  };

  return (
    <div className='doctor-work-hours__day'>
      <SwitchButton isChecked={day.selected} onChange={handleDayToggle} />
      <div className={titleClasses}>{days[day.day]}</div>
      {!day.selected ? (
        <div className='doctor-work-hours__day__day-off'>
          {textForKey('Day off')}
        </div>
      ) : (
        <div className='doctor-work-hours__day__fields'>
          <InputGroup>
            <Form.Control
              as='select'
              className='mr-sm-2'
              id='inlineFormCustomSelect'
              custom
              onChange={handleStartHourChange}
              value={day.startHour}
            >
              <option value='choose'>{textForKey('Chose...')}</option>
              {hours.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Form.Control>
          </InputGroup>
          <div className='separator-text'>{textForKey('to')}</div>
          <InputGroup>
            <Form.Control
              as='select'
              className='mr-sm-2'
              id='inlineFormCustomSelect'
              custom
              onChange={handleEndHourChange}
              value={day.endHour}
            >
              <option value='choose'>{textForKey('Chose...')}</option>
              {hours.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Form.Control>
          </InputGroup>
        </div>
      )}
    </div>
  );
};

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
