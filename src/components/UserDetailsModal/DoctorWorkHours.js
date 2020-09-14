import React, { useState } from 'react';

import clsx from 'clsx';
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

const WorkDay = ({ day }) => {
  const [selected, setSelected] = useState(false);
  const hours = createHoursList();
  const titleClasses = clsx('day-title', selected ? 'selected' : 'default');
  const handleDayToggle = () => {
    setSelected(!selected);
  };
  return (
    <div className='doctor-work-hours__day'>
      <SwitchButton isChecked={selected} onChange={handleDayToggle} />
      <div className={titleClasses}>{day}</div>
      {!selected ? (
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
  const { show } = props;
  const classes = clsx('doctor-work-hours', show ? 'expanded' : 'collapsed');
  return (
    <div className={classes} style={{ height: show ? days.length * 48 : 0 }}>
      {days.map(day => (
        <WorkDay key={day} day={day} />
      ))}
    </div>
  );
};

export default DoctorWorkHours;

DoctorWorkHours.propTypes = {
  show: PropTypes.bool.isRequired,
};
