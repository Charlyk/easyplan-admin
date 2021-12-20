import React from 'react';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import MainComponent from 'app/components/common/MainComponent/MainComponent';
import ServicesAnalytics from 'app/components/dashboard/analytics/ServicesAnalytics';
import { JwtRegex } from 'app/utils/constants';
import handleRequestError from 'app/utils/handleRequestError';
import redirectToUrl from 'app/utils/redirectToUrl';
import { getServicesStatistics } from 'middleware/api/analytics';
import {
  authTokenSelector,
  currentClinicSelector,
  currentUserSelector,
} from 'redux/selectors/appDataSelector';
import { setCookies } from 'redux/slices/appDataSlice';
import { wrapper } from 'store';

const Services = ({ statistics, query }) => {
  return (
    <MainComponent currentPath='/analytics/services'>
      <ServicesAnalytics query={query} statistics={statistics} />
    </MainComponent>
  );
};

export default connect((state) => state)(Services);

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, query }) => {
      try {
        if (query.page == null) {
          query.page = '0';
        }

        if (query.rowsPerPage == null) {
          query.rowsPerPage = '25';
        }

        if (query.fromDate == null) {
          query.fromDate = moment().startOf('month').format('YYYY-MM-DD');
        }

        if (query.toDate == null) {
          query.toDate = moment().endOf('month').format('YYYY-MM-DD');
        }

        if (query.status == null) {
          query.status = 'All';
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

        const redirectTo = redirectToUrl(
          currentUser,
          currentClinic,
          '/analytics/services',
        );
        if (redirectTo != null) {
          return {
            redirect: {
              destination: redirectTo,
              permanent: true,
            },
          };
        }

        const { data: statistics } = await getServicesStatistics(
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
