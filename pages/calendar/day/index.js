import React, { useMemo } from "react";
import CalendarContainer from "../../../app/components/dashboard/calendar/CalendarContainer";
import CalendarDayView from "../../../app/components/dashboard/calendar/CalendarDayView";
import { Role } from "../../../app/utils/constants";
import moment from "moment-timezone";
import { handleRequestError, redirectToUrl, redirectUserTo } from "../../../utils/helperFuncs";
import { fetchAppData } from "../../../middleware/api/initialization";
import { fetchDaySchedules } from "../../../middleware/api/schedules";

export default function Day({ currentUser, currentClinic, date, schedules, dayHours, doctors }) {
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
    const appData = await fetchAppData(req.headers);
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
