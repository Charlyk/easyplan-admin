import React from 'react';
import { SWRConfig } from "swr";
import handleRequestError from '../../utils/handleRequestError';
import redirectToUrl from '../../utils/redirectToUrl';
import redirectUserTo from '../../utils/redirectUserTo';
import MainComponent from "../../app/components/common/MainComponent/MainComponent";
import { fetchAllServices } from "../../middleware/api/services";
import { fetchAppData } from "../../middleware/api/initialization";
import parseCookies from "../../utils/parseCookies";
import ServicesContainer from "../../app/components/dashboard/services/ServicesContainer";
import { APP_DATA_API, JwtRegex } from "../../app/utils/constants";

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

export const getServerSideProps = async ({ req, res, }) => {
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
      redirectUserTo(redirectTo, res);
      return {
        props: {
          fallback: {
            [APP_DATA_API]: {
              ...appData.data
            }
          }
        }
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
