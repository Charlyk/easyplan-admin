import React from 'react';
import { SWRConfig } from "swr";
import MainComponent from "../../app/components/common/MainComponent/MainComponent";
import { fetchAppData } from "../../middleware/api/initialization";
import redirectToUrl from '../../app/utils/redirectToUrl';
import parseCookies from "../../app/utils/parseCookies";
import { fetchAllCountries } from "../../middleware/api/countries";
import SettingsWrapper from "../../app/components/dashboard/settings/SettingsWrapper";
import { APP_DATA_API, JwtRegex } from "../../app/utils/constants";
import handleRequestError from "../../app/utils/handleRequestError";

const Settings = ({ fallback, countries, authToken }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <MainComponent
        currentPath='/settings'
        authToken={authToken}
      >
        <SettingsWrapper
          countries={countries}
        />
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
    const { data: countries } = await fetchAllCountries(req.headers);
    const { currentUser, currentClinic } = appData.data;
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/settings');
    if (redirectTo != null) {
      return {
        redirect: {
          destination: redirectTo,
          permanent: true,
        },
      };
    }

    return {
      props: {
        fallback: {
          [APP_DATA_API]: {
            ...appData.data
          }
        },
        countries,
        authToken,
      }
    }
  } catch (error) {
    return handleRequestError(error);
  }
}

export default Settings;
