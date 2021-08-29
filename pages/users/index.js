import React, { useEffect, useReducer } from 'react';

import styles from '../../app/components/dashboard/users/UsersList/UsersList.module.scss';
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@material-ui/core';
import { toast } from 'react-toastify';

import ConfirmationModal from '../../app/components/common/modals/ConfirmationModal';
import InviteUserModal from '../../components/common/InviteUserModal';
import UserDetailsModal from '../../app/components/dashboard/users/UserDetailsModal';
import { Role } from '../../app/utils/constants';
import { generateReducerActions, handleRequestError, redirectToUrl, redirectUserTo } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import UserItem from '../../app/components/dashboard/users/UserItem';
import UsersHeader from '../../app/components/dashboard/users/UserHeader';
import MainComponent from "../../app/components/common/MainComponent/MainComponent";
import { deleteUser, getUsers, inviteUser, restoreUser, updateUserCashierStatus } from "../../middleware/api/users";
import { deleteInvitation } from "../../middleware/api/clinic";
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
    const { currentUser, currentClinic } = appData;
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/users');
    if (redirectTo != null) {
      redirectUserTo(redirectTo, res);
      return { props: { ...appData } };
    }

    const response = await getUsers(req.headers);
    return {
      props: {
        ...response.data,
        ...appData,
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
