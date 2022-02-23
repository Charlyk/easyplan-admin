import React from 'react';
import { connect } from 'react-redux';
import { END } from 'redux-saga';
import MainComponent from 'app/components/common/MainComponent';
import CrmMain from 'app/components/crm/CrmMain';
import { JwtRegex } from 'app/utils/constants';
import handleRequestError from 'app/utils/handleRequestError';
import redirectToUrl from 'app/utils/redirectToUrl';
import { loginUrl } from 'eas.config';
import { fetchAllDealStates, fetchGroupedDeals } from 'middleware/api/crm';
import {
  authTokenSelector,
  currentClinicSelector,
  currentUserSelector,
} from 'redux/selectors/appDataSelector';
import { setCookies } from 'redux/slices/appDataSlice';
import { setDealStates, setGroupedDeals } from 'redux/slices/crmBoardSlice';
import { wrapper } from 'store';

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
        // end the saga
        store.dispatch(END);
        await store.sagaTask.toPromise();

        // fetch page data
        const cookies = req?.headers?.cookie ?? '';
        store.dispatch(setCookies(cookies));
        const appState = store.getState();
        const authToken = authTokenSelector(appState);
        const currentUser = currentUserSelector(appState);
        const currentClinic = currentClinicSelector(appState);
        if (!authToken || !authToken.match(JwtRegex)) {
          return {
            redirect: {
              destination: loginUrl,
              permanent: true,
            },
          };
        }

        const redirectTo = redirectToUrl(currentUser, currentClinic, '/crm');
        if (redirectTo != null) {
          return {
            redirect: {
              destination: loginUrl,
              permanent: true,
            },
          };
        }

        const allStatesResponse = await fetchAllDealStates(false, req.headers);
        store.dispatch(setDealStates(allStatesResponse.data));
        const groupedDeals = await fetchGroupedDeals(0, 25, req.headers);
        store.dispatch(setGroupedDeals(groupedDeals.data));

        return {
          props: {},
        };
      } catch (error) {
        return handleRequestError(error);
      }
    },
);
