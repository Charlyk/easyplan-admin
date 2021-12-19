import React from 'react';
import { connect } from 'react-redux';
import MainComponent from 'app/components/common/MainComponent';
import CrmMain from 'app/components/crm/CrmMain';
import { JwtRegex } from 'app/utils/constants';
import handleRequestError from 'app/utils/handleRequestError';
import redirectToUrl from 'app/utils/redirectToUrl';
import { fetchAllDealStates } from 'middleware/api/crm';
import {
  authTokenSelector,
  currentClinicSelector,
  currentUserSelector,
} from 'redux/selectors/appDataSelector';
import { setDealStates } from 'redux/slices/crmBoardSlice';
import { wrapper } from 'store';
import { setCookies } from '../redux/slices/appDataSlice';

const Crm = () => {
  return (
    <MainComponent currentPath='/crm'>
      <CrmMain />
    </MainComponent>
  );
};

export default connect((state) => state)(Crm);

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req }) => {
      try {
        const cookies = req?.headers?.cookie ?? '';
        const appState = store.getState();
        const authToken = authTokenSelector(appState);
        const currentUser = currentUserSelector(appState);
        const currentClinic = currentClinicSelector(appState);
        if (!authToken || !authToken.match(JwtRegex)) {
          return {
            redirect: {
              destination: '/login',
              permanent: true,
            },
          };
        }

        const redirectTo = redirectToUrl(currentUser, currentClinic, '/crm');
        if (redirectTo != null) {
          return {
            redirect: {
              destination: '/login',
              permanent: true,
            },
          };
        }

        const response = await fetchAllDealStates(req.headers);
        store.dispatch(setDealStates(response.data));
        store.dispatch(setCookies(cookies));

        return {
          props: {},
        };
      } catch (error) {
        return handleRequestError(error);
      }
    },
);
