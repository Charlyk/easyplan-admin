import React, { useEffect } from "react";
import {
  getRedirectUrlForUser,
  setCookies
} from "../../utils/helperFuncs";
import { useRouter } from "next/router";
import { getCurrentUser } from "../../middleware/api/auth";

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

  return <div />
}

export const getServerSideProps = async ({ req, res, query }) => {
  try {
    const { token, clinicId } = query;
    setCookies(res, token, clinicId);
    return { props: {} }
  } catch (error) {
    return { props: {} }
  }
}

export default Redirect;
