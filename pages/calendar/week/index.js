import React from 'react';
import moment from 'moment-timezone';
import { SWRConfig } from 'swr';
import CalendarContainer from 'app/components/dashboard/calendar/CalendarContainer';
import CalendarWeekView from 'app/components/dashboard/calendar/CalendarWeekView';
import { APP_DATA_API, JwtRegex, Role } from 'app/utils/constants';
import getCurrentWeek from 'app/utils/getCurrentWeek';
import handleRequestError from 'app/utils/handleRequestError';
import parseCookies from 'app/utils/parseCookies';
import redirectToUrl from 'app/utils/redirectToUrl';
import { fetchAppData } from 'middleware/api/initialization';
import { getSchedulesForInterval } from 'middleware/api/schedules';
import { wrapper } from 'store';

const Week = ({ fallback, doctors, date, doctorId, schedules, authToken }) => {
  const viewDate = moment(date).toDate();
  return (
    <SWRConfig value={{ fallback }}>
      <CalendarContainer
        doctors={doctors}
        doctorId={doctorId}
        authToken={authToken}
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
    </SWRConfig>
  );
};

export default wrapper.withRedux(Week);

export const getServerSideProps = async ({ req, query }) => {
  try {
    if (query.date == null) {
      query.date = moment().format('YYYY-MM-DD');
    }
    const { date: queryDate, doctorId: queryDoctorId } = query;

    const { auth_token: authToken } = parseCookies(req);
    if (!authToken || !authToken.match(JwtRegex)) {
      return {
        redirect: {
          destination: '/login',
          permanent: true,
        },
      };
    }

    const appData = await fetchAppData(req.headers, queryDate);
    const { currentUser, currentClinic } = appData.data;

    // check if user is on the allowed page
    const redirectTo = redirectToUrl(
      currentUser,
      currentClinic,
      '/calendar/week',
    );
    if (redirectTo != null) {
      return {
        redirect: {
          destination: redirectTo,
          permanent: true,
        },
      };
    }

    // fetch schedules for current week
    const currentDate = moment(queryDate);

    // filter clinic doctors
    const doctors =
      currentClinic?.users?.filter(
        (item) => item.roleInClinic === Role.doctor && item.showInCalendar,
      ) || [];

    // check if doctor id is present in query
    let doctorId = queryDoctorId;
    if (doctorId == null) {
      doctorId = doctors[0]?.id ?? 0;
    }

    // fetch schedules for specified period of time
    const week = getCurrentWeek(currentDate.toDate()).map((item) =>
      item.toDate(),
    );
    const firstDay = week[0];
    const lastDay = week[week.length - 1];
    const response = await getSchedulesForInterval(
      firstDay,
      lastDay,
      doctorId,
      req.headers,
    );

    return {
      props: {
        doctorId: parseInt(doctorId, 10),
        doctors,
        date: query.date,
        schedules: response.data,
        authToken,
        fallback: {
          [APP_DATA_API]: {
            ...appData.data,
          },
        },
      },
    };
  } catch (error) {
    return handleRequestError(error);
  }
};
