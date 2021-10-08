import React from 'react';
import { getCurrentUser } from "../middleware/api/auth";
import LoginWrapper from "../app/components/common/LoginWrapper";
import { wrapper } from "../store";
import { getClinicDetails } from "../middleware/api/clinic";
import parseCookies from "../utils/parseCookies";
import setCookies from "../utils/setCookies";

const Login = ({ currentUser, currentClinic, authToken }) => {
  return (
    <LoginWrapper
      currentUser={currentUser}
      currentClinic={currentClinic}
      authToken={authToken}
    />
  );
};

export const getServerSideProps = async ({ req, res }) => {
  const { auth_token: authToken } = parseCookies(req);

  if (authToken == null) {
    return { props: { } };
  }

  const props = { authToken: authToken ?? null };
  try {
    const response = await getCurrentUser(req.headers);
    props.currentUser = response.data;
  } catch (error) {
    console.error(error.message);
  }

  try {
    const response = await getClinicDetails(null, req.headers);
    props.currentClinic = response.data;
    setCookies(res, authToken, props.currentClinic.id);
  } catch (error) {
    // console.error(error.message);
  }

  return { props };
};

export default wrapper.withRedux(Login);
