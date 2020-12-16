import React, { useEffect, useState } from 'react';

import {
  Table,
  TableHead,
  TableBody,
  TableContainer,
  TableRow,
  TableCell,
} from '@material-ui/core';
import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';

import { Action } from '../../../../../utils/constants';
import {
  getCurrentWeek,
  logUserAction,
} from '../../../../../utils/helperFuncs';
import CalendarWeekDayView from './CalendarWeekDayView';

const CalendarWeekView = ({
  opened,
  doctorId,
  viewDate,
  onDateClick,
  selectedSchedule,
  onScheduleSelect,
  update,
}) => {
  const [isClosed, setIsClosed] = useState(!opened);
  const [week, setWeek] = useState(getCurrentWeek(viewDate));

  useEffect(() => {
    setIsClosed(!opened);
    if (opened) {
      logUserAction(
        Action.ViewAppointments,
        JSON.stringify({ mode: 'Week', doctorId }),
      );
    }
  }, [opened]);

  useEffect(() => {
    setWeek(getCurrentWeek(viewDate));
  }, [viewDate]);

  const handleDayClick = day => {
    onDateClick(day.toDate());
  };

  if (isClosed) return null;

  return (
    <div className='week-view'>
      <TableContainer classes={{ root: 'table-container' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {week.map(item => (
                <TableCell key={item} onClick={() => handleDayClick(item)}>
                  <div
                    className={clsx('day-title', {
                      'current-day': moment().isSame(item, 'day'),
                    })}
                  >
                    {item.format('DD dddd')}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {week.map(day => (
                <CalendarWeekDayView
                  viewDate={viewDate}
                  update={update}
                  selectedSchedule={selectedSchedule}
                  onScheduleSelect={onScheduleSelect}
                  doctorId={doctorId}
                  key={day}
                  day={day}
                />
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CalendarWeekView;

CalendarWeekView.propTypes = {
  update: PropTypes.bool,
  onScheduleSelect: PropTypes.func,
  opened: PropTypes.bool,
  hours: PropTypes.arrayOf(PropTypes.string),
  doctorId: PropTypes.number,
  onDateClick: PropTypes.func,
  viewDate: PropTypes.instanceOf(Date),
  selectedSchedule: PropTypes.shape({
    id: PropTypes.number,
    patientId: PropTypes.number,
    patientName: PropTypes.string,
    serviceName: PropTypes.string,
    serviceColor: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    scheduleStatus: PropTypes.string,
  }),
};

CalendarWeekDayView.defaulProps = {
  onScheduleSelect: () => null,
};
