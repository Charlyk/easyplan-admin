import React from 'react';

import { getCurrentUser } from "../middleware/api/auth";
import LoginWrapper from "../app/components/common/LoginWrapper";
import { wrapper } from "../store";

const Login = ({ currentUser }) => {
  return <LoginWrapper currentUser={currentUser} />;
};

export const getServerSideProps = async ({ req }) => {
  try {
    const response = await getCurrentUser(req.headers);
    return {
      props: {
        currentUser: response.data,
      },
    };
  } catch (error) {
    return {
      props: {}
    }
  }
};

export default wrapper.withRedux(Login);
