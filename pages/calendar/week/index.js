import React from "react";
import Calendar from "../../../components/calendar";
import CalendarWeekView from "../../../components/calendar/AppointmentsCalendar/CalendarWeekView";
import moment from "moment-timezone";

const CalendarWeek = ({ currentUser, currentClinic, date }) => {
  const viewDate = moment(date).toDate();
  return (
    <Calendar
      currentClinic={currentClinic}
      currentUser={currentUser}
      date={viewDate}
      viewMode='week'
    >
      <CalendarWeekView
        viewDate={viewDate}
      />
    </Calendar>
  )
};

export const getServerSideProps = async ({ query }) => {
  if (query.date == null) {
    query.date = moment().format('YYYY-MM-DD');
  }
  return {
    props: {
      date: query.date
    }
  }
};

export default CalendarWeek;
