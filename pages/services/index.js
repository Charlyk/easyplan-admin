import React from 'react';
import { SWRConfig } from "swr";
import redirectToUrl from '../../app/utils/redirectToUrl';
import MainComponent from "../../app/components/common/MainComponent/MainComponent";
import { fetchAllServices } from "../../middleware/api/services";
import { fetchAppData } from "../../middleware/api/initialization";
import parseCookies from "../../app/utils/parseCookies";
import ServicesContainer from "../../app/components/dashboard/services/ServicesContainer";
import { APP_DATA_API, JwtRegex } from "../../app/utils/constants";
import handleRequestError from "../../app/utils/handleRequestError";

const Services = ({ fallback, categories: clinicCategories, services, authToken }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <MainComponent
        currentPath='/services'
        authToken={authToken}
      >
        <ServicesContainer
          services={services}
          authToken={authToken}
          categories={clinicCategories}
        />
      </MainComponent>
    </SWRConfig>
  );
};

export const getServerSideProps = async ({ req, }) => {
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
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/services');
    if (redirectTo != null) {
      return {
        redirect: {
          destination: redirectTo,
          permanent: true,
        },
      };
    }

    const { data } = await fetchAllServices(req.headers);
    return {
      props: {
        ...data,
        fallback: {
          [APP_DATA_API]: {
            ...appData.data
          }
        },
        authToken,
      },
    };
  } catch (error) {
    return handleRequestError(error);
  }
}

export default Services;
