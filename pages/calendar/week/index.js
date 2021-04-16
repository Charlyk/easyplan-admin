import React from "react";
import Calendar from "../../../components/calendar";
import CalendarWeekView from "../../../components/calendar/AppointmentsCalendar/CalendarWeekView";
import moment from "moment-timezone";
import { fetchAppData } from "../../../middleware/api/initialization";
import { handleRequestError, redirectToUrl, redirectUserTo } from "../../../utils/helperFuncs";

export default function Week({ currentUser, currentClinic, date }) {
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

export const getServerSideProps = async ({ req, res, query }) => {
  if (query.date == null) {
    query.date = moment().format('YYYY-MM-DD');
  }

  try {
    const appData = await fetchAppData(req.headers);
    const { currentUser, currentClinic } = appData;
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/calendar/week');
    if (redirectTo != null) {
      redirectUserTo(redirectTo, res);
      return { props: { ...appData } };
    }
    return {
      props: {
        date: query.date,
        ...appData
      },
    };
  } catch (error) {
    await handleRequestError(error, req, res);
    return {
      props: {
        date: query.date,
      },
    };
  }
};
