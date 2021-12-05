import React from 'react';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { SWRConfig } from 'swr';
import DoctorCalendar from 'app/components/doctors/DoctorCalendar';
import DoctorsMain from 'app/components/doctors/DoctorsMain';
import { APP_DATA_API, JwtRegex } from 'app/utils/constants';
import getCurrentWeek from 'app/utils/getCurrentWeek';
import handleRequestError from 'app/utils/handleRequestError';
import { textForKey } from 'app/utils/localization';
import parseCookies from 'app/utils/parseCookies';
import redirectToUrl from 'app/utils/redirectToUrl';
import { fetchAppData } from 'middleware/api/initialization';
import { getSchedulesForInterval } from 'middleware/api/schedules';

const Doctor = ({ fallback, schedules, date, authToken, viewMode }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <DoctorsMain authToken={authToken} pageTitle={textForKey('Schedules')}>
        <DoctorCalendar viewMode={viewMode} schedules={schedules} date={date} />
      </DoctorsMain>
    </SWRConfig>
  );
};

export default connect((state) => state)(Doctor);

export const getServerSideProps = async ({ req, query }) => {
  try {
    let date = moment().toDate();
    if (query.date != null) {
      date = moment(query.date).toDate();
    }
    const { auth_token: authToken } = parseCookies(req);
    if (!authToken || !authToken.match(JwtRegex)) {
      return {
        redirect: {
          destination: '/login',
          permanent: true,
        },
      };
    }

    const appData = await fetchAppData(req.headers);
    const { currentUser, currentClinic } = appData.data;
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/doctor');
    if (redirectTo != null) {
      return {
        redirect: {
          destination: redirectTo,
          permanent: true,
        },
      };
    }
    const viewMode = query.viewMode ?? 'week';

    // fetch schedules for a week
    const week = getCurrentWeek(date);
    const firstDay = viewMode === 'week' ? week[0] : date;
    const lastDay = viewMode === 'week' ? week[week.length - 1] : date;
    const response = await getSchedulesForInterval(
      firstDay,
      lastDay,
      currentUser.id,
      req.headers,
    );
    return {
      props: {
        authToken,
        viewMode,
        schedules: response.data,
        date: moment(date).format('YYYY-MM-DD'),
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
