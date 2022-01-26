import React, { useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import { JwtRegex } from 'app/utils/constants';
import getRedirectUrlForUser from 'app/utils/getRedirectUrlForUser';
import handleRequestError from 'app/utils/handleRequestError';
import { textForKey } from 'app/utils/localization';
import setCookies from 'app/utils/setCookies';
import { appBaseUrl } from 'eas.config';
import { getCurrentUser, signOut } from 'middleware/api/auth';

const Redirect = ({ clinicId }) => {
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const id = parseInt(clinicId);
      const response = await getCurrentUser();
      const userClinic = response.data.clinics.find(
        (item) => item.clinicId === id,
      );
      if (userClinic?.accessBlocked) {
        await signOut();
        await router.replace(`${appBaseUrl}/login`);
        return;
      }
      const [subdomain] = window.location.host.split('.');
      const redirectUrl = getRedirectUrlForUser(response.data, subdomain);
      if (redirectUrl == null || router.asPath === redirectUrl) {
        return;
      }
      await router.replace(redirectUrl);
    } catch (error) {
      await router.replace(`${appBaseUrl}/login`);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress className='circular-progress-bar' />
      <Typography className='typography' style={{ marginTop: '1rem' }}>
        {textForKey('Redirecting to clinic')}...
      </Typography>
    </div>
  );
};

export default connect((state) => state)(Redirect);

export const getServerSideProps = async ({ res, query }) => {
  try {
    const { token, clinicId } = query;
    // try to check if clinic id is a number
    parseInt(clinicId, 10);

    // check if token is valid
    if (!token.match(JwtRegex) || !clinicId) {
      return {
        redirect: {
          destination: '/login',
          permanent: true,
        },
      };
    }

    // set cookies
    setCookies(res, token, clinicId);
    return { props: { clinicId } };
  } catch (error) {
    return handleRequestError(error);
  }
};
