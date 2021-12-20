import React from 'react';
import { connect } from 'react-redux';
import LoginWrapper from 'app/components/common/LoginWrapper';
import checkIsMobileDevice from 'app/utils/checkIsMobileDevice';
import parseCookies from 'app/utils/parseCookies';
import setCookies from 'app/utils/setCookies';
import { getCurrentUser } from 'middleware/api/auth';
import { getClinicDetails } from 'middleware/api/clinic';
import { setCookies as storeCookies } from 'redux/slices/appDataSlice';
import { wrapper } from 'store';

const Login = ({ currentUser, currentClinic, authToken, isMobile }) => {
  return (
    <LoginWrapper
      isMobile={isMobile}
      currentUser={currentUser}
      currentClinic={currentClinic}
      authToken={authToken}
    />
  );
};

export default connect((state) => state)(Login);

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, res }) => {
      const isMobile = checkIsMobileDevice(req);
      const cookies = req?.headers?.cookie ?? '';
      const { auth_token: authToken } = parseCookies(req);
      store.dispatch(storeCookies(cookies));

      if (authToken == null) {
        return { props: { isMobile } };
      }

      const props = { authToken: authToken ?? null, isMobile };
      try {
        const response = await getCurrentUser(req.headers);
        props.currentUser = response.data;
      } catch (error) {
        console.error(error.message);
      }

      try {
        const response = await getClinicDetails(null, req.headers);
        props.currentClinic = response.data;
        setCookies(res, authToken, props.currentClinic.id);
      } catch (error) {
        console.error(error.message);
      }

      return { props };
    },
);
