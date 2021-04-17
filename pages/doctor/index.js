import React from 'react';
import moment from 'moment-timezone';
import DoctorsMain from "../../components/doctors/DoctorsMain";
import { wrapper } from "../../store";
import { getCurrentWeek, handleRequestError, redirectToUrl, redirectUserTo } from "../../utils/helperFuncs";
import { fetchAppData } from "../../middleware/api/initialization";
import { parseCookies } from "../../utils";
import DoctorCalendar from "../../app/components/doctors/DoctorCalendar";
import { getSchedulesForInterval } from "../../middleware/api/schedules";

const DoctorPatients = (
  {
    currentUser,
    currentClinic,
    schedules,
    date,
    authToken,
  }
) => {
  return (
    <DoctorsMain
      currentClinic={currentClinic}
      currentUser={currentUser}
      authToken={authToken}
    >
      <DoctorCalendar
        schedules={schedules}
        currentClinic={currentClinic}
        currentUser={currentUser}
        date={date}
      />
    </DoctorsMain>
  );
};

export const getServerSideProps = async ({ res, req, query }) => {
  try {
    let date = moment().toDate();
    if (query.date != null) {
      date = moment(query.date).toDate();
    }
    const { auth_token: authToken } = parseCookies(req);
    const appData = await fetchAppData(req.headers);
    const { currentUser, currentClinic } = appData;
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/doctor');
    if (redirectTo != null) {
      redirectUserTo(redirectTo, res);
      return { props: { ...appData } };
    }

    // fetch schedules for a week
    const week = getCurrentWeek(date);
    const firstDay = week[0];
    const lastDay = week[week.length - 1];
    const response = await getSchedulesForInterval(firstDay, lastDay, currentUser.id, req.headers);
    return {
      props: {
        authToken,
        schedules: response.data,
        date: moment(date).format('YYYY-MM-DD'),
        ...appData,
      },
    };
  } catch (error) {
    await handleRequestError(error, req, res);
    return {
      props: {
        schedules: [],
        date: query.date,
      },
    };
  }
}

export default wrapper.withRedux(DoctorPatients);
