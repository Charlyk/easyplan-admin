import React from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';

import { createHoursList, days } from '../../utils/constants';
import { textForKey } from '../../utils/localization';
import SwitchButton from '../SwitchButton';
import './styles.scss';

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
    <div className='work-day'>
      <SwitchButton isChecked={day.selected} onChange={handleDayToggle} />
      <div className={titleClasses}>{days[day.day - 1]}</div>
      {!day.selected ? (
        <div className='work-day__day-off'>{textForKey('Day off')}</div>
      ) : (
        <div className='work-day__fields'>
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

export default WorkDay;

WorkDay.propTypes = {
  day: PropTypes.shape({
    day: PropTypes.number,
    selected: PropTypes.bool,
    startHour: PropTypes.string,
    endHour: PropTypes.string,
  }),
  onChange: PropTypes.func,
};

WorkDay.defaultProps = {
  onChange: () => null,
};
