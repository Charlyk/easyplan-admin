import React from 'react';
import moment from 'moment-timezone';
import handleRequestError from '../../../utils/handleRequestError';
import redirectToUrl from '../../../utils/redirectToUrl';
import redirectUserTo from '../../../utils/redirectUserTo';
import MainComponent from "../../../app/components/common/MainComponent/MainComponent";
import { getServicesStatistics } from "../../../middleware/api/analytics";
import { fetchAppData } from "../../../middleware/api/initialization";
import parseCookies from "../../../utils/parseCookies";
import ServicesAnalytics from "../../../app/components/dashboard/analytics/ServicesAnalytics";

export default function Services(
  {
    currentUser,
    currentClinic,
    statistics,
    query,
    authToken,
  }
) {
  return (
    <MainComponent
      currentUser={currentUser}
      currentClinic={currentClinic}
      currentPath='/analytics/services'
      authToken={authToken}
    >
      <ServicesAnalytics
        query={query}
        currentClinic={currentClinic}
        statistics={statistics}
      />
    </MainComponent>
  );
};

export const getServerSideProps = async ({ req, res, query }) => {
  try {
    if (query.page == null) {
      query.page = 0;
    }

    if (query.rowsPerPage == null) {
      query.rowsPerPage = 25;
    }

    if (query.fromDate == null) {
      query.fromDate = moment().startOf('month').format('YYYY-MM-DD');
    }

    if (query.toDate == null) {
      query.toDate = moment().endOf('month').format('YYYY-MM-DD');
    }

    if (query.status == null) {
      query.status = 'All'
    }
    const { auth_token: authToken } = parseCookies(req);
    const appData = await fetchAppData(req.headers);
    const { currentUser, currentClinic } = appData.data;
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/analytics/services');
    if (redirectTo != null) {
      redirectUserTo(redirectTo, res);
      return { props: { ...appData.data } };
    }

    const { data: statistics } = await getServicesStatistics(query, req.headers);
    return {
      props: {
        authToken,
        statistics,
        query,
        ...appData.data,
      }
    };
  } catch (error) {
    await handleRequestError(error, req, res)
    return {
      props: {
        statistics: [],
        query: {},
      },
    };
  }
}
