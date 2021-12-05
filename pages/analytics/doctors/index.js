import React from 'react';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { SWRConfig } from 'swr';
import MainComponent from 'app/components/common/MainComponent/MainComponent';
import DoctorsAnalytics from 'app/components/dashboard/analytics/DoctorsAnalytics';
import { APP_DATA_API, JwtRegex } from 'app/utils/constants';
import handleRequestError from 'app/utils/handleRequestError';
import parseCookies from 'app/utils/parseCookies';
import redirectToUrl from 'app/utils/redirectToUrl';
import { getDoctorsStatistics } from 'middleware/api/analytics';
import { fetchAppData } from 'middleware/api/initialization';

const Doctors = ({ fallback, statistics, query: initialQuery, authToken }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <MainComponent currentPath='/analytics/doctors' authToken={authToken}>
        <DoctorsAnalytics query={initialQuery} statistics={statistics} />
      </MainComponent>
    </SWRConfig>
  );
};

export default connect((state) => state)(Doctors);

export const getServerSideProps = async ({ req, query }) => {
  try {
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
    const redirectTo = redirectToUrl(
      currentUser,
      currentClinic,
      '/analytics/doctors',
    );
    if (redirectTo != null) {
      return {
        redirect: {
          destination: redirectTo,
          permanent: true,
        },
      };
    }

    const { data: statistics } = await getDoctorsStatistics(query, req.headers);
    return {
      props: {
        authToken,
        statistics,
        query,
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
