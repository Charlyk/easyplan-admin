import React, { useEffect } from 'react';

import MainComponent from "../../app/components/common/MainComponent/MainComponent";
import { fetchAppData } from "../../middleware/api/initialization";
import { handleRequestError, redirectToUrl, redirectUserTo } from "../../utils/helperFuncs";
import { parseCookies } from "../../utils";
import { fetchAllCountries } from "../../middleware/api/countries";
import SettingsWrapper from "../../app/components/dashboard/settings/SettingsWrapper";

const Settings = ({ currentUser, currentClinic, countries, authToken }) => {
  useEffect(() => {
    console.log(currentUser, currentClinic);
  }, [currentUser, currentClinic]);
  return (
    <MainComponent
      currentUser={currentUser}
      currentClinic={currentClinic}
      currentPath='/settings'
      authToken={authToken}
    >
      <SettingsWrapper
        currentClinic={currentClinic}
        currentUser={currentUser}
        countries={countries}
      />
    </MainComponent>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  try {
    const { auth_token: authToken } = parseCookies(req);
    const appData = await fetchAppData(req.headers);
    console.log(appData);
    const { data: countries } = await fetchAllCountries(req.headers);
    const { currentUser, currentClinic } = appData;
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/settings');
    if (redirectTo != null) {
      redirectUserTo(redirectTo, res);
      return {
        props: {
          ...appData,
          countries,
          authToken,
        }
      };
    }

    return {
      props: {
        ...appData,
        countries,
        authToken,
      }
    }
  } catch (error) {
    console.log(error);
    await handleRequestError(error, req, res);
    return {
      props: {}
    }
  }
}

export default Settings;
