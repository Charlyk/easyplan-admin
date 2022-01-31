import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { FacebookAppId } from 'app/utils/constants';
import { appBaseUrl, environment } from 'eas.config';

const fbAuthUrl = 'https://www.facebook.com/v12.0/dialog/oauth';
const facebookScopes =
  'public_profile,pages_show_list,pages_messaging,pages_manage_metadata,pages_read_engagement,instagram_basic,pages_manage_posts';

const Facebook = ({
  code,
  token,
  connect,
  subdomain,
  state,
  error_message: errorMessage,
}) => {
  const router = useRouter();
  const envPath =
    environment === 'local' || environment === 'production'
      ? ''
      : environment === 'testing'
      ? '.dev'
      : '.stage';

  useEffect(() => {
    if (connect !== '1') {
      return;
    }
    const redirectUrl = `${appBaseUrl}/integrations/facebook`;
    const state = { connect: '0', subdomain };
    const stateString = btoa(JSON.stringify(state));
    router.push(
      `${fbAuthUrl}?client_id=${FacebookAppId}&redirect_uri=${redirectUrl}&scope=${facebookScopes}&state=${stateString}`,
    );
  }, [connect, subdomain]);

  useEffect(() => {
    if (!state) {
      return;
    }

    const decodedState = atob(state);
    if (!decodedState) {
      return;
    }

    const { connect, subdomain } = JSON.parse(decodedState);
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

    const clinicDomain =
      environment === 'local'
        ? 'http://localhost:3000'
        : `https://${subdomain}${envPath}.easyplan.pro`;

    window.location.href = `${clinicDomain}/settings?${params}`;
  }, [code, token, state, subdomain]);

  return <div>{errorMessage ?? ''}</div>;
};

export const getServerSideProps = ({ query }) => {
  return { props: { ...query } };
};

export default Facebook;
