import React, { useEffect, useMemo, useState } from 'react';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { animated, useSpring } from 'react-spring';
import areComponentPropsEqual from 'app/utils/areComponentPropsEqual';
import { updateHourIndicatorPositionSelector } from 'redux/selectors/rootSelector';
import styles from './HourIndicator.module.scss';

const HourIndicator = ({ dayHours, viewDate, disabled }) => {
  const [hideIndicator, setHideIndicator] = useState(disabled);
  const [isMounted, setIsMounted] = useState(false);
  const updateHourIndicator = useSelector(updateHourIndicatorPositionSelector);
  const initialHourIndicatorTop = getHourIndicatorTop();
  const [{ hourTop }, set] = useSpring(() => ({
    hourTop: initialHourIndicatorTop || 0,
  }));

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (disabled) {
      return;
    }
    if (isOutOfBounds(new Date())) {
      if (!hideIndicator) {
        setHideIndicator(true);
      }
    } else {
      if (hideIndicator) {
        setHideIndicator(false);
      }
      updateHourIndicatorTop();
    }
  }, [dayHours, viewDate, disabled]);

  useEffect(() => {
    if (disabled) {
      return;
    }
    updateHourIndicatorTop();
  }, [updateHourIndicator, disabled]);

  const lastHourDate = useMemo(() => {
    const lastHour = dayHours[dayHours.length - 1];
    if (lastHour == null) {
      return moment();
    }
    const [maxHour, maxMinute] = lastHour.split(':');
    return moment(viewDate)
      .set('hour', parseInt(maxHour))
      .set('minute', parseInt(maxMinute));
  }, [dayHours, viewDate]);

  const firstHourDate = useMemo(() => {
    const firstHour = dayHours[0];
    if (firstHour == null) {
      return moment();
    }
    const [maxHour, maxMinute] = firstHour.split(':');
    return moment(viewDate)
      .set('hour', parseInt(maxHour))
      .set('minute', parseInt(maxMinute));
  }, [dayHours, viewDate]);

  const isOutOfBounds = (time) => {
    if (dayHours.length === 0) {
      return true;
    }
    const scheduleTime = moment(time);
    return !scheduleTime.isBetween(firstHourDate, lastHourDate);
  };

  const updateHourIndicatorTop = () => {
    const newTop = getHourIndicatorTop();
    set({ hourTop: newTop });
  };

  function getHourIndicatorTop() {
    if (dayHours == null || dayHours.length === 0) {
      return 0;
    }
    const firstHour = dayHours[0];
    if (firstHour == null) {
      return 0;
    }
    const startTime = moment();
    const [hours, minutes] = firstHour.split(':');
    const clinicStartTime = moment(viewDate).set({
      hour: parseInt(hours),
      minute: parseInt(minutes),
      second: 0,
    });
    const scheduleDayDuration = moment
      .duration(startTime.diff(clinicStartTime))
      .asMinutes();
    const newTop = scheduleDayDuration * 2 + 30;
    return Math.abs(newTop - 8);
  }

  const hourTopInterpolator = (newTop) => {
    return `${newTop}px`;
  };

  if (hideIndicator || disabled || !isMounted) {
    return null;
  }

  return (
    <animated.div
      className={styles.hourIndicatorRoot}
      style={{
        top: hourTop.to(hourTopInterpolator),
      }}
    >
      <div className={styles.hourLabel}>{moment().format('HH:mm')}</div>
      <div className={styles.line} />
    </animated.div>
  );
};

export default React.memo(HourIndicator, areComponentPropsEqual);

HourIndicator.propTypes = {
  disabled: PropTypes.bool,
  dayHours: PropTypes.arrayOf(PropTypes.string).isRequired,
  viewDate: PropTypes.instanceOf(Date).isRequired,
};

HourIndicator.defaultProps = {
  disabled: false,
  dayHours: [],
  viewDate: new Date(),
};
