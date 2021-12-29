import React from 'react';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { END } from 'redux-saga';
import CalendarContainer from 'app/components/dashboard/calendar/CalendarContainer';
import CalendarMonthView from 'app/components/dashboard/calendar/CalendarMonthView';
import { JwtRegex, Role } from 'app/utils/constants';
import handleRequestError from 'app/utils/handleRequestError';
import redirectToUrl from 'app/utils/redirectToUrl';
import {
  authTokenSelector,
  currentClinicSelector,
  currentUserSelector,
} from 'redux/selectors/appDataSelector';
import { setCookies } from 'redux/slices/appDataSlice';
import { wrapper } from 'store';
import { setViewDate, setViewMode } from 'redux/slices/calendarData';

const Month = ({ doctorId, date }) => {
  const viewDate = moment(date).toDate();
  return (
    <CalendarContainer doctorId={doctorId} date={viewDate} viewMode='month'>
      <CalendarMonthView doctorId={doctorId} viewDate={viewDate} />
    </CalendarContainer>
  );
};

export default connect((state) => state)(Month);

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query, req }) => {
      if (query.date == null) {
        query.date = moment().format('YYYY-MM-DD');
      }
      try {
        // end the saga
        store.dispatch(END);
        await store.sagaTask.toPromise();

        // fetch page data
        const appState = store.getState();
        const authToken = authTokenSelector(appState);
        const currentUser = currentUserSelector(appState);
        const currentClinic = currentClinicSelector(appState);
        const cookies = req?.headers?.cookie ?? '';
        store.dispatch(setCookies(cookies));
        store.dispatch(setViewDate(query.date));
        store.dispatch(setViewMode('month'));
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
          '/calendar/month',
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

        // check if doctor id is present in query
        let { doctorId } = query;
        if (doctorId == null) {
          doctorId = doctors[0].id ?? 0;
        }

        return {
          props: {
            doctors,
            doctorId: parseInt(doctorId, 10),
            date: query.date,
          },
        };
      } catch (error) {
        return handleRequestError(error);
      }
    },
);
