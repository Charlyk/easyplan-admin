import React from 'react';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { END } from 'redux-saga';
import CalendarContainer from 'app/components/dashboard/calendar/CalendarContainer';
import CalendarWeekView from 'app/components/dashboard/calendar/CalendarWeekView';
import { JwtRegex, Role } from 'app/utils/constants';
import getCurrentWeek from 'app/utils/getCurrentWeek';
import handleRequestError from 'app/utils/handleRequestError';
import redirectToUrl from 'app/utils/redirectToUrl';
import { loginUrl } from 'eas.config';
import { getSchedulesForInterval } from 'middleware/api/schedules';
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

const Week = ({ date, doctorId }) => {
  const viewDate = moment(date).toDate();
  return (
    <CalendarContainer doctorId={doctorId} date={viewDate} viewMode='week'>
      <CalendarWeekView viewDate={viewDate} doctorId={doctorId} />
    </CalendarContainer>
  );
};

export default connect((state) => state)(Week);

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, query }) => {
      try {
        // end the saga
        store.dispatch(END);
        await store.sagaTask.toPromise();

        // fetch page data
        if (query.date == null) {
          query.date = moment().format('YYYY-MM-DD');
        }
        const appState = store.getState();
        const authToken = authTokenSelector(appState);
        const currentUser = currentUserSelector(appState);
        const currentClinic = currentClinicSelector(appState);
        const cookies = req?.headers?.cookie ?? '';
        store.dispatch(setCookies(cookies));
        store.dispatch(setViewDate(query.date));
        store.dispatch(setViewMode('week'));
        const { date: queryDate, doctorId: queryDoctorId } = query;
        if (!authToken || !authToken.match(JwtRegex)) {
          return {
            redirect: {
              destination: loginUrl,
              permanent: false,
            },
          };
        }

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
              permanent: false,
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

        const { schedules, hours } = response.data;

        store.dispatch(
          setCalendarData({
            dayHours: hours,
            details: null,
            schedules,
          }),
        );

        return {
          props: {
            doctorId: parseInt(doctorId, 10),
            date: query.date,
          },
        };
      } catch (error) {
        return handleRequestError(error);
      }
    },
);
