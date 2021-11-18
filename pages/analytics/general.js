import React from 'react';
import moment from 'moment-timezone';
import { SWRConfig } from 'swr';
import redirectToUrl from '../../app/utils/redirectToUrl';
import MainComponent from "../../app/components/common/MainComponent/MainComponent";
import { getGeneralStatistics } from "../../middleware/api/analytics";
import { fetchAppData } from "../../middleware/api/initialization";
import parseCookies from "../../app/utils/parseCookies";
import handleRequestError from "../../app/utils/handleRequestError";
import { APP_DATA_API, JwtRegex } from "../../app/utils/constants";
import ClinicAnalytics from "../../app/components/dashboard/analytics/ClinicAnalytics";

export default function General(
  {
    fallback,
    scheduleStats,
    financeStats,
    query,
    authToken,
  }
) {
  return (
    <SWRConfig value={{ fallback }}>
      <MainComponent
        currentPath='/analytics/general'
        authToken={authToken}
      >
        <ClinicAnalytics
          query={query}
          financeStats={financeStats}
          scheduleStats={scheduleStats}
        />
      </MainComponent>
    </SWRConfig>
  );
};

export const getServerSideProps = async ({ req, query }) => {
  try {
    if (query.fromDate == null) {
      query.fromDate = moment().startOf('week').format('YYYY-MM-DD');
    }
    if (query.toDate == null) {
      query.toDate = moment().endOf('week').format('YYYY-MM-DD');
    }
    if (query.doctorId == null) {
      query.doctorId = -1;
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
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/analytics/general');
    if (redirectTo != null) {
      return {
        redirect: {
          destination: redirectTo,
          permanent: true,
        },
      };
    }

    // const { data } = await getGeneralStatistics(query, req.headers);
    return {
      props: {
        authToken,
        query,
        fallback: {
          [APP_DATA_API]: {
            ...appData.data
          }
        }
      },
    };
  } catch (error) {
    return handleRequestError(error);
  }
}
