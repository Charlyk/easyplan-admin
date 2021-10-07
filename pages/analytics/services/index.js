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
import { APP_DATA_API, JwtRegex } from "../../../app/utils/constants";
import { SWRConfig } from "swr";

export default function Services(
  {
    fallback,
    statistics,
    query,
    authToken,
  }
) {
  return (
    <SWRConfig value={{ fallback }}>
      <MainComponent
        currentPath='/analytics/services'
        authToken={authToken}
      >
        <ServicesAnalytics
          query={query}
          statistics={statistics}
        />
      </MainComponent>
    </SWRConfig>
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
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/analytics/services');
    if (redirectTo != null) {
      redirectUserTo(redirectTo, res);
      return {
        props: {
          fallback: {
            [APP_DATA_API]: {
              ...appData.data
            }
          }
        }
      };
    }

    const { data: statistics } = await getServicesStatistics(query, req.headers);
    return {
      props: {
        authToken,
        statistics,
        query,
        fallback: {
          [APP_DATA_API]: {
            ...appData.data
          }
        }
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
