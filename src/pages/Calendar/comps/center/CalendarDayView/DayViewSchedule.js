import React from 'react';

import { Tooltip, Typography } from '@material-ui/core';
import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';

import { Statuses } from '../../../../../utils/constants';
import { colorShade } from '../../../../../utils/helperFuncs';
import { textForKey } from '../../../../../utils/localization';

const offsetDistance = 30;
const minScheduleHeight = 30;

const DayViewSchedule = ({
  schedule,
  index,
  viewDate,
  firstHour,
  onScheduleSelect,
}) => {
  const startTime = moment(schedule.startTime);
  const endTime = moment(schedule.endTime);
  const startHour = startTime.format('HH:mm');
  const endHour = endTime.format('HH:mm');
  const scheduleStatus = Statuses.find(
    item => item.id === schedule.scheduleStatus,
  );
  const shouldAnimate = scheduleStatus.id === 'WaitingForPatient';

  const getScheduleHeight = () => {
    const startTime = moment(schedule.startTime);
    const endTime = moment(schedule.endTime);
    const scheduleDuration = moment
      .duration(endTime.diff(startTime))
      .asMinutes();
    return scheduleDuration * 2;
  };

  const getTopPosition = () => {
    const startTime = moment(schedule.startTime);
    const firstHourComps = firstHour.split(':');
    const clinicStartTime = moment(viewDate).set({
      hour: parseInt(firstHourComps[0]),
      minute: parseInt(firstHourComps[1]),
      second: 0,
    });
    const scheduleDayDuration = moment
      .duration(startTime.diff(clinicStartTime))
      .asMinutes();
    const newTop = scheduleDayDuration * 2 + minScheduleHeight;
    return newTop;
  };

  const handleScheduleClick = () => {
    onScheduleSelect(schedule);
  };

  return (
    <div
      role='button'
      tabIndex={0}
      className={clsx(
        'day-view-schedule',
        shouldAnimate && 'upcoming',
        schedule.isUrgent && 'urgent',
      )}
      onClick={handleScheduleClick}
      style={{
        left: `calc(${schedule.offset} * ${offsetDistance}px)`,
        width: `calc(99.5% - ${schedule.offset} * ${offsetDistance}px)`,
        top: getTopPosition(),
        zIndex: 100 + index,
        height: getScheduleHeight(),
      }}
    >
      <div
        className='day-view-schedule__status-indicator'
        style={{ backgroundColor: scheduleStatus.color }}
      />
      <div className='day-view-schedule__wrapper'>
        <Tooltip
          placement='top'
          title={`${startHour} - ${endHour} ${schedule.patient.fullName}`}
        >
          <div className='header'>
            <Typography noWrap classes={{ root: 'hour-label' }}>
              {startHour} - {endHour} {schedule.patient.fullName}
            </Typography>
            {scheduleStatus.statusIcon != null && (
              <div
                className={clsx(
                  'status-icon',
                  (scheduleStatus.id === 'DidNotCome' ||
                    scheduleStatus.id === 'Canceled') &&
                    'negative',
                )}
              >
                {scheduleStatus.statusIcon}
              </div>
            )}
          </div>
        </Tooltip>
        <div className='info'>
          <table>
            <tbody>
              <tr>
                <td
                  valign='top'
                  style={{ paddingLeft: '.5rem', paddingRight: '.5rem' }}
                >
                  <Typography classes={{ root: 'info-title' }}>
                    {textForKey('Service')}:
                  </Typography>
                </td>
                <td
                  valign='top'
                  style={{ paddingLeft: '.5rem', paddingRight: '.5rem' }}
                >
                  <Typography classes={{ root: 'info-label' }}>
                    {schedule.serviceName}
                  </Typography>
                </td>
              </tr>
              <tr>
                <td
                  valign='top'
                  style={{ paddingLeft: '.5rem', paddingRight: '.5rem' }}
                >
                  <Typography classes={{ root: 'info-title' }}>
                    {textForKey('Patient')}:
                  </Typography>
                </td>
                <td
                  valign='top'
                  style={{ paddingLeft: '.5rem', paddingRight: '.5rem' }}
                >
                  <Typography classes={{ root: 'info-label' }}>
                    {schedule.patient.fullName}
                  </Typography>
                </td>
              </tr>
              <tr>
                <td
                  valign='top'
                  style={{ paddingLeft: '.5rem', paddingRight: '.5rem' }}
                >
                  <Typography classes={{ root: 'info-title' }}>
                    {textForKey('Status')}:
                  </Typography>
                </td>
                <td
                  valign='top'
                  style={{ paddingLeft: '.5rem', paddingRight: '.5rem' }}
                >
                  <Typography classes={{ root: 'info-label' }}>
                    {scheduleStatus.name}
                  </Typography>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DayViewSchedule;

DayViewSchedule.propTypes = {
  schedule: PropTypes.shape({
    id: PropTypes.number,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    scheduleStatus: PropTypes.string,
    serviceColor: PropTypes.string,
    serviceName: PropTypes.string,
    isUrgent: PropTypes.bool,
    offset: PropTypes.number,
    patient: PropTypes.shape({
      id: PropTypes.number,
      fullName: PropTypes.string,
    }),
  }).isRequired,
  startHour: PropTypes.string,
  endHour: PropTypes.string,
  parentTop: PropTypes.number,
  index: PropTypes.number,
  onScheduleSelect: PropTypes.func,
  firstHour: PropTypes.string,
  viewDate: PropTypes.instanceOf(Date),
};

DayViewSchedule.defaultProps = {
  startHour: '12:00',
  endHour: '13:30',
  parentTop: 0,
  index: 0,
  onScheduleSelect: () => null,
};
