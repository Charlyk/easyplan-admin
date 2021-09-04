import React, { useEffect } from "react";
import MainComponent from "../app/components/common/MainComponent/MainComponent";
import { useRouter } from "next/router";
import { fetchAppData } from "../middleware/api/initialization";
import handleRequestError from '../utils/handleRequestError';
import getRedirectUrlForUser from '../utils/redirectToUrl';
import { parseCookies } from "../utils";

const MainPage = ({ currentClinic, currentUser, authToken }) => {
  const router = useRouter();

  useEffect(() => {
    redirectUserToPage()
  }, []);

  const redirectUserToPage = async () => {
    const redirectPath = getRedirectUrlForUser(currentUser);
    if (redirectPath == null || router.asPath === redirectPath) {
      return;
    }
    await router.replace(redirectPath);
  }

  return (
    <MainComponent
      currentClinic={currentClinic}
      currentUser={currentUser}
      authToken={authToken}
      currentPath='/'
    />
  )
}

export const getServerSideProps = async ({ req, res }) => {
  try {
    const { auth_token: authToken } = parseCookies(req);
    const appData = await fetchAppData(req.headers);
    return {
      props: {
        ...appData,
        authToken,
      }
    }
  } catch (error) {
    await handleRequestError(error, req, res);
    return {
      props: {},
    };
  }
}

export default MainPage;
