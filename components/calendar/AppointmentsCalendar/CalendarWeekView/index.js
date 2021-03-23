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
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { updateAppointmentsSelector } from '../../../../redux/selectors/rootSelector';
import { getCurrentWeek  } from '../../../../utils/helperFuncs';
import CalendarWeekDayView from './CalendarWeekDayView';
import styles from '../../../../styles/CalendarWeekView.module.scss';

const CalendarWeekView = ({
  doctorId,
  viewDate,
  onDateClick,
  selectedSchedule,
  onScheduleSelect,
}) => {
  const updateAppointments = useSelector(updateAppointmentsSelector);
  const [week, setWeek] = useState(getCurrentWeek(viewDate));

  useEffect(() => {
    setWeek(getCurrentWeek(viewDate));
  }, [viewDate, updateAppointments]);

  const handleDayClick = (day) => {
    onDateClick(day.toDate(), true);
  };

  return (
    <div className={styles['week-view']}>
      <TableContainer classes={{ root: styles['table-container'] }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {week.map((item) => (
                <TableCell key={item} onClick={() => handleDayClick(item)}>
                  <div
                    className={clsx(styles['day-title'], {
                      [styles['current-day']]: moment().isSame(item, 'day'),
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
              {week.map((day) => (
                <CalendarWeekDayView
                  viewDate={viewDate}
                  update={updateAppointments}
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
  onScheduleSelect: PropTypes.func,
  opened: PropTypes.bool,
  hours: PropTypes.arrayOf(PropTypes.string),
  doctorId: PropTypes.number,
  onDateClick: PropTypes.func,
  viewDate: PropTypes.instanceOf(Date),
  selectedSchedule: PropTypes.shape({
    id: PropTypes.number,
    patient: PropTypes.shape({
      id: PropTypes.number,
      fullName: PropTypes.string,
    }),
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
