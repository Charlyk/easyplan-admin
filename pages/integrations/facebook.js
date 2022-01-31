import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const Facebook = ({ code, token, error_message: errorMessage }) => {
  const router = useRouter();

  useEffect(() => {
    if (!code && !token) {
      router.replace('/');
      return;
    }

    router.replace({
      pathname: '/settings',
      search: `menu=crmSettings&code=${code}&token=${token}`,
    });
  }, [code, token]);

  return <div>{errorMessage ?? ''}</div>;
};

export const getServerSideProps = ({ query }) => {
  return { props: { ...query } };
};

export default Facebook;
