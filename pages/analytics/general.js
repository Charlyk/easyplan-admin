import React from 'react';
import moment from 'moment-timezone';
import { SWRConfig } from 'swr';
import MainComponent from 'app/components/common/MainComponent/MainComponent';
import ClinicAnalytics from 'app/components/dashboard/analytics/ClinicAnalytics';
import { APP_DATA_API, JwtRegex } from 'app/utils/constants';
import handleRequestError from 'app/utils/handleRequestError';
import parseCookies from 'app/utils/parseCookies';
import redirectToUrl from 'app/utils/redirectToUrl';
import { fetchAppData } from 'middleware/api/initialization';

const General = ({ fallback, query, authToken }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <MainComponent currentPath='/analytics/general' authToken={authToken}>
        <ClinicAnalytics query={query} />
      </MainComponent>
    </SWRConfig>
  );
};

export default General;

export const getServerSideProps = async ({ req, query }) => {
  try {
    if (query.startDate == null) {
      query.startDate = moment().startOf('week').format('YYYY-MM-DD');
    }
    if (query.endDate == null) {
      query.endDate = moment().endOf('week').format('YYYY-MM-DD');
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
        authToken,
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
