import React from 'react';
import { SWRConfig } from "swr";
import redirectToUrl from '../../utils/redirectToUrl';
import MainComponent from "../../app/components/common/MainComponent/MainComponent";
import { getPatients } from "../../middleware/api/patients";
import { fetchAppData } from "../../middleware/api/initialization";
import parseCookies from "../../utils/parseCookies";
import PatientsList from "../../app/components/dashboard/patients/PatientsList";
import { APP_DATA_API, JwtRegex } from "../../app/utils/constants";
import handleRequestError from "../../utils/handleRequestError";

const NewPatients = (
  {
    fallback,
    data,
    query: initialQuery,
    authToken
  }
) => {
  return (
    <SWRConfig value={{ fallback }}>
      <MainComponent
        currentPath='/patients'
        authToken={authToken}
      >
        <PatientsList
          authToken={authToken}
          query={initialQuery}
          data={data}
        />
      </MainComponent>
    </SWRConfig>
  );
};

export const getServerSideProps = async ({ req, query }) => {
  try {
    if (query.page == null) {
      query.page = 0;
    }
    if (query.rowsPerPage == null) {
      query.rowsPerPage = 25;
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
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/patients');
    if (redirectTo != null) {
      return {
        redirect: {
          destination: redirectTo,
          permanent: true,
        },
      };
    }

    const response = await getPatients(query, req.headers);
    const { data } = response;
    return {
      props: {
        authToken,
        query,
        data,
        fallback: {
          [APP_DATA_API]: {
            ...appData.data
          }
        },
      },
    };
  } catch (error) {
    return handleRequestError(error);
  }
}

export default NewPatients;
