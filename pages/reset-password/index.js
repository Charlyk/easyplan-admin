import React from 'react';
import { JwtRegex } from '../../app/utils/constants';
import { wrapper } from "../../store";
import ResetPasswordPage from "../../app/components/common/ResetPasswordPage";

const ResetPasswordForm = ({ token }) => {
  return <ResetPasswordPage token={token} />;
};

export const getServerSideProps = async ({ res, query }) => {
  const { token } = query;

  if (!token.match(JwtRegex)) {
    res.writeHead(302, { Location: `/login` });
    res.end();
    return { props: { token } };
  }

  return {
    props: {
      token
    }
  }
}

export default wrapper.withRedux(ResetPasswordForm);
