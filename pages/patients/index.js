import React from 'react';
import {
  handleRequestError,
  redirectToUrl,
  redirectUserTo,
} from '../../utils/helperFuncs';
import MainComponent from "../../app/components/common/MainComponent/MainComponent";
import { getPatients } from "../../middleware/api/patients";
import { fetchAppData } from "../../middleware/api/initialization";
import { parseCookies } from "../../utils";
import PatientsList from "../../app/components/dashboard/patients/PatientsList";

const NewPatients = (
  {
    currentUser,
    currentClinic,
    data,
    query: initialQuery,
    authToken
  }
) => {
  return (
    <MainComponent
      currentClinic={currentClinic}
      currentUser={currentUser}
      currentPath='/patients'
      authToken={authToken}
    >
      <PatientsList
        authToken={authToken}
        query={initialQuery}
        currentClinic={currentClinic}
        data={data}
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
    const { auth_token: authToken } = parseCookies(req);
    const appData = await fetchAppData(req.headers);
    const { currentUser, currentClinic } = appData;
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/patients');
    if (redirectTo != null) {
      redirectUserTo(redirectTo, res);
      return { props: { ...appData } };
    }

    const response = await getPatients(query, req.headers);
    const { data } = response;
    return {
      props: {
        authToken,
        query,
        data,
        ...appData
      },
    };
  } catch (error) {
    await handleRequestError(error, req, res);
    return {
      props: {
        query,
        data: {
          patients: [],
          total: 0,
        },
      },
    };
  }
}

export default NewPatients;
