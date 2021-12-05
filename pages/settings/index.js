import React from 'react';
import { connect } from 'react-redux';
import { SWRConfig } from 'swr';
import MainComponent from 'app/components/common/MainComponent/MainComponent';
import SettingsWrapper from 'app/components/dashboard/settings/SettingsWrapper';
import { APP_DATA_API, JwtRegex } from 'app/utils/constants';
import handleRequestError from 'app/utils/handleRequestError';
import parseCookies from 'app/utils/parseCookies';
import redirectToUrl from 'app/utils/redirectToUrl';
import { fetchAllCountries } from 'middleware/api/countries';
import { fetchAppData } from 'middleware/api/initialization';

const Settings = ({ fallback, countries, authToken, menu }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <MainComponent currentPath='/settings' authToken={authToken}>
        <SettingsWrapper countries={countries} selectedMenu={menu} />
      </MainComponent>
    </SWRConfig>
  );
};

export const getServerSideProps = async ({ req, query }) => {
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
            ...appData.data,
          },
        },
        menu: query?.menu ?? '',
        countries,
        authToken,
      },
    };
  } catch (error) {
    return handleRequestError(error);
  }
};

export default connect((state) => state)(Settings);
