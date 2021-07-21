import React from 'react';
import { wrapper } from "../store";
import RegistrationWrapper from "../app/components/common/RegistrationWrapper";

const Register = () => {
  return <RegistrationWrapper />;
};

export const getServerSideProps = async () => {
  return {
    props: {}
  }
};

export default wrapper.withRedux(Register);
