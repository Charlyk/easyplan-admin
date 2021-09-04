import React from 'react';
import { parseCookies } from "../utils";
import CreateClinicWrapper from "../app/components/common/CreateClinicWrapper";
import { wrapper } from "../store";
import { fetchAllCountries } from "../middleware/api/countries";

const CreateClinic = ({ token, redirect, countries }) => {
  return <CreateClinicWrapper redirect={redirect} token={token} countries={countries} />;
};

export const getServerSideProps = async ({ req, query }) => {
  try {
    const { auth_token } = parseCookies(req);
    const { data: countries } = await fetchAllCountries(req.headers);
    const { redirect } = query;
    return {
      props: {
        token: auth_token,
        redirect: redirect === '1',
        countries,
      },
    }
  } catch (e) {
    if (e.response) {
      const { data } = e.response;
      console.error(data?.message);
    } else {
      console.error(e.message);
    }
    return {
      props: {}
    }
  }
};

export default wrapper.withRedux(CreateClinic);
