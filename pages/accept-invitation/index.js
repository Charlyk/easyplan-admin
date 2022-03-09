import React from 'react';
import { connect } from 'react-redux';
import { END } from 'redux-saga';
import AcceptClinicInvitation from 'app/components/common/AcceptClinicInvitation';
import checkIsMobileDevice from 'app/utils/checkIsMobileDevice';
import { JwtRegex } from 'app/utils/constants';
import { loginUrl } from 'eas.config';
import { setCookies } from 'redux/slices/appDataSlice';
import { wrapper } from 'store';

const AcceptInvitation = ({ token, isNew, isMobile }) => {
  return (
    <AcceptClinicInvitation token={token} isNew={isNew} isMobile={isMobile} />
  );
};

export default connect((state) => state)(AcceptInvitation);

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query, req }) => {
      // end the saga
      store.dispatch(END);
      await store.sagaTask.toPromise();

      // fetch page data
      const isMobile = checkIsMobileDevice(req);
      const { token, isNew } = query;
      const cookies = req?.headers?.cookie ?? '';
      store.dispatch(setCookies(cookies));
      if (!token.match(JwtRegex)) {
        return {
          redirect: {
            destination: loginUrl,
            permanent: false,
          },
        };
      }
      return {
        props: { token, isNew, isMobile },
      };
    },
);
