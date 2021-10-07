import React from 'react';
import { SWRConfig } from "swr";
import handleRequestError from '../../utils/handleRequestError';
import redirectToUrl from '../../utils/redirectToUrl';
import redirectUserTo from '../../utils/redirectUserTo';
import MainComponent from "../../app/components/common/MainComponent/MainComponent";
import { getUsers } from "../../middleware/api/users";
import { fetchAppData } from "../../middleware/api/initialization";
import parseCookies from "../../utils/parseCookies";
import UsersList from "../../app/components/dashboard/users/UsersList";
import { APP_DATA_API, JwtRegex } from "../../app/utils/constants";

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

export const getServerSideProps = async ({ req, res }) => {
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
      redirectUserTo(redirectTo, res);
      return {
        props: {
          fallback: {
            [APP_DATA_API]: {
              ...appData.data
            }
          },
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
