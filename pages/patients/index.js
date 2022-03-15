import React from 'react';
import { connect } from 'react-redux';
import { END } from 'redux-saga';
import MainComponent from 'app/components/common/MainComponent/MainComponent';
import PatientsList from 'app/components/dashboard/patients/PatientsList';
import { JwtRegex } from 'app/utils/constants';
import handleRequestError from 'app/utils/handleRequestError';
import redirectToUrl from 'app/utils/redirectToUrl';
import { loginUrl } from 'eas.config';
import { getPatients } from 'middleware/api/patients';
import {
  authTokenSelector,
  currentClinicSelector,
  currentUserSelector,
} from 'redux/selectors/appDataSelector';
import { setCookies } from 'redux/slices/appDataSlice';
import { setPatients } from 'redux/slices/patientsListSlice';
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
        // end the saga
        store.dispatch(END);
        await store.sagaTask.toPromise();

        // fetch page data
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
        const cookies = req?.headers?.cookie ?? '';
        store.dispatch(setCookies(cookies));
        if (!authToken || !authToken.match(JwtRegex)) {
          return {
            redirect: {
              destination: loginUrl,
              permanent: false,
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
              permanent: false,
            },
          };
        }
        const response = await getPatients(query, req.headers);
        const { data } = response;
        store.dispatch(setPatients(data));
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
