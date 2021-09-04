import React, { useEffect } from "react";
import Box from "@material-ui/core/Box";
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography'
import { useRouter } from "next/router";
import getRedirectUrlForUser from '../../utils/getRedirectUrlForUser';
import setCookies from '../../utils/setCookies';
import { getCurrentUser } from "../../middleware/api/auth";
import { textForKey } from "../../utils/localization";

const Redirect = () => {
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await getCurrentUser();
      const redirectUrl = getRedirectUrlForUser(response.data);
      if (redirectUrl == null || router.asPath === redirectUrl) {
        return;
      }
      await router.replace(redirectUrl);
    } catch (error) {
      await router.replace('/login');
    }
  }

  return (
    <Box
      width='100%'
      height='100%'
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
    >
      <CircularProgress className='circular-progress-bar'/>
      <Typography className='typography' style={{ marginTop: '1rem' }}>
        {textForKey('Redirecting to clinic')}...
      </Typography>
    </Box>
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
