import React from 'react';
import { connect } from 'react-redux';
import { END } from 'redux-saga';
import RegistrationWrapper from 'app/components/common/RegistrationWrapper';
import { wrapper } from 'store';
import { registerUrl } from '../eas.config';

const Register = ({ isMobile }) => {
  return <RegistrationWrapper isMobile={isMobile} />;
};

export default connect((state) => state)(Register);

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    // end the saga
    store.dispatch(END);
    await store.sagaTask.toPromise();

    return {
      redirect: {
        destination: registerUrl,
        permanent: true,
      },
    };
  },
);
