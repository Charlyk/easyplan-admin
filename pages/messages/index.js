import React from 'react';
import { connect } from 'react-redux';
import { END } from 'redux-saga';
import MainComponent from 'app/components/common/MainComponent/MainComponent';
import SMSMessages from 'app/components/dashboard/messages/SMSMessages';
import { JwtRegex } from 'app/utils/constants';
import handleRequestError from 'app/utils/handleRequestError';
import redirectToUrl from 'app/utils/redirectToUrl';
import { getMessages } from 'middleware/api/messages';
import {
  authTokenSelector,
  currentClinicSelector,
  currentUserSelector,
} from 'redux/selectors/appDataSelector';
import { setCookies } from 'redux/slices/appDataSlice';
import { wrapper } from 'store';

const Messages = ({ messages: initialMessages }) => {
  return (
    <MainComponent currentPath='/messages'>
      <SMSMessages messages={initialMessages} />
    </MainComponent>
  );
};

export default connect((state) => state)(Messages);

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req }) => {
      try {
        // end the saga
        store.dispatch(END);
        await store.sagaTask.toPromise();

        // fetch page data
        const appState = store.getState();
        const authToken = authTokenSelector(appState);
        const currentUser = currentUserSelector(appState);
        const currentClinic = currentClinicSelector(appState);
        const cookies = req?.headers?.cookie ?? '';
        store.dispatch(setCookies(cookies));
        if (!authToken || !authToken.match(JwtRegex)) {
          return {
            redirect: {
              destination: '/login',
              permanent: true,
            },
          };
        }

        const redirectTo = redirectToUrl(
          currentUser,
          currentClinic,
          '/messages',
        );
        if (redirectTo != null) {
          return {
            redirect: {
              destination: redirectTo,
              permanent: true,
            },
          };
        }

        const response = await getMessages(req.headers);
        const { data } = response;
        return {
          props: {
            messages: data,
          },
        };
      } catch (error) {
        return handleRequestError(error);
      }
    },
);
