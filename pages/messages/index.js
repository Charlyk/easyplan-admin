import React from 'react';
import handleRequestError from '../../utils/handleRequestError';
import redirectToUrl from '../../utils/redirectToUrl';
import redirectUserTo from '../../utils/redirectUserTo';
import MainComponent from "../../app/components/common/MainComponent/MainComponent";
import { getMessages } from "../../middleware/api/messages";
import { fetchAppData } from "../../middleware/api/initialization";
import parseCookies from "../../utils/parseCookies";
import SMSMessages from "../../app/components/dashboard/messages/SMSMessages";

const Messages = ({ currentUser, currentClinic, messages: initialMessages, authToken }) => {
  return (
    <MainComponent
      currentClinic={currentClinic}
      currentUser={currentUser}
      currentPath='/messages'
      authToken={authToken}
    >
      <SMSMessages messages={initialMessages} currentClinic={currentClinic} />
    </MainComponent>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  try {
    const { auth_token: authToken } = parseCookies(req);
    const appData = await fetchAppData(req.headers);
    const { currentUser, currentClinic } = appData.data;
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/messages');
    if (redirectTo != null) {
      redirectUserTo(redirectTo, res);
      return { props: { ...appData.data } };
    }

    const response = await getMessages(req.headers);
    const { data } = response;
    return {
      props: {
        authToken,
        messages: data,
        ...appData.data,
      },
    };
  } catch (error) {
    await handleRequestError(error, req, res);
    return {
      props: {
        messages: [],
      },
    };
  }
}

export default Messages;
