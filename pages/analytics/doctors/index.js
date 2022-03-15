import React from 'react';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { END } from 'redux-saga';
import MainComponent from 'app/components/common/MainComponent/MainComponent';
import DoctorsAnalytics from 'app/components/dashboard/analytics/DoctorsAnalytics';
import { JwtRegex } from 'app/utils/constants';
import handleRequestError from 'app/utils/handleRequestError';
import redirectToUrl from 'app/utils/redirectToUrl';
import { loginUrl } from 'eas.config';
import { getDoctorsStatistics } from 'middleware/api/analytics';
import {
  authTokenSelector,
  currentClinicSelector,
  currentUserSelector,
} from 'redux/selectors/appDataSelector';
import { setCookies } from 'redux/slices/appDataSlice';
import { wrapper } from 'store';

const Doctors = ({ statistics, query: initialQuery }) => {
  return (
    <MainComponent currentPath='/analytics/doctors'>
      <DoctorsAnalytics query={initialQuery} statistics={statistics} />
    </MainComponent>
  );
};

export default connect((state) => state)(Doctors);

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, query }) => {
      try {
        // end the saga
        store.dispatch(END);
        await store.sagaTask.toPromise();

        // fetch page data
        if (query.fromDate == null) {
          query.fromDate = moment().startOf('month').format('YYYY-MM-DD');
        }
        if (query.toDate == null) {
          query.toDate = moment().endOf('month').format('YYYY-MM-DD');
        }
        if (query.doctorId == null) {
          query.doctorId = -1;
        }
        if (query.serviceId == null) {
          query.serviceId = -1;
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
              destination: loginUrl,
              permanent: false,
            },
          };
        }

        const redirectTo = redirectToUrl(
          currentUser,
          currentClinic,
          '/analytics/doctors',
        );
        if (redirectTo != null) {
          return {
            redirect: {
              destination: redirectTo,
              permanent: false,
            },
          };
        }

        const { data: statistics } = await getDoctorsStatistics(
          query,
          req.headers,
        );
        return {
          props: {
            statistics,
            query,
          },
        };
      } catch (error) {
        return handleRequestError(error);
      }
    },
);
