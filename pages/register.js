import React from 'react';
import { connect } from 'react-redux';
import RegistrationWrapper from 'app/components/common/RegistrationWrapper';
import checkIsMobileDevice from 'app/utils/checkIsMobileDevice';

const Register = ({ isMobile }) => {
  return <RegistrationWrapper isMobile={isMobile} />;
};

export default connect((state) => state)(Register);

export const getServerSideProps = async ({ req }) => {
  const isMobile = checkIsMobileDevice(req);

  return {
    props: {
      isMobile,
    },
  };
};
