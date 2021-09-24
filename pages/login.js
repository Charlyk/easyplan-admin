import React from 'react';
import { getCurrentUser } from "../middleware/api/auth";
import LoginWrapper from "../app/components/common/LoginWrapper";
import { wrapper } from "../store";
import { getClinicDetails } from "../middleware/api/clinic";
import parseCookies from "../utils/parseCookies";

const Login = ({ currentUser, currentClinic, authToken }) => {
  return (
    <LoginWrapper
      currentUser={currentUser}
      currentClinic={currentClinic}
      authToken={authToken}
    />
  );
};

export const getServerSideProps = async ({ req }) => {
  const { auth_token: authToken } = parseCookies(req);

  const props = { authToken: authToken ?? null };
  try {
    const response = await getCurrentUser(req.headers);
    props.currentUser = response.data;
  } catch (error) {
    console.error(error);
  }

  try {
    const response = await getClinicDetails(null, req.headers);
    props.currentClinic = response.data;
  } catch (error) {
    console.error(error);
  }

  return { props };
};

export default wrapper.withRedux(Login);
