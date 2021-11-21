import React from 'react';
import ClinicsList from 'app/components/common/ClinicsList';
import checkIsMobileDevice from 'app/utils/checkIsMobileDevice';
import { JwtRegex } from 'app/utils/constants';
import handleRequestError from 'app/utils/handleRequestError';
import parseCookies from 'app/utils/parseCookies';
import { getCurrentUser } from 'middleware/api/auth';
import { wrapper } from 'store';

const Clinics = ({ user, authToken, isMobile }) => {
  return <ClinicsList authToken={authToken} user={user} isMobile={isMobile} />;
};

export const getServerSideProps = async ({ req, res }) => {
  try {
    const isMobile = checkIsMobileDevice(req);
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
        isMobile,
        user: response.data,
        authToken: auth_token,
      },
    };
  } catch (error) {
    return handleRequestError(error);
  }
};

export default wrapper.withRedux(Clinics);
