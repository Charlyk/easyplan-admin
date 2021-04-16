import React, { useEffect } from "react";
import {
  getRedirectUrlForUser,
  setCookies
} from "../../utils/helperFuncs";
import { useRouter } from "next/router";
import { getCurrentUser } from "../../middleware/api/auth";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import { textForKey } from "../../utils/localization";

export default () => {
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
