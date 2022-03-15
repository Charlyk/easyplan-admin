import React from 'react';
import { connect } from 'react-redux';
import { END } from 'redux-saga';
import { JwtRegex } from 'app/utils/constants';
import handleRequestError from 'app/utils/handleRequestError';
import parseCookies from 'app/utils/parseCookies';
import redirectToUrl from 'app/utils/redirectToUrl';
import { loginUrl } from 'eas.config';
import {
  currentClinicSelector,
  currentUserSelector,
} from 'redux/selectors/appDataSelector';
import { setCookies } from 'redux/slices/appDataSlice';
import { wrapper } from 'store';

const MainPage = () => {
  return <div />;
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req }) => {
      try {
        // end the saga
        store.dispatch(END);
        await store.sagaTask.toPromise();
        const { auth_token: authToken } = parseCookies(req);
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

        // fetch page data
        const appState = store.getState();
        const currentUser = currentUserSelector(appState);
        const currentClinic = currentClinicSelector(appState);

        const redirectTo = redirectToUrl(currentUser, currentClinic, '/');
        if (redirectTo != null) {
          return {
            redirect: {
              destination: redirectTo,
              permanent: false,
            },
          };
        }

        return {
          redirect: {
            destination: loginUrl,
            permanent: false,
          },
        };
      } catch (error) {
        return handleRequestError(error);
      }
    },
);

export default connect((state) => state)(MainPage);
