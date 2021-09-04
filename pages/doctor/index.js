import React from 'react';
import moment from 'moment-timezone';
import DoctorsMain from "../../app/components/doctors/DoctorsMain";
import { wrapper } from "../../store";
import getCurrentWeek from "../../utils/getCurrentWeek";
import handleRequestError from '../../utils/handleRequestError';
import redirectToUrl from '../../utils/redirectToUrl';
import redirectUserTo from '../../utils/redirectUserTo';
import { fetchAppData } from "../../middleware/api/initialization";
import { parseCookies } from "../../utils";
import DoctorCalendar from "../../app/components/doctors/DoctorCalendar";
import { getSchedulesForInterval } from "../../middleware/api/schedules";
import { textForKey } from "../../utils/localization";

const Doctor = (
  {
    currentUser,
    currentClinic,
    schedules,
    date,
    authToken,
    viewMode,
  }
) => {
  return (
    <DoctorsMain
      currentClinic={currentClinic}
      currentUser={currentUser}
      authToken={authToken}
      pageTitle={textForKey('Schedules')}
    >
      <DoctorCalendar
        viewMode={viewMode}
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
    const viewMode = query.viewMode ?? 'week';

    // fetch schedules for a week
    const week = getCurrentWeek(date);
    const firstDay = viewMode === 'week' ? week[0] : date;
    const lastDay = viewMode === 'week' ? week[week.length - 1] : date;
    const response = await getSchedulesForInterval(firstDay, lastDay, currentUser.id, req.headers);
    return {
      props: {
        authToken,
        viewMode,
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

export default wrapper.withRedux(Doctor);
