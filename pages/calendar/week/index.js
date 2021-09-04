import React from "react";
import moment from "moment-timezone";
import CalendarContainer from "../../../app/components/dashboard/calendar/CalendarContainer";
import CalendarWeekView from "../../../app/components/dashboard/calendar/CalendarWeekView";
import { fetchAppData } from "../../../middleware/api/initialization";
import {
  getCurrentWeek,
  handleRequestError,
  redirectToUrl,
  redirectUserTo
} from "../../../utils/helperFuncs";
import { getSchedulesForInterval } from "../../../middleware/api/schedules";
import { Role } from "../../../app/utils/constants";
import { parseCookies } from "../../../utils";

export default function Week(
  {
    currentUser,
    currentClinic,
    doctors,
    date,
    doctorId,
    schedules,
    authToken,
  }
) {
  const viewDate = moment(date).toDate();
  return (
    <CalendarContainer
      doctors={doctors}
      doctorId={doctorId}
      authToken={authToken}
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
    </CalendarContainer>
  )
};

export const getServerSideProps = async ({ req, res, query }) => {
  try {
    if (query.date == null) {
      query.date = moment().format('YYYY-MM-DD');
    }
    const { date: queryDate } = query;

    const { auth_token: authToken } = parseCookies(req);
    const appData = await fetchAppData(req.headers, queryDate);
    const { currentUser, currentClinic } = appData;

    // check if user is on the allowed page
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/calendar/week');
    if (redirectTo != null) {
      redirectUserTo(redirectTo, res);
      return { props: { ...appData } };
    }

    // fetch schedules for current week
    let currentDate = moment(queryDate)

    // filter clinic doctors
    const doctors = currentClinic?.users?.filter((item) =>
      item.roleInClinic === Role.doctor && !item.isHidden
    ) || [];

    // check if doctor id is present in query
    let doctorId = query.doctorId;
    if (doctorId == null) {
      doctorId = doctors[0]?.id ?? 0;
    }

    // fetch schedules for specified period of time
    const week = getCurrentWeek(currentDate.toDate())
      .map(item => item.toDate());
    const firstDay = week[0];
    const lastDay = week[week.length - 1];
    const response = await getSchedulesForInterval(firstDay, lastDay, doctorId, req.headers)

    return {
      props: {
        doctorId: parseInt(doctorId),
        doctors,
        date: query.date,
        schedules: response.data,
        authToken,
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
