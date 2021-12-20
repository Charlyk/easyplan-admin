import React from 'react';
import { connect } from 'react-redux';
import MainComponent from 'app/components/common/MainComponent/MainComponent';
import UsersList from 'app/components/dashboard/users/UsersList';
import { JwtRegex } from 'app/utils/constants';
import handleRequestError from 'app/utils/handleRequestError';
import redirectToUrl from 'app/utils/redirectToUrl';
import withClinicAndUser from 'hocs/withClinicAndUser';
import {
  authTokenSelector,
  currentClinicSelector,
  currentUserSelector,
} from 'redux/selectors/appDataSelector';
import { setCookies } from 'redux/slices/appDataSlice';
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
  (store) => async (context) => {
    try {
      await withClinicAndUser(store, context);
      const { req } = context;
      const appState = store.getState();
      const authToken = authTokenSelector(appState);
      const currentUser = currentUserSelector(appState);
      const currentClinic = currentClinicSelector(appState);
      const cookies = req?.headers?.cookie ?? '';
      store.dispatch(setCookies(cookies));

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
