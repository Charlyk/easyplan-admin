import React from 'react';
import { connect } from 'react-redux';
import { END } from 'redux-saga';
import MainComponent from 'app/components/common/MainComponent/MainComponent';
import UsersList from 'app/components/dashboard/users/UsersList';
import { JwtRegex } from 'app/utils/constants';
import handleRequestError from 'app/utils/handleRequestError';
import redirectToUrl from 'app/utils/redirectToUrl';
import { getUsers } from 'middleware/api/users';
import {
  authTokenSelector,
  currentClinicSelector,
  currentUserSelector,
} from 'redux/selectors/appDataSelector';
import { setCookies } from 'redux/slices/appDataSlice';
import { setUsersData } from 'redux/slices/usersListSlice';
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
              destination: '/login',
              permanent: true,
            },
          };
        }

        const response = await getUsers(req.headers);
        const { users, invitations } = response.data;
        store.dispatch(setUsersData({ users, invitations }));

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
