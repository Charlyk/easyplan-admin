import React, { useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import checkIsAuthTokenValid from 'app/utils/checkAuthToken';
import getRedirectUrlForUser from 'app/utils/getRedirectUrlForUser';
import handleRequestError from 'app/utils/handleRequestError';
import { textForKey } from 'app/utils/localization';
import setCookies from 'app/utils/setCookies';
import { environment, loginUrl } from 'eas.config';
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
        await router.replace(loginUrl);
        return;
      }
      const [subdomain] = window.location.host.split('.');
      const redirectUrl = getRedirectUrlForUser(
        response.data,
        environment === 'local' ? process.env.DEFAULT_CLINIC : subdomain,
      );
      if (redirectUrl == null || router.asPath === redirectUrl) {
        return;
      }
      await router.replace(redirectUrl);
    } catch (error) {
      alert(error.message);
      await router.replace(loginUrl);
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

    // check if token is valid
    const isAuthenticated = await checkIsAuthTokenValid(token, clinicId);
    if (!isAuthenticated) {
      return {
        redirect: {
          destination: loginUrl,
          permanent: false,
        },
      };
    }

    // set cookies
    setCookies(res, token, clinicId);
    return { props: { clinicId } };
  } catch (error) {
    console.error('Redirect', error.message);
    return handleRequestError(error);
  }
};
