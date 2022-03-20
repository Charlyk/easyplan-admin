import React from 'react';
import { connect } from 'react-redux';
import LoginWrapper from 'app/components/common/LoginWrapper';
import { loginUrl } from '../eas.config';

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

export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: loginUrl,
      permanent: true,
    },
  };
};
