import React from "react";
import CalendarContainer from "../../../app/components/dashboard/calendar/CalendarContainer";
import moment from "moment-timezone";
import CalendarMonthView from "../../../app/components/dashboard/calendar/CalendarMonthView";
import { fetchAppData } from "../../../middleware/api/initialization";
import { handleRequestError, redirectToUrl, redirectUserTo } from "../../../utils/helperFuncs";
import { Role } from "../../../app/utils/constants";

export default function Month({ currentUser, currentClinic, doctorId, date, doctors }) {
  const viewDate = moment(date).toDate();
  return (
    <CalendarContainer
      doctors={doctors}
      doctorId={doctorId}
      currentClinic={currentClinic}
      currentUser={currentUser}
      date={viewDate}
      viewMode='month'
    >
      <CalendarMonthView
        doctorId={doctorId}
        viewDate={viewDate}
      />
    </CalendarContainer>
  )
};

export const getServerSideProps = async ({ req, res, query }) => {
  if (query.date == null) {
    query.date = moment().format('YYYY-MM-DD');
  }
  try {
    const appData = await fetchAppData(req.headers);
    const { currentUser, currentClinic } = appData;
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/calendar/month');
    if (redirectTo != null) {
      redirectUserTo(redirectTo, res);
      return { props: { ...appData } };
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

    return {
      props: {
        doctors,
        doctorId: parseInt(doctorId),
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
