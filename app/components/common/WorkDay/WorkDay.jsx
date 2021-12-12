import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { createHoursList, days } from 'app/utils/constants';
import { textForKey } from 'app/utils/localization';
import EASSelect from '../EASSelect';
import SwitchButton from '../SwitchButton';
import styles from './WorkDay.module.scss';

const WorkDay = ({ day, isFirst, onChange, onApplyToAll }) => {
  const hours = createHoursList();
  const titleClasses = clsx(
    styles.dayTitle,
    day.selected ? styles.selected : styles.default,
  );

  const handleDayToggle = () => {
    onChange(day, day.startHour, day.endHour, !day.selected);
  };

  const handleStartHourChange = (event) => {
    const newValue = event.target.value;
    onChange(
      day,
      newValue === 'choose' ? null : newValue,
      day.endHour,
      day.selected,
    );
  };

  const handleEndHourChange = (event) => {
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

  const getMappedHours = (hours) => {
    return hours.map((item) => ({
      id: item,
      name: item,
    }));
  };

  return (
    <tr className={styles.workDay}>
      <td>
        <SwitchButton isChecked={day.selected} onChange={handleDayToggle} />
      </td>
      <td style={{ width: '20%' }}>
        <div className={titleClasses}>{days[day.day - 1]}</div>
      </td>
      {!day.selected && (
        <td colSpan={4}>
          <div className={styles.dayOff}>{textForKey('Day off')}</div>
        </td>
      )}
      {day.selected && (
        <td>
          <EASSelect
            rootClass={styles.selectRoot}
            value={day.startHour || 'none'}
            onChange={handleStartHourChange}
            defaultOption={{
              id: 'none',
              name: textForKey('Chose...'),
            }}
            options={getMappedHours(hours)}
          />
        </td>
      )}
      {day.selected && (
        <td style={{ padding: '0 .5rem' }}>
          <Typography noWrap classes={{ root: styles.separatorText }}>
            {textForKey('to')}
          </Typography>
        </td>
      )}
      {day.selected && (
        <td>
          <EASSelect
            rootClass={styles.selectRoot}
            value={day.endHour || 'none'}
            onChange={handleEndHourChange}
            defaultOption={{
              id: 'none',
              name: textForKey('Chose...'),
            }}
            options={getMappedHours(hours)}
          />
        </td>
      )}
      {day.selected && (
        <td style={{ paddingLeft: '.5rem' }}>
          <Box
            onClick={handleApplyToAll}
            className={clsx(
              styles.applyToAllBtn,
              (day.startHour == null || day.endHour == null) && styles.disabled,
              !isFirst && styles.hidden,
            )}
          >
            {textForKey('Apply to all')}
          </Box>
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
