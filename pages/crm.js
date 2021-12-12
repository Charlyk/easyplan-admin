import React from 'react';
import PropTypes from 'prop-types';
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
import { wrapper } from 'store';

const Crm = ({ states }) => {
  return (
    <MainComponent currentPath='/crm'>
      <CrmMain states={states} />
    </MainComponent>
  );
};

export default connect((state) => state)(Crm);

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req }) => {
      try {
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

        return {
          props: {
            states: response.data,
          },
        };
      } catch (error) {
        return handleRequestError(error);
      }
    },
);

Crm.propTypes = {
  authToken: PropTypes.string,
  states: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      color: PropTypes.string,
      orderId: PropTypes.number,
      deleteable: PropTypes.bool,
    }),
  ),
};
