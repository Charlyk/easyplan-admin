import React, { useMemo } from 'react';
import moment from 'moment-timezone';
import { SWRConfig } from 'swr';
import CalendarContainer from 'app/components/dashboard/calendar/CalendarContainer';
import CalendarDayView from 'app/components/dashboard/calendar/CalendarDayView';
import { APP_DATA_API, JwtRegex, Role } from 'app/utils/constants';
import handleRequestError from 'app/utils/handleRequestError';
import parseCookies from 'app/utils/parseCookies';
import redirectToUrl from 'app/utils/redirectToUrl';
import { fetchAppData } from 'middleware/api/initialization';
import { fetchDaySchedules } from 'middleware/api/schedules';
import { wrapper } from 'store';

const Day = ({
  fallback,
  date,
  schedules,
  dayHours,
  doctors,
  cabinets,
  authToken,
}) => {
  const viewDate = moment(date).toDate();

  const updatedSchedules = useMemo(() => {
    return schedules.map((schedule) => ({
      ...schedule,
      id: schedule.groupId,
    }));
  }, [schedules]);

  return (
    <SWRConfig value={{ fallback }}>
      <CalendarContainer
        doctors={doctors}
        authToken={authToken}
        viewMode='day'
        date={viewDate}
      >
        <CalendarDayView
          cabinets={cabinets}
          schedules={updatedSchedules}
          dayHours={dayHours}
          viewDate={viewDate}
          doctors={doctors}
        />
      </CalendarContainer>
    </SWRConfig>
  );
};

export default wrapper.withRedux(Day);

export const getServerSideProps = async ({ query, req }) => {
  if (query.date == null) {
    query.date = moment().format('YYYY-MM-DD');
  }

  const { date: queryDate } = query;
  try {
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
    const redirectTo = redirectToUrl(
      currentUser,
      currentClinic,
      '/calendar/day',
    );
    if (redirectTo != null) {
      return {
        redirect: {
          destination: redirectTo,
          permanent: true,
        },
      };
    }

    // filter clinic doctors
    const doctors =
      currentClinic?.users?.filter(
        (item) => item.roleInClinic === Role.doctor && item.showInCalendar,
      ) || [];

    const response = await fetchDaySchedules(query, req.headers);
    const { schedules, dayHours } = response.data;
    return {
      props: {
        date: queryDate,
        cabinets: currentClinic.cabinets,
        doctors,
        schedules,
        dayHours,
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
