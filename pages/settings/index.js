import React from 'react';
import { SWRConfig } from "swr";
import MainComponent from "../../app/components/common/MainComponent/MainComponent";
import { fetchAppData } from "../../middleware/api/initialization";
import handleRequestError from '../../utils/handleRequestError';
import redirectToUrl from '../../utils/redirectToUrl';
import redirectUserTo from '../../utils/redirectUserTo';
import parseCookies from "../../utils/parseCookies";
import { fetchAllCountries } from "../../middleware/api/countries";
import SettingsWrapper from "../../app/components/dashboard/settings/SettingsWrapper";
import { APP_DATA_API, JwtRegex } from "../../app/utils/constants";

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

export const getServerSideProps = async ({ req, res }) => {
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
      redirectUserTo(redirectTo, res);
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
    console.error(error);
    await handleRequestError(error, req, res);
    return {
      props: {}
    }
  }
}

export default Settings;
