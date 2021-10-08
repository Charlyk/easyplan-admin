import React from 'react';
import { getCurrentUser } from "../middleware/api/auth";
import parseCookies from "../utils/parseCookies";
import ClinicsList from "../app/components/common/ClinicsList";
import { wrapper } from "../store";
import { JwtRegex } from "../app/utils/constants";
import handleRequestError from "../utils/handleRequestError";

const Clinics = ({ user, authToken }) => {
  return <ClinicsList authToken={authToken} user={user} />;
};

export const getServerSideProps = async ({ req, res }) => {
  try {
    const { auth_token } = parseCookies(req);
    if (!auth_token || !auth_token.match(JwtRegex)) {
      return {
        redirect: {
          destination: '/login',
          permanent: true,
        },
      };
    }

    const response = await getCurrentUser(req.headers);
    return {
      props: {
        user: response.data,
        authToken: auth_token,
      },
    };
  } catch (error) {
    return handleRequestError(error);
  }
};

export default wrapper.withRedux(Clinics);
