import React, { useEffect, useReducer } from 'react';

import {
  Box,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import upperFirst from 'lodash/upperFirst';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { clinicActiveDoctorsSelector } from '../../../../../redux/selectors/clinicSelector';
import dataAPI from '../../../../../utils/api/dataAPI';
import { generateReducerActions } from '../../../../../utils/helperFuncs';
import { textForKey } from '../../../../../utils/localization';

const initialState = {
  hours: [],
  isLoading: false,
};

const reducerTypes = {
  setHours: 'setHours',
  setIsLoading: 'setIsLoading',
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setHours:
      return { ...state, hours: action.payload };
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

const CalendarDayView = ({ viewDate }) => {
  const doctors = useSelector(clinicActiveDoctorsSelector);
  const [{ isLoading, hours }, localDispatch] = useReducer(
    reducer,
    initialState,
  );

  useEffect(() => {
    fetchWorkHours();
  }, [viewDate]);

  const fetchWorkHours = async () => {
    localDispatch(actions.setIsLoading(true));
    const day = moment(viewDate).isoWeekday();
    const response = await dataAPI.fetchClinicWorkHoursV2(day);
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      localDispatch(actions.setHours(response.data));
    }
    localDispatch(actions.setIsLoading(false));
  };

  return (
    <Box className='calendar-day-view'>
      <div className='day-hours-container'>
        {hours.map(hour => (
          <Typography classes={{ root: 'day-hour-item' }} key={hour}>
            {hour}
          </Typography>
        ))}
      </div>
      <Table stickyHeader classes={{ root: 'schedules-table' }}>
        <TableHead classes={{ root: 'schedules-table__head' }}>
          <TableRow classes={{ root: 'schedules-table__head__row' }}>
            {doctors.map(doctor => {
              return (
                <TableCell
                  align='center'
                  key={doctor.id}
                  classes={{ root: 'schedules-table__head__row__cell' }}
                >
                  {upperFirst(doctor.firstName.toLowerCase())}{' '}
                  {upperFirst(doctor.lastName.toLowerCase())}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
      </Table>
    </Box>
  );
};

export default CalendarDayView;

CalendarDayView.propTypes = {
  viewDate: PropTypes.instanceOf(Date),
};
