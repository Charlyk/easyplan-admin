import React from "react";
import PropTypes from 'prop-types';
import MainComponent from "../app/components/common/MainComponent";
import parseCookies from '../utils/parseCookies';
import handleRequestError from "../utils/handleRequestError";
import redirectUserTo from "../utils/redirectUserTo";
import redirectToUrl from "../utils/redirectToUrl";
import { fetchAppData } from "../middleware/api/initialization";
import { fetchAllDealStates } from "../middleware/api/crm";
import CrmMain from "../app/components/crm/CrmMain";

const Crm = ({ currentUser, currentClinic, authToken, states }) => {
  return (
    <MainComponent
      currentUser={currentUser}
      currentClinic={currentClinic}
      currentPath='/crm'
      authToken={authToken}
    >
      <CrmMain states={states}/>
    </MainComponent>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  try {
    const { auth_token: authToken } = parseCookies(req);
    const appData = await fetchAppData(req.headers);
    const { currentUser, currentClinic } = appData.data;
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/users');
    if (redirectTo != null) {
      redirectUserTo(redirectTo, res);
      return { props: { ...appData.data } };
    }

    const response = await fetchAllDealStates(req.headers);

    return {
      props: {
        ...appData.data,
        states: response.data,
        authToken,
      }
    }
  } catch (error) {
    await handleRequestError(error, req, res);
    return {
      props: {
        users: [],
        invitations: [],
      }
    }
  }
}

export default Crm;

Crm.propTypes = {
  currentUser: PropTypes.object,
  currentClinic: PropTypes.object,
  authToken: PropTypes.string,
  states: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    color: PropTypes.string,
    orderId: PropTypes.number,
    deleteable: PropTypes.bool,
  })),
};
