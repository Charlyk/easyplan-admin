import React from 'react';
import { connect } from 'react-redux';
import { END } from 'redux-saga';
import MainComponent from 'app/components/common/MainComponent/MainComponent';
import ServicesContainer from 'app/components/dashboard/services/ServicesContainer';
import { JwtRegex } from 'app/utils/constants';
import handleRequestError from 'app/utils/handleRequestError';
import redirectToUrl from 'app/utils/redirectToUrl';
import { loginUrl } from 'eas.config';
import { fetchAllServices } from 'middleware/api/services';
import {
  authTokenSelector,
  currentClinicSelector,
  currentUserSelector,
} from 'redux/selectors/appDataSelector';
import { setCookies } from 'redux/slices/appDataSlice';
import { setServicesData } from 'redux/slices/servicesListSlice';
import { wrapper } from 'store';

const Services = ({ categories: clinicCategories, services }) => {
  return (
    <MainComponent currentPath='/services'>
      <ServicesContainer services={services} categories={clinicCategories} />
    </MainComponent>
  );
};

export default connect((state) => state)(Services);

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req }) => {
      try {
        // end the saga
        store.dispatch(END);
        await store.sagaTask.toPromise();

        // fetch page data
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

        const response = await fetchAllServices(req.headers);
        store.dispatch(setServicesData(response.data));

        const redirectTo = redirectToUrl(
          currentUser,
          currentClinic,
          '/services',
        );
        if (redirectTo != null) {
          return {
            redirect: {
              destination: redirectTo,
              permanent: false,
            },
          };
        }

        return {
          props: {},
        };
      } catch (error) {
        return handleRequestError(error);
      }
    },
);
