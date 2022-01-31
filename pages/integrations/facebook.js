import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { FacebookAppId } from 'app/utils/constants';
import { environment } from 'eas.config';

const fbAuthUrl = 'https://www.facebook.com/v12.0/dialog/oauth';
const facebookScopes =
  'public_profile,pages_show_list,pages_messaging,pages_manage_metadata,pages_read_engagement,instagram_basic,pages_manage_posts';

const Facebook = ({
  code,
  token,
  connect,
  subdomain,
  error_message: errorMessage,
}) => {
  const router = useRouter();
  const envPath =
    environment === 'local' || environment === 'production'
      ? ''
      : environment === 'testing'
      ? '.dev'
      : '.stage';

  const clinicDomain =
    environment === 'local'
      ? 'http://localhost:3000'
      : `https://${subdomain}${envPath}.easyplan.pro`;

  useEffect(() => {
    if (connect !== '1') {
      return;
    }
    const baseUrl = window.location.hostname;
    const protocol = window.location.protocol;
    const port = environment === 'local' ? `:${window.location.port}` : '';
    const redirectUrl = `${protocol}//${baseUrl}${port}/integrations/facebook?connect=0`;
    router.push(
      `${fbAuthUrl}?client_id=${FacebookAppId}&redirect_uri=${redirectUrl}&scope=${facebookScopes}`,
    );
  }, [connect]);

  useEffect(() => {
    if (connect === '1') {
      return;
    }

    let params = 'menu=crmSettings';
    if (code || token) {
      if (code && token) {
        params = `menu=crmSettings&code=${code}&token=${token}`;
      } else if (code) {
        params = `menu=crmSettings&code=${code}`;
      } else if (token) {
        params = `menu=crmSettings&token=${token}`;
      }
    }

    window.location.href = `${clinicDomain}/settings?${params}`;
  }, [code, token, connect, clinicDomain]);

  return <div>{errorMessage ?? ''}</div>;
};

export const getServerSideProps = ({ query }) => {
  return { props: { ...query } };
};

export default Facebook;
