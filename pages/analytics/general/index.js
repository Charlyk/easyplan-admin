import React from 'react';

import moment from 'moment-timezone';
import {
  handleRequestError,
  redirectToUrl,
  redirectUserTo
} from '../../../utils/helperFuncs';
import MainComponent from "../../../components/common/MainComponent";
import { getGeneralStatistics } from "../../../middleware/api/analytics";
import { fetchAppData } from "../../../middleware/api/initialization";
import { parseCookies } from "../../../utils";
import GeneralAnalytics from "../../../app/components/dashboard/analytics/GeneralAnalytics";

export default function General(
  {
    currentUser,
    currentClinic,
    scheduleStats,
    financeStats,
    query,
    authToken,
  }
) {
  return (
    <MainComponent
      currentPath='/analytics/general'
      currentUser={currentUser}
      currentClinic={currentClinic}
      authToken={authToken}
    >
      <GeneralAnalytics
        query={query}
        currentClinic={currentClinic}
        financeStats={financeStats}
        scheduleStats={scheduleStats}
      />
    </MainComponent>
  );
};

export const getServerSideProps = async ({ req, res, query }) => {
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
    const appData = await fetchAppData(req.headers);
    const { currentUser, currentClinic } = appData;
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/analytics/general');
    if (redirectTo != null) {
      redirectUserTo(redirectTo, res);
      return { props: { ...appData } };
    }

    const { data } = await getGeneralStatistics(query, req.headers);
    return {
      props: {
        ...data,
        authToken,
        query,
        ...appData
      },
    };
  } catch (error) {
    await handleRequestError(error, req, res)
    return {
      props: {
        query: {}
      }
    }
  }
}
