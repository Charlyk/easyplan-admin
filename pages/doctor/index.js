import React from 'react';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { END } from 'redux-saga';
import DoctorCalendar from 'app/components/doctors/DoctorCalendar';
import DoctorsMain from 'app/components/doctors/DoctorsMain';
import { JwtRegex } from 'app/utils/constants';
import getCurrentWeek from 'app/utils/getCurrentWeek';
import handleRequestError from 'app/utils/handleRequestError';
import { textForKey } from 'app/utils/localization';
import redirectToUrl from 'app/utils/redirectToUrl';
import { getSchedulesForInterval } from 'middleware/api/schedules';
import {
  authTokenSelector,
  currentClinicSelector,
  currentUserSelector,
} from 'redux/selectors/appDataSelector';
import { setCookies } from 'redux/slices/appDataSlice';
import { setSchedulesData } from 'redux/slices/calendarData';
import { wrapper } from 'store';

const Doctor = ({ schedules, date, viewMode }) => {
  return (
    <DoctorsMain pageTitle={textForKey('Schedules')}>
      <DoctorCalendar viewMode={viewMode} schedules={schedules} date={date} />
    </DoctorsMain>
  );
};

export default connect((state) => state)(Doctor);

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, query }) => {
      try {
        // end the saga
        store.dispatch(END);
        await store.sagaTask.toPromise();

        // fetch page data
        let date = moment().toDate();
        if (query.date != null) {
          date = moment(query.date).toDate();
        }
        const appState = store.getState();
        const authToken = authTokenSelector(appState);
        const currentUser = currentUserSelector(appState);
        const currentClinic = currentClinicSelector(appState);
        const cookies = req?.headers?.cookie ?? '';
        store.dispatch(setCookies(cookies));
        if (!authToken || !authToken.match(JwtRegex)) {
          return {
            redirect: {
              destination: '/login',
              permanent: true,
            },
          };
        }

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
        store.dispatch(setSchedulesData(response.data));
        return {
          props: {
            viewMode,
            schedules: response.data,
            date: moment(date).format('YYYY-MM-DD'),
          },
        };
      } catch (error) {
        return handleRequestError(error);
      }
    },
);
