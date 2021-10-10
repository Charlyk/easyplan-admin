import React from 'react';
import parseCookies from "../app/utils/parseCookies";
import CreateClinicWrapper from "../app/components/common/CreateClinicWrapper";
import { wrapper } from "../store";
import { fetchAllCountries } from "../middleware/api/countries";
import { JwtRegex } from "../app/utils/constants";
import handleRequestError from "../app/utils/handleRequestError";
import checkIsMobileDevice from "../app/utils/checkIsMobileDevice";

const CreateClinic = ({ token, redirect, countries, login, isMobile }) => {
  return (
    <CreateClinicWrapper
      isMobile={isMobile}
      redirect={redirect}
      token={token}
      countries={countries}
      shouldLogin={login}
    />
  );
};

export const getServerSideProps = async ({ req, query }) => {
  try {
    const isMobile = checkIsMobileDevice(req);
    const { auth_token } = parseCookies(req);
    if (!auth_token || !auth_token.match(JwtRegex)) {
      return {
        redirect: {
          destination: '/login',
          permanent: true,
        },
      };
    }

    const { data: countries } = await fetchAllCountries(req.headers);
    const { redirect, login } = query;
    return {
      props: {
        isMobile,
        token: auth_token,
        redirect: redirect === '1',
        shouldLogin: login === '1',
        countries,
      },
    }
  } catch (e) {
    return handleRequestError(e);
  }
};

export default wrapper.withRedux(CreateClinic);
