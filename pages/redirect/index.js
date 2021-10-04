import React, { useEffect } from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography'
import { useRouter } from "next/router";
import getRedirectUrlForUser from '../../utils/getRedirectUrlForUser';
import { getCurrentUser } from "../../middleware/api/auth";
import { textForKey } from "../../utils/localization";
import setCookies from '../../utils/setCookies';

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
      console.log(redirectUrl)
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
    setCookies(res, token, clinicId);
    return { props: {} }
  } catch (error) {
    return { props: {} }
  }
}

export default Redirect;
