import React from 'react';
import { connect } from 'react-redux';
import { END } from 'redux-saga';
import RegistrationWrapper from 'app/components/common/RegistrationWrapper';
import checkIsMobileDevice from 'app/utils/checkIsMobileDevice';
import { setCookies } from 'redux/slices/appDataSlice';
import { wrapper } from 'store';

const Register = ({ isMobile }) => {
  return <RegistrationWrapper isMobile={isMobile} />;
};

export default connect((state) => state)(Register);

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req }) => {
      // end the saga
      store.dispatch(END);
      await store.sagaTask.toPromise();

      // fetch page data
      const isMobile = checkIsMobileDevice(req);
      const cookies = req?.headers?.cookie ?? '';
      store.dispatch(setCookies(cookies));

      return {
        props: {
          isMobile,
        },
      };
    },
);
