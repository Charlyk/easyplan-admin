import { useCallback } from 'react';
import { environment } from '../../eas.config';

const useRootDomain = (): [string, (subdomain: string) => string] => {
  const appUrl = process.env.APP_URL ?? 'https://app.easyplan.pro';
  const rootDomain: string =
    environment === 'local'
      ? 'dev.easyplan.pro'
      : appUrl.replace('https://app.', '');

  const getClinicUrl = useCallback(
    (subdomain: string) => {
      if (environment === 'local') {
        return 'http://localhost:3000';
      }
      return `https://${subdomain}.${rootDomain}`;
    },
    [rootDomain],
  );

  return [rootDomain, getClinicUrl];
};

export default useRootDomain;
