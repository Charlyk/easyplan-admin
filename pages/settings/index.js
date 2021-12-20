import React from 'react';
import { connect } from 'react-redux';
import MainComponent from 'app/components/common/MainComponent/MainComponent';
import SettingsWrapper from 'app/components/dashboard/settings/SettingsWrapper';
import { JwtRegex } from 'app/utils/constants';
import handleRequestError from 'app/utils/handleRequestError';
import redirectToUrl from 'app/utils/redirectToUrl';
import withClinicAndUser from 'hocs/withClinicAndUser';
import { fetchAllCountries } from 'middleware/api/countries';
import {
  authTokenSelector,
  currentClinicSelector,
  currentUserSelector,
} from 'redux/selectors/appDataSelector';
import { setCookies } from 'redux/slices/appDataSlice';
import { wrapper } from 'store';

const Settings = ({ countries, menu }) => {
  return (
    <MainComponent currentPath='/settings'>
      <SettingsWrapper countries={countries} selectedMenu={menu} />
    </MainComponent>
  );
};

export default connect((state) => state)(Settings);

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    try {
      await withClinicAndUser(store, context);
      const { req, query } = context;
      const appState = store.getState();
      const authToken = authTokenSelector(appState);
      const currentUser = currentUserSelector(appState);
      const currentClinic = currentClinicSelector(appState);
      const cookies = req?.headers?.cookie ?? '';
      store.dispatch(setCookies(cookies));
      if (!authToken || !authToken.match(JwtRegex)) {
        return {
          redirect: {
            destination: '/login',
            permanent: true,
          },
        };
      }

      const { data: countries } = await fetchAllCountries(req.headers);
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
          menu: query?.menu ?? '',
          countries,
        },
      };
    } catch (error) {
      return handleRequestError(error);
    }
  },
);
