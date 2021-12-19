import React from 'react';
import { connect } from 'react-redux';
import ResetPasswordPage from 'app/components/common/ResetPasswordPage';
import { JwtRegex } from 'app/utils/constants';
import { setCookies } from 'redux/slices/appDataSlice';
import { wrapper } from 'store';

const ResetPasswordForm = ({ token }) => {
  return <ResetPasswordPage token={token} />;
};

export default connect((state) => state)(ResetPasswordForm);

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query, req }) => {
      const { token } = query;
      const cookies = req?.headers?.cookie ?? '';
      store.dispatch(setCookies(cookies));

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
    },
);
