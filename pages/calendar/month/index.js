import React from "react";
import Calendar from "../../../components/calendar";
import moment from "moment-timezone";
import CalendarMonthView from "../../../components/calendar/AppointmentsCalendar/CalendarMonthView";

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
