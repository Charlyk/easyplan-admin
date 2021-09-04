import React, { useMemo } from "react";
import moment from "moment-timezone";
import CalendarContainer from "../../../app/components/dashboard/calendar/CalendarContainer";
import CalendarDayView from "../../../app/components/dashboard/calendar/CalendarDayView";
import { Role } from "../../../app/utils/constants";
import redirectUserTo from "../../../utils/redirectUserTo";
import handleRequestError from "../../../utils/handleRequestError";
import redirectToUrl from '../../../utils/redirectToUrl'
import { fetchAppData } from "../../../middleware/api/initialization";
import { fetchDaySchedules } from "../../../middleware/api/schedules";
import { parseCookies } from "../../../utils";

export default function Day({ currentUser, currentClinic, date, schedules, dayHours, doctors, authToken }) {
  const viewDate = moment(date).toDate();

  const updatedSchedules = useMemo(() => {
    return schedules.map((schedule) => ({
      ...schedule,
      id: schedule.doctorId,
    }));
  }, [schedules]);

  return (
    <CalendarContainer
      doctors={doctors}
      currentUser={currentUser}
      currentClinic={currentClinic}
      authToken={authToken}
      viewMode='day'
      date={viewDate}
    >
      <CalendarDayView
        schedules={updatedSchedules}
        dayHours={dayHours}
        viewDate={viewDate}
        doctors={doctors}
      />
    </CalendarContainer>
  )
};

export const getServerSideProps = async ({ query, req, res }) => {
  if (query.date == null) {
    query.date = moment().format('YYYY-MM-DD');
  }

  const { date: queryDate } = query;
  try {
    const { auth_token: authToken } = parseCookies(req);
    const appData = await fetchAppData(req.headers, queryDate);
    const { currentUser, currentClinic } = appData;
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/calendar/day');
    if (redirectTo != null) {
      redirectUserTo(redirectTo, res);
      return { props: { ...appData } };
    }

    // filter clinic doctors
    const doctors = currentClinic?.users?.filter((item) =>
      item.roleInClinic === Role.doctor && !item.isHidden
    ) || [];

    const response = await fetchDaySchedules(query, req.headers);
    const { schedules, dayHours } = response.data;
    return {
      props: {
        date: queryDate,
        doctors,
        schedules,
        dayHours,
        authToken,
        ...appData
      }
    }
  } catch (error) {
    await handleRequestError(error, req, res);
    return {
      props: {
        doctors: [],
        date: queryDate,
        schedules: [],
        dayHours: [],

      }
    }
  }
};
