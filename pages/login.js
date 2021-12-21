import React from 'react';
import { connect } from 'react-redux';
import LoginWrapper from 'app/components/common/LoginWrapper';
import checkIsMobileDevice from 'app/utils/checkIsMobileDevice';
import getRedirectUrlForUser from 'app/utils/getRedirectUrlForUser';
import parseCookies from 'app/utils/parseCookies';
import setCookies from 'app/utils/setCookies';
import { getCurrentUser } from 'middleware/api/auth';
import { getClinicDetails } from 'middleware/api/clinic';

const Login = ({ currentUser, currentClinic, authToken, isMobile }) => {
  return (
    <LoginWrapper
      isMobile={isMobile}
      currentUser={currentUser}
      currentClinic={currentClinic}
      authToken={authToken}
    />
  );
};

export default connect((state) => state)(Login);

export const getServerSideProps = async ({ req, res }) => {
  const isMobile = checkIsMobileDevice(req);
  const { auth_token: authToken } = parseCookies(req);

  if (authToken == null) {
    return { props: { isMobile } };
  }

  const props = { authToken: authToken ?? null, isMobile };
  try {
    const response = await getCurrentUser(req.headers);
    props.currentUser = response.data;
  } catch (error) {
    console.error('Login - user', error.message);
  }

  try {
    const response = await getClinicDetails(null, req.headers);
    props.currentClinic = response.data;
    setCookies(res, authToken, props.currentClinic.id);
  } catch (error) {
    console.error('Login - clinic', error.message);
  }

  if (props.currentClinic != null && props.currentUser != null) {
    const redirectTo = getRedirectUrlForUser(
      props.currentUser,
      props.currentClinic.domainName,
    );
    if (redirectTo != null) {
      return {
        redirect: {
          destination: redirectTo,
          permanent: true,
        },
      };
    }
  }

  return { props };
};
