import { appBaseUrl, environment, loginUrl } from 'eas.config';
import { Role } from './constants';

const getRedirectUrlForUser = (user, subdomain, path = null) => {
  if (user == null) {
    return loginUrl;
  }
  const { clinics } = user;
  const userClinic = clinics.find(
    (item) => item.clinicDomain.toLowerCase() === subdomain?.toLowerCase(),
  );
  if (userClinic != null) {
    try {
      switch (userClinic?.roleInClinic) {
        case Role.reception:
          return '/calendar/day';
        case Role.admin:
        case Role.manager:
          return path ?? '/analytics/general';
        case Role.doctor:
          if (environment === 'local') {
            return 'http://localhost:3003/doctor';
          } else {
            return `${appBaseUrl.replace('app.', `${subdomain}.`)}/doctor`;
          }
        default:
          return loginUrl;
      }
    } catch (error) {
      return loginUrl;
    }
  } else {
    return loginUrl;
  }
};

export default getRedirectUrlForUser;
