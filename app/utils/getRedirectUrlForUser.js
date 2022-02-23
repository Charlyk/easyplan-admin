import { loginUrl } from 'eas.config';
import { Role } from './constants';

const getRedirectUrlForUser = (user, subdomain) => {
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
          return '/analytics/general';
        case Role.doctor:
          return '/doctor';
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
