import React, { useEffect, useReducer } from "react";
import PropTypes from 'prop-types';
import { toast } from "react-toastify";
import moment from "moment-timezone";
import { getSchedulesForInterval } from "../../../middleware/api/schedules";
import { generateReducerActions } from "../../../utils/helperFuncs";

const initialState = {
  hours: [],
  schedules: new Map(),
}

const reducerTypes = {
  setData: 'setData',
}

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setData:
      return { ...state, ...action.payload };
    default:
      return state
  }
}

const CalendarWeek = ({ doctorId, startDate, endDate }) => {
  const [{ hours, schedules }, localDispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchSchedules();
  }, [doctorId, startDate, endDate]);

  const fetchSchedules = async () => {
    try {
      const response = await getSchedulesForInterval(startDate, endDate, doctorId);
      localDispatch(actions.setData(response.data));
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div>
      <div/>
    </div>
  )
}

export default CalendarWeek;

CalendarWeek.propTypes = {
  doctorId: PropTypes.number,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
}

CalendarWeek.defaultProps = {
  startDate: moment().startOf('week'),
  endDate: moment().endOf('week'),
}
