import React from 'react';
import { connect } from 'react-redux';
import { END } from 'redux-saga';
import MainComponent from 'app/components/common/MainComponent/MainComponent';
import SettingsWrapper from 'app/components/dashboard/settings/SettingsWrapper';
import { JwtRegex } from 'app/utils/constants';
import handleRequestError from 'app/utils/handleRequestError';
import parseCookies from 'app/utils/parseCookies';
import redirectToUrl from 'app/utils/redirectToUrl';
import { loginUrl } from 'eas.config';
import { fetchAllCountries } from 'middleware/api/countries';
import {
  currentClinicSelector,
  currentUserSelector,
} from 'redux/selectors/appDataSelector';
import { setCookies } from 'redux/slices/appDataSlice';
import { wrapper } from 'store';

const Settings = ({ countries, facebookCode, facebookToken, menu }) => {
  return (
    <MainComponent currentPath='/settings'>
      <SettingsWrapper
        countries={countries}
        facebookCode={facebookCode}
        facebookToken={facebookToken}
        selectedMenu={menu}
      />
    </MainComponent>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, query }) => {
      try {
        // end the saga
        store.dispatch(END);
        await store.sagaTask.toPromise();
        const appState = store.getState();
        const { auth_token: authToken } = parseCookies(req);
        const cookies = req?.headers?.cookie ?? '';
        store.dispatch(setCookies(cookies));

        if (!authToken || !authToken.match(JwtRegex)) {
          return {
            redirect: {
              destination: loginUrl,
              permanent: false,
            },
          };
        }

        // fetch page data
        const currentUser = currentUserSelector(appState);
        const currentClinic = currentClinicSelector(appState);

        const redirectTo = redirectToUrl(
          currentUser,
          currentClinic,
          '/settings',
        );
        if (redirectTo != null) {
          return {
            redirect: {
              destination: redirectTo,
              permanent: false,
            },
          };
        }

        const { data: countries } = await fetchAllCountries(req.headers);
        return {
          props: {
            menu: query?.menu ?? '',
            facebookCode: query?.code ?? '',
            facebookToken: query?.token ?? '',
            countries,
          },
        };
      } catch (error) {
        return handleRequestError(error);
      }
    },
);

export default connect((state) => state)(Settings);
