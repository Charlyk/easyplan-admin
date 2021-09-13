import React from 'react';
import handleRequestError from '../../utils/handleRequestError';
import redirectToUrl from '../../utils/redirectToUrl';
import redirectUserTo from '../../utils/redirectUserTo';
import MainComponent from "../../app/components/common/MainComponent/MainComponent";
import { getUsers } from "../../middleware/api/users";
import { fetchAppData } from "../../middleware/api/initialization";
import { parseCookies } from "../../utils";
import UsersList from "../../app/components/dashboard/users/UsersList";

const Users = (
  {
    currentUser,
    currentClinic,
    users: initialUsers,
    invitations: initialInvitations,
    authToken,
  }
) => {
  return (
    <MainComponent
      currentUser={currentUser}
      currentClinic={currentClinic}
      currentPath='/users'
      authToken={authToken}
    >
      <UsersList
        users={initialUsers}
        currentClinic={currentClinic}
        invitations={initialInvitations}
      />
    </MainComponent>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  try {
    const { auth_token: authToken } = parseCookies(req);
    const appData = await fetchAppData(req.headers);
    const { currentUser, currentClinic } = appData.data;
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/users');
    if (redirectTo != null) {
      redirectUserTo(redirectTo, res);
      return { props: { ...appData.data } };
    }

    const response = await getUsers(req.headers);
    return {
      props: {
        ...response.data,
        ...appData.data,
        authToken,
      }
    }
  } catch (error) {
    await handleRequestError(error, req, res);
    return {
      props: {
        users: [],
        invitations: [],
      }
    }
  }
}

export default Users;
