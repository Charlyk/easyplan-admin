import React from "react";
import Calendar from "../../../components/calendar";
import moment from "moment-timezone";
import CalendarMonthView from "../../../components/calendar/AppointmentsCalendar/CalendarMonthView";
import { fetchAppData } from "../../../middleware/api/initialization";
import { handleRequestError } from "../../../utils/helperFuncs";

const CalendarWeek = ({ currentUser, currentClinic, date }) => {
  const viewDate = moment(date).toDate();
  return (
    <Calendar
      currentClinic={currentClinic}
      currentUser={currentUser}
      date={viewDate}
      viewMode='month'
    >
      <CalendarMonthView
        viewDate={viewDate}
      />
    </Calendar>
  )
};

export const getServerSideProps = async ({ req, res, query }) => {
  if (query.date == null) {
    query.date = moment().format('YYYY-MM-DD');
  }
  try {
    const appData = await fetchAppData(req.headers);
    return {
      props: {
        date: query.date,
        ...appData,
      }
    }
  } catch (error) {
    await handleRequestError(error, req, res);
    return {
      props: {
        date: query.date
      }
    }
  }
};

export default CalendarWeek;
