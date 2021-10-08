import React, { useEffect } from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography'
import { useRouter } from "next/router";
import getRedirectUrlForUser from '../../utils/getRedirectUrlForUser';
import { getCurrentUser } from "../../middleware/api/auth";
import { textForKey } from "../../utils/localization";
import setCookies from '../../utils/setCookies';
import { JwtRegex } from "../../app/utils/constants";
import handleRequestError from "../../utils/handleRequestError";

const Redirect = () => {
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await getCurrentUser();
      const [subdomain] = window.location.host.split('.');
      const redirectUrl = getRedirectUrlForUser(response.data, subdomain);
      if (redirectUrl == null || router.asPath === redirectUrl) {
        return;
      }
      await router.replace(redirectUrl);
    } catch (error) {
      await router.replace('/login');
    }
  }

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
      <CircularProgress className='circular-progress-bar'/>
      <Typography className='typography' style={{ marginTop: '1rem' }}>
        {textForKey('Redirecting to clinic')}...
      </Typography>
    </div>
  )
}

export const getServerSideProps = async ({ res, query }) => {
  try {
    const { token, clinicId } = query;
    // try to check if clinic id is a number
    parseInt(clinicId);

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
    return { props: {} }
  } catch (error) {
    return handleRequestError(error);
  }
}

export default Redirect;
