import React, { useCallback, useEffect, useMemo, useReducer } from "react";
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';
import { extendMoment } from "moment-range";
import Moment from "moment-timezone";

import ScheduleItem from "./ScheduleItem";
import { reducer, actions, initialState } from "./DoctorsCalendarDay.reducer";
import styles from './DoctorsCalendarDay.module.scss';

const moment = extendMoment(Moment);

const DoctorsCalendarDay = (
  {
    schedules: {
      hours: initialHours,
      schedules: initialSchedules
    },
    onScheduleSelected,
  }
) => {
  const [{ schedules, hours }, localDispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const schedules = initialSchedules[0]?.schedules ?? [];
    localDispatch(actions.setSchedules(schedules));
  }, [initialSchedules]);

  useEffect(() => {
    localDispatch(actions.setHours(initialHours));
  }, [initialHours]);

  const fixedHours = useMemo(() => {
    return hours.filter((hour) => {
      const [_, m] = hour.split(':');
      return m === '00';
    });
  }, [hours]);

  const getSchedulesForHour = useCallback((hour) => {
    if (schedules.length === 0) {
      return [];
    }
    const filteredSchedules = schedules.filter((schedule) => {
      const startTime = moment(schedule.startTime).format('HH:mm');
      const [startHour] = startTime.split(':');
      const [selectedHour] = hour.split(':');
      return startHour === selectedHour;
    }) ?? [];
    return orderBy(filteredSchedules, ['startTime'], ['asc'])
  }, [schedules]);

  return (
    <div className={styles.doctorsCalendarDay}>
      <TableContainer className={styles.tableContainer}>
        <Table stickyHeader className={styles.dataTable}>
          <TableHead>
            <TableRow>
              {fixedHours.map((hour) => (
                <TableCell
                  key={hour}
                  align='center'
                  className={styles.tableHeadCell}
                  style={{
                    width: `calc(100% / ${fixedHours.length})`,
                  }}
                >
                  <Typography className={styles.dayHourText}>{hour}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {fixedHours.map((hour) => (
                <TableCell
                  key={`${hour}-item`}
                  align='center'
                  valign='top'
                  className={styles.tableBodyCell}
                  style={{
                    width: `calc(100% / ${fixedHours.length})`,
                  }}
                >
                  <Box
                    display='flex'
                    flexDirection='column'
                    width='100%'
                    height='100%'
                    className={styles.schedulesWrapper}
                  >
                    {getSchedulesForHour(hour).map((schedule) => (
                      <ScheduleItem
                        key={schedule.id}
                        schedule={schedule}
                        onSelected={onScheduleSelected}
                      />
                    ))}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DoctorsCalendarDay;

DoctorsCalendarDay.propTypes = {
  viewDate: PropTypes.instanceOf(Date),
  currentUser: PropTypes.shape({
    id: PropTypes.number,
  }),
  schedules: PropTypes.shape({
    hours: PropTypes.arrayOf(PropTypes.string),
    schedules: PropTypes.any
  }),
  onScheduleSelected: PropTypes.func,
};

DoctorsCalendarDay.defaultProps = {
  onScheduleSelected: () => null,
}
