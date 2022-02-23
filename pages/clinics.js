import React from 'react';
import { connect } from 'react-redux';
import { END } from 'redux-saga';
import ClinicsList from 'app/components/common/ClinicsList';
import checkIsMobileDevice from 'app/utils/checkIsMobileDevice';
import { JwtRegex } from 'app/utils/constants';
import handleRequestError from 'app/utils/handleRequestError';
import parseCookies from 'app/utils/parseCookies';
import { loginUrl } from 'eas.config';
import { getCurrentUser } from 'middleware/api/auth';
import { setCookies } from 'redux/slices/appDataSlice';
import { wrapper } from 'store';

const Clinics = ({ user, authToken, isMobile }) => {
  return <ClinicsList authToken={authToken} user={user} isMobile={isMobile} />;
};

export default connect((state) => state)(Clinics);

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req }) => {
      try {
        // end the saga
        store.dispatch(END);
        await store.sagaTask.toPromise();

        // fetch page data
        const isMobile = checkIsMobileDevice(req);
        const cookies = req?.headers?.cookie ?? '';
        const { auth_token: authToken } = parseCookies(req);
        if (!authToken || !authToken.match(JwtRegex)) {
          return {
            redirect: {
              destination: loginUrl,
              permanent: true,
            },
          };
        }
        const response = await getCurrentUser(req.headers);
        store.dispatch(setCookies(cookies));
        return {
          props: {
            isMobile,
            authToken,
            user: response.data,
          },
        };
      } catch (error) {
        return handleRequestError(error);
      }
    },
);
