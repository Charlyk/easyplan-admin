import React from 'react';
import { SWRConfig } from "swr";
import redirectToUrl from '../../utils/redirectToUrl';
import MainComponent from "../../app/components/common/MainComponent/MainComponent";
import { getMessages } from "../../middleware/api/messages";
import { fetchAppData } from "../../middleware/api/initialization";
import parseCookies from "../../utils/parseCookies";
import SMSMessages from "../../app/components/dashboard/messages/SMSMessages";
import { APP_DATA_API, JwtRegex } from "../../app/utils/constants";
import handleRequestError from "../../utils/handleRequestError";

const Messages = ({ fallback, messages: initialMessages, authToken }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <MainComponent
        currentPath='/messages'
        authToken={authToken}
      >
        <SMSMessages messages={initialMessages}/>
      </MainComponent>
    </SWRConfig>
  );
};

export const getServerSideProps = async ({ req }) => {
  try {
    const { auth_token: authToken } = parseCookies(req);
    if (!authToken || !authToken.match(JwtRegex)) {
      return {
        redirect: {
          destination: '/login',
          permanent: true,
        },
      };
    }

    const appData = await fetchAppData(req.headers);
    const { currentUser, currentClinic } = appData.data;
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/messages');
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
        authToken,
        messages: data,
        fallback: {
          [APP_DATA_API]: {
            ...appData.data
          }
        },
      },
    };
  } catch (error) {
    return handleRequestError(error);
  }
}

export default Messages;
