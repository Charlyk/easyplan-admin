import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { SWRConfig } from "swr";
import MainComponent from "../app/components/common/MainComponent/MainComponent";
import { fetchAppData } from "../middleware/api/initialization";
import handleRequestError from '../utils/handleRequestError';
import getRedirectUrlForUser from '../utils/redirectToUrl';
import parseCookies from "../utils/parseCookies";
import { APP_DATA_API } from "../app/utils/constants";

const MainPage = ({ fallback, authToken }) => {
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
    <SWRConfig value={{ fallback }}>
      <MainComponent
        authToken={authToken}
        currentPath='/'
      />
    </SWRConfig>
  )
}

export const getServerSideProps = async ({ req, res }) => {
  try {
    const { auth_token: authToken } = parseCookies(req);
    const appData = await fetchAppData(req.headers);
    return {
      props: {
        fallback: {
          [APP_DATA_API]: {
            ...appData.data
          }
        },
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
