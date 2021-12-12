import React from 'react';
import { connect } from 'react-redux';
import MainComponent from 'app/components/common/MainComponent/MainComponent';
import UsersList from 'app/components/dashboard/users/UsersList';
import { JwtRegex } from 'app/utils/constants';
import handleRequestError from 'app/utils/handleRequestError';
import redirectToUrl from 'app/utils/redirectToUrl';
import {
  authTokenSelector,
  currentClinicSelector,
  currentUserSelector,
} from 'redux/selectors/appDataSelector';
import { wrapper } from 'store';

const Users = () => {
  return (
    <MainComponent currentPath='/users'>
      <UsersList />
    </MainComponent>
  );
};

export default connect((state) => state)(Users);

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    try {
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

      const redirectTo = redirectToUrl(currentUser, currentClinic, '/users');
      if (redirectTo != null) {
        return {
          redirect: {
            destination: redirectTo,
            permanent: true,
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
