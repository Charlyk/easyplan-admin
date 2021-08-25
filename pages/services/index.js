import React from 'react';
import {
  handleRequestError,
  redirectToUrl,
  redirectUserTo,
} from '../../utils/helperFuncs';
import MainComponent from "../../app/components/common/MainComponent/MainComponent";
import { fetchAllServices } from "../../middleware/api/services";
import { fetchAppData } from "../../middleware/api/initialization";
import { parseCookies } from "../../utils";
import ServicesContainer from "../../app/components/dashboard/services/ServicesContainer";

const Services = ({ currentUser, currentClinic, categories: clinicCategories, services, authToken }) => {
  return (
    <MainComponent
      currentUser={currentUser}
      currentClinic={currentClinic}
      currentPath='/services'
      authToken={authToken}
    >
      <ServicesContainer
        services={services}
        currentClinic={currentClinic}
        authToken={authToken}
        categories={clinicCategories}
      />
    </MainComponent>
  );
};

export const getServerSideProps = async ({ req, res, }) => {
  try {
    const { auth_token: authToken } = parseCookies(req);
    const appData = await fetchAppData(req.headers);
    const { currentUser, currentClinic } = appData;
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/services');
    if (redirectTo != null) {
      redirectUserTo(redirectTo, res);
      return { props: { ...appData } };
    }

    const { data } = await fetchAllServices(req.headers);
    return {
      props: {
        ...data,
        ...appData,
        authToken,
      },
    };
  } catch (error) {
    await handleRequestError(error, req, res);
    return {
      props: {
        categories: [],
        services: []
      }
    }
  }
}

export default Services;
