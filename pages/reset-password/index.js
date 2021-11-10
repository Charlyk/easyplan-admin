import React from 'react';
import { JwtRegex } from '../../app/utils/constants';
import { wrapper } from "../../store";
import ResetPasswordPage from "../../app/components/common/ResetPasswordPage";

const ResetPasswordForm = ({ token }) => {
  return <ResetPasswordPage token={token} />;
};

export const getServerSideProps = async ({ query }) => {
  const { token } = query;

  if (!token?.match(JwtRegex)) {
    return {
      redirect: {
        destination: '/login',
        permanent: true,
      },
    };
  }

  return {
    props: {
      token: token ?? ""
    }
  }
}

export default wrapper.withRedux(ResetPasswordForm);
