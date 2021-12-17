import React from 'react';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import MainComponent from 'app/components/common/MainComponent/MainComponent';
import ClinicAnalytics from 'app/components/dashboard/analytics/ClinicAnalytics';
import {
  setInitialData,
  setAnalytics,
} from 'app/components/dashboard/analytics/ClinicAnalytics/ClinicAnalytics.reducer';
import { JwtRegex } from 'app/utils/constants';
import handleRequestError from 'app/utils/handleRequestError';
import redirectToUrl from 'app/utils/redirectToUrl';
import { requestFetchClinicAnalytics } from 'middleware/api/analytics';
import { requestFetchSelectedCharts } from 'middleware/api/users';
import {
  authTokenSelector,
  currentClinicSelector,
  currentUserSelector,
} from 'redux/selectors/appDataSelector';
import { wrapper } from 'store';

const General = ({ query }) => {
  return (
    <MainComponent currentPath='/analytics/general'>
      <ClinicAnalytics query={query} />
    </MainComponent>
  );
};

export default connect((state) => state)(General);

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query, req }) => {
      try {
        if (query.startDate == null) {
          query.startDate = moment().startOf('week').format('YYYY-MM-DD');
        }
        if (query.endDate == null) {
          query.endDate = moment().endOf('week').format('YYYY-MM-DD');
        }

        const appState = store.getState();
        const authToken = authTokenSelector(appState);
        const currentUser = currentUserSelector(appState);
        const currentClinic = currentClinicSelector(appState);
        if (!authToken || !authToken.match(JwtRegex)) {
          return {
            redirect: {
              destination: '/login',
              permanent: true,
            },
          };
        }

        const chartResponse = await requestFetchSelectedCharts(req.headers);
        store.dispatch(
          setInitialData([
            [query.startDate.toString(), query.endDate.toString()],
            chartResponse.data,
          ]),
        );

        const analyticResponse = await requestFetchClinicAnalytics(
          query.startDate,
          query.endDate,
          req.headers,
        );
        store.dispatch(setAnalytics(analyticResponse.data));

        const redirectTo = redirectToUrl(
          currentUser,
          currentClinic,
          '/analytics/general',
        );
        if (redirectTo != null) {
          return {
            redirect: {
              destination: redirectTo,
              permanent: true,
            },
          };
        }

        return {
          props: {
            query,
          },
        };
      } catch (error) {
        return handleRequestError(error);
      }
    },
);
