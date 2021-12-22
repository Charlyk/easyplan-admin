import React from 'react';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { END } from 'redux-saga';
import CalendarContainer from 'app/components/dashboard/calendar/CalendarContainer';
import CalendarDayView from 'app/components/dashboard/calendar/CalendarDayView';
import { JwtRegex } from 'app/utils/constants';
import handleRequestError from 'app/utils/handleRequestError';
import redirectToUrl from 'app/utils/redirectToUrl';
import { fetchDaySchedules } from 'middleware/api/schedules';
import {
  authTokenSelector,
  currentClinicSelector,
  currentUserSelector,
} from 'redux/selectors/appDataSelector';
import { setCookies } from 'redux/slices/appDataSlice';
import {
  setCalendarData,
  setViewDate,
  setViewMode,
} from 'redux/slices/calendarData';
import { wrapper } from 'store';

const Day = ({ date }) => {
  const viewDate = moment(date).toDate();

  return (
    <CalendarContainer viewMode='day' date={viewDate}>
      <CalendarDayView viewDate={viewDate} />
    </CalendarContainer>
  );
};

export default connect((state) => state)(Day);

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    try {
      const { query, req } = context;
      if (query.date == null) {
        query.date = moment().format('YYYY-MM-DD');
      }
      // end the saga
      store.dispatch(END);
      await store.sagaTask.toPromise();

      // fetch page data

      const { date: queryDate } = query;
      const appState = store.getState();
      const authToken = authTokenSelector(appState);
      const currentUser = currentUserSelector(appState);
      const currentClinic = currentClinicSelector(appState);
      const cookies = req?.headers?.cookie ?? '';
      store.dispatch(setCookies(cookies));
      store.dispatch(setViewDate(queryDate));
      store.dispatch(setViewMode('day'));
      if (!authToken || !authToken.match(JwtRegex)) {
        return {
          redirect: {
            destination: '/login',
            permanent: true,
          },
        };
      }

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

      const response = await fetchDaySchedules(query, req.headers);
      const { schedules, dayHours } = response.data;
      const calendarData = {
        schedules,
        dayHours,
        details: null,
      };
      store.dispatch(setCalendarData(calendarData));
      return {
        props: {
          date: queryDate,
        },
      };
    } catch (error) {
      return handleRequestError(error);
    }
  },
);
