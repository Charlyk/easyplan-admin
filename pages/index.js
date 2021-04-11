import React, { useEffect } from "react";
import MainComponent from "../components/common/MainComponent";
import { useRouter } from "next/router";
import { fetchAppData } from "../middleware/api/initialization";
import { getRedirectUrlForUser, handleRequestError } from "../utils/helperFuncs";

const MainPage = ({ currentClinic, currentUser }) => {
  const router = useRouter();

  useEffect(() => {
    redirectUserToPage()
  }, []);

  const redirectUserToPage = async () => {
    const [subdomain] = window.location.host.split('.');
    if (['app', 'app-dev'].includes(subdomain)) {
      await router.replace('/clinics');
      return;
    }
    const redirectPath = getRedirectUrlForUser(currentUser);
    await router.replace(redirectPath);
  }

  return (
    <MainComponent
      currentClinic={currentClinic}
      currentUser={currentUser}
      currentPath='/'
    />
  )
}

export const getServerSideProps = async ({ req, res }) => {
  try {
    const appData = await fetchAppData(req.headers);
    return {
      props: appData
    }
  } catch (error) {
    await handleRequestError(error, req, res);
    return {
      props: {},
    };
  }
}

export default MainPage;
