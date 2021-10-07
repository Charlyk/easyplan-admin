import React from 'react';
import moment from 'moment-timezone';
import { SWRConfig } from "swr";
import handleRequestError from '../../../utils/handleRequestError';
import redirectToUrl from '../../../utils/redirectToUrl';
import redirectUserTo from '../../../utils/redirectUserTo';
import MainComponent from "../../../app/components/common/MainComponent/MainComponent";
import { getDoctorsStatistics } from "../../../middleware/api/analytics";
import { fetchAppData } from "../../../middleware/api/initialization";
import parseCookies from "../../../utils/parseCookies";
import DoctorsAnalytics from "../../../app/components/dashboard/analytics/DoctorsAnalytics";
import { APP_DATA_API, JwtRegex } from "../../../app/utils/constants";

const Doctors = ({ fallback, statistics, query: initialQuery, authToken }) => {

  return (
    <SWRConfig value={{ fallback }}>
      <MainComponent
        currentPath='/analytics/doctors'
        authToken={authToken}
      >
        <DoctorsAnalytics
          query={initialQuery}
          statistics={statistics}
        />
      </MainComponent>
    </SWRConfig>
  );
};

export const getServerSideProps = async ({ req, res, query }) => {
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
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/analytics/doctors');
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

    const { data: statistics } = await getDoctorsStatistics(query, req.headers);
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
      },
    };
  } catch (error) {
    await handleRequestError(error, req, res);
    return {
      props: {
        statistics: [],
        query: {},
      }
    };
  }
}

export default Doctors;
