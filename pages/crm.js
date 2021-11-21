import React from 'react';
import PropTypes from 'prop-types';
import { SWRConfig } from 'swr';
import MainComponent from 'app/components/common/MainComponent';
import CrmMain from 'app/components/crm/CrmMain';
import { APP_DATA_API, JwtRegex } from 'app/utils/constants';
import handleRequestError from 'app/utils/handleRequestError';
import parseCookies from 'app/utils/parseCookies';
import redirectToUrl from 'app/utils/redirectToUrl';
import { fetchAllDealStates } from 'middleware/api/crm';
import { fetchAppData } from 'middleware/api/initialization';
import { wrapper } from 'store';

const Crm = ({ fallback, authToken, states }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <MainComponent currentPath='/crm' authToken={authToken}>
        <CrmMain states={states} />
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
    const { currentUser, currentClinic } = appData.data;
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
        fallback: {
          [APP_DATA_API]: {
            ...appData.data,
          },
        },
        states: response.data,
        authToken,
      },
    };
  } catch (error) {
    return handleRequestError(error);
  }
};

export default wrapper.withRedux(Crm);

Crm.propTypes = {
  currentUser: PropTypes.object,
  currentClinic: PropTypes.object,
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
