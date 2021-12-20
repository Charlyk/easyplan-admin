import React from 'react';
import { connect } from 'react-redux';
import LoginWrapper from 'app/components/common/LoginWrapper';
import checkIsMobileDevice from 'app/utils/checkIsMobileDevice';
import parseCookies from 'app/utils/parseCookies';
import setCookies from 'app/utils/setCookies';
import { getCurrentUser } from 'middleware/api/auth';
import { getClinicDetails } from 'middleware/api/clinic';
import {
  setCookies as storeCookies,
  setCurrentClinic,
  setCurrentUser,
} from 'redux/slices/appDataSlice';
import { wrapper } from 'store';
import getRedirectUrlForUser from '../app/utils/getRedirectUrlForUser';

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
        store.dispatch(setCurrentUser(response.data));
      } catch (error) {
        console.error(error.message);
      }

      try {
        const response = await getClinicDetails(null, req.headers);
        props.currentClinic = response.data;
        setCookies(res, authToken, props.currentClinic.id);
        store.dispatch(setCurrentClinic(response.data));
      } catch (error) {
        console.error(error.message);
      }

      if (props.currentUser != null && props.currentClinic != null) {
        const path = getRedirectUrlForUser(
          props.currentUser,
          props.currentClinic.domainName,
        );
        return {
          redirect: {
            destination: path,
            permanent: true,
          },
        };
      }

      return { props };
    },
);
