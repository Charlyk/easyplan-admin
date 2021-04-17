import React from "react";
import Calendar from "../../../components/calendar";
import CalendarWeekView from "../../../app/components/dashboard/calendar/CalendarWeekView";
import moment from "moment-timezone";
import { fetchAppData } from "../../../middleware/api/initialization";
import { getCurrentWeek, handleRequestError, redirectToUrl, redirectUserTo } from "../../../utils/helperFuncs";
import { getSchedulesForInterval } from "../../../middleware/api/schedules";
import { Role } from "../../../utils/constants";

export default function Week(
  {
    currentUser,
    currentClinic,
    doctors,
    date,
    doctorId,
    schedules
  }
) {
  const viewDate = moment(date).toDate();
  return (
    <Calendar
      doctors={doctors}
      doctorId={doctorId}
      currentClinic={currentClinic}
      currentUser={currentUser}
      date={viewDate}
      viewMode='week'
    >
      <CalendarWeekView
        viewDate={viewDate}
        doctors={doctors}
        schedules={schedules}
        doctorId={doctorId}
      />
    </Calendar>
  )
};

export const getServerSideProps = async ({ req, res, query }) => {
  try {
    const appData = await fetchAppData(req.headers);
    const { currentUser, currentClinic } = appData;

    // check if user is on the allowed page
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/calendar/week');
    if (redirectTo != null) {
      redirectUserTo(redirectTo, res);
      return { props: { ...appData } };
    }

    // fetch schedules for current week
    let currentDate = moment()
    // check if query has all required parameters
    if (query.date != null) {
      currentDate = moment(query.date);
    }

    // filter clinic doctors
    const doctors = currentClinic?.users?.filter((item) =>
      item.roleInClinic === Role.doctor && !item.isHidden
    ) || [];

    // check if doctor id is present in query
    let doctorId = query.doctorId;
    if (doctorId == null) {
      doctorId = doctors[0].id ?? 0;
    }

    // fetch schedules for specified period of time
    const week = getCurrentWeek(currentDate.toDate());
    const firstDay = week[0];
    const lastDay = week[week.length - 1];
    const response = await getSchedulesForInterval(firstDay, lastDay, doctorId, req.headers)

    return {
      props: {
        doctorId: parseInt(doctorId),
        doctors,
        date: query.date,
        schedules: response.data,
        ...appData,
      },
    };
  } catch (error) {
    await handleRequestError(error, req, res);
    return {
      props: {
        date: query.date,
        schedules: []
      },
    };
  }
};
