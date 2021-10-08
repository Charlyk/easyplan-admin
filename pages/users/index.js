import React from 'react';
import { SWRConfig } from "swr";
import redirectToUrl from '../../app/utils/redirectToUrl';
import MainComponent from "../../app/components/common/MainComponent/MainComponent";
import { getUsers } from "../../middleware/api/users";
import { fetchAppData } from "../../middleware/api/initialization";
import parseCookies from "../../app/utils/parseCookies";
import UsersList from "../../app/components/dashboard/users/UsersList";
import { APP_DATA_API, JwtRegex } from "../../app/utils/constants";
import handleRequestError from "../../app/utils/handleRequestError";

const Users = (
  {
    fallback,
    users: initialUsers,
    invitations: initialInvitations,
    authToken,
  }
) => {
  return (
    <SWRConfig value={{ fallback }}>
      <MainComponent
        currentPath='/users'
        authToken={authToken}
      >
        <UsersList
          users={initialUsers}
          invitations={initialInvitations}
        />
      </MainComponent>
    </SWRConfig>
  );
};

export const getServerSideProps = async ({ req }) => {
  try {
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
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/users');
    if (redirectTo != null) {
      return {
        redirect: {
          destination: redirectTo,
          permanent: true,
        },
      };
    }

    const response = await getUsers(req.headers);
    return {
      props: {
        ...response.data,
        fallback: {
          [APP_DATA_API]: {
            ...appData.data
          },
        },
        authToken,
      }
    }
  } catch (error) {
    return handleRequestError(error);
  }
}

export default Users;
