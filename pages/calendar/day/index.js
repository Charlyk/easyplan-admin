import React from "react";
import Calendar from "../../../components/calendar";
import CalendarDayView from "../../../components/calendar/AppointmentsCalendar/CalendarDayView";
import { Role } from "../../../utils/constants";
import moment from "moment-timezone";
import axios from "axios";
import { baseAppUrl } from "../../../eas.config";
import { handleRequestError } from "../../../utils/helperFuncs";

const CalendarDay = ({ currentUser, currentClinic, date, schedules, dayHours }) => {
  const viewDate = moment(date).toDate();
  const doctors = currentClinic.users.filter((item) =>
    item.roleInClinic === Role.doctor && !item.isHidden
  );

  return (
    <Calendar
      currentUser={currentUser}
      currentClinic={currentClinic}
      viewMode='day'
      date={viewDate}
    >
      <CalendarDayView
        schedules={schedules}
        dayHours={dayHours}
        viewDate={viewDate}
        doctors={doctors}
      />
    </Calendar>
  )
};

export const getServerSideProps = async ({ query, req, res }) => {
  if (query.date == null) {
    query.date = moment().format('YYYY-MM-DD');
  }

  const { date: queryDate } = query;
  try {
    const queryString = new URLSearchParams({ date: queryDate, period: 'day' }).toString();
    const response = await axios.get(
      `${baseAppUrl}/api/schedules?${queryString}`,
      { headers: req.headers }
    );
    const { schedules, dayHours } = response.data;
    return {
      props: {
        date: queryDate,
        schedules,
        dayHours,
      }
    }
  } catch (error) {
    await handleRequestError(error, req, res);
    return {
      props: {
        date: queryDate,
        schedules: [],
        dayHours: [],
      }
    }
  }
}

export default CalendarDay
