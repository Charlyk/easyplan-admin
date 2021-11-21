import React from 'react';
import RegistrationWrapper from 'app/components/common/RegistrationWrapper';
import checkIsMobileDevice from 'app/utils/checkIsMobileDevice';
import { wrapper } from 'store';

const Register = ({ isMobile }) => {
  return <RegistrationWrapper isMobile={isMobile} />;
};

export const getServerSideProps = async ({ req }) => {
  const isMobile = checkIsMobileDevice(req);

  return {
    props: {
      isMobile,
    },
  };
};

export default wrapper.withRedux(Register);
