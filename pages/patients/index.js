import React from 'react';
import { connect } from 'react-redux';
import MainComponent from 'app/components/common/MainComponent/MainComponent';
import PatientsList from 'app/components/dashboard/patients/PatientsList';
import { JwtRegex } from 'app/utils/constants';
import handleRequestError from 'app/utils/handleRequestError';
import redirectToUrl from 'app/utils/redirectToUrl';
import {
  authTokenSelector,
  currentClinicSelector,
  currentUserSelector,
} from 'redux/selectors/appDataSelector';
import { fetchPatientList } from 'redux/slices/patientsListSlice';
import { wrapper } from 'store';

const NewPatients = ({ data, query: initialQuery }) => {
  return (
    <MainComponent currentPath='/patients'>
      <PatientsList query={initialQuery} data={data} />
    </MainComponent>
  );
};

export default connect((state) => state)(NewPatients);

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
        const appState = store.getState();
        const authToken = authTokenSelector(appState);
        const currentUser = currentUserSelector(appState);
        const currentClinic = currentClinicSelector(appState);
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
          '/patients',
        );
        if (redirectTo != null) {
          return {
            redirect: {
              destination: redirectTo,
              permanent: true,
            },
          };
        }

        store.dispatch(fetchPatientList({ query, headers: req.headers }));
        return {
          props: {
            query,
          },
        };
      } catch (error) {
        return handleRequestError(error);
      }
    },
);
