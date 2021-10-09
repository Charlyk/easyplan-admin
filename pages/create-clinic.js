import React from 'react';
import parseCookies from "../app/utils/parseCookies";
import CreateClinicWrapper from "../app/components/common/CreateClinicWrapper";
import { wrapper } from "../store";
import { fetchAllCountries } from "../middleware/api/countries";
import { JwtRegex } from "../app/utils/constants";
import handleRequestError from "../app/utils/handleRequestError";

const CreateClinic = ({ token, redirect, countries, login }) => {
  return (
    <CreateClinicWrapper
      redirect={redirect}
      token={token}
      countries={countries}
      shouldLogin={login}
    />
  );
};

export const getServerSideProps = async ({ req, query }) => {
  try {
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
