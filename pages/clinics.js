import React from 'react';
import { getCurrentUser } from "../middleware/api/auth";
import { handleRequestError } from "../utils/helperFuncs";
import { parseCookies } from "../utils";
import ClinicsList from "../app/components/common/ClinicsList";
import { wrapper } from "../store";

const Clinics = ({ user, authToken }) => {
  return <ClinicsList authToken={authToken} user={user} />;
};

export const getServerSideProps = async ({ req, res }) => {
  try {
    const { auth_token } = parseCookies(req);
    const response = await getCurrentUser(req.headers);
    return {
      props: {
        user: response.data,
        authToken: auth_token,
      },
    };
  } catch (error) {
    await handleRequestError(error, req, res);
    return {
      props: {}
    }
  }
};

export default wrapper.withRedux(Clinics);
