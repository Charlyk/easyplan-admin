import React from 'react';
import { connect } from 'react-redux';
import CreateClinicWrapper from 'app/components/common/CreateClinicWrapper';
import checkIsMobileDevice from 'app/utils/checkIsMobileDevice';
import { JwtRegex } from 'app/utils/constants';
import handleRequestError from 'app/utils/handleRequestError';
import parseCookies from 'app/utils/parseCookies';
import { fetchAllCountries } from 'middleware/api/countries';

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

export default connect((state) => state)(CreateClinic);

export const getServerSideProps = async ({ req, query }) => {
  try {
    const isMobile = checkIsMobileDevice(req);
    const { auth_token: authToken } = parseCookies(req);
    if (!authToken || !authToken.match(JwtRegex)) {
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
        token: authToken,
        redirect: redirect === '1',
        shouldLogin: login === '1',
        countries,
      },
    };
  } catch (e) {
    return handleRequestError(e);
  }
};
