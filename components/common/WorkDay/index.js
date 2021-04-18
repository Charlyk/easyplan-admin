import React from 'react';

import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';

import { createHoursList, days } from '../../../app/utils/constants';
import { textForKey } from '../../../utils/localization';
import SwitchButton from '../SwitchButton';

import styles from '../../../styles/WorkDay.module.scss';

const WorkDay = ({ day, isFirst, onChange, onApplyToAll }) => {
  const hours = createHoursList();
  const titleClasses = clsx(styles['day-title'], day.selected ? styles.selected : styles.default);

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

  const handleApplyToAll = () => {
    onApplyToAll(day);
  };

  return (
    <tr className={styles['work-day']}>
      <td style={{ padding: '.5rem' }}>
        <SwitchButton isChecked={day.selected} onChange={handleDayToggle}/>
      </td>
      <td style={{ width: '20%' }}>
        <div className={titleClasses}>{days[day.day - 1]}</div>
      </td>
      {!day.selected && (
        <td colSpan={4}>
          <div className={styles['work-day__day-off']}>{textForKey('Day off')}</div>
        </td>
      )}
      {day.selected && (
        <td>
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
        </td>
      )}
      {day.selected && (
        <td style={{ padding: '.3rem' }}>
          <Typography noWrap classes={{ root: styles['separator-text'] }}>
            {textForKey('to')}
          </Typography>
        </td>
      )}
      {day.selected && (
        <td>
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
        </td>
      )}
      {day.selected && (
        <td style={{ padding: '.5rem' }}>
          <div
            role='button'
            tabIndex={0}
            onClick={handleApplyToAll}
            className={clsx(
              styles['apply-to-all-btn'],
              (day.startHour == null || day.endHour == null) && styles.disabled,
              !isFirst && styles.hidden,
            )}
          >
            {textForKey('Apply to all')}
          </div>
        </td>
      )}
    </tr>
  );
};

export default WorkDay;

WorkDay.propTypes = {
  isFirst: PropTypes.bool,
  day: PropTypes.shape({
    day: PropTypes.number,
    selected: PropTypes.bool,
    startHour: PropTypes.string,
    endHour: PropTypes.string,
  }),
  onChange: PropTypes.func,
  onApplyToAll: PropTypes.func,
};

WorkDay.defaultProps = {
  onChange: () => null,
  onApplyToAll: () => null,
};
