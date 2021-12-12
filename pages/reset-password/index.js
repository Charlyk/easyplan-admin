import React from 'react';
import { connect } from 'react-redux';
import ResetPasswordPage from 'app/components/common/ResetPasswordPage';
import { JwtRegex } from 'app/utils/constants';

const ResetPasswordForm = ({ token }) => {
  return <ResetPasswordPage token={token} />;
};

export default connect((state) => state)(ResetPasswordForm);

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
      token: token ?? '',
    },
  };
};
