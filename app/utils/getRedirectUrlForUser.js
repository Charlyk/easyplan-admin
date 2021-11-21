import { Role } from './constants';

const getRedirectUrlForUser = (user, subdomain) => {
  if (user == null) {
    return '/login';
  }
  const { clinics } = user;
  const userClinic = clinics.find(
    (item) => item.clinicDomain.toLowerCase() === subdomain?.toLowerCase(),
  );
  if (userClinic != null) {
    try {
      switch (userClinic.roleInClinic) {
        case Role.reception:
          return '/calendar/day';
        case Role.admin:
        case Role.manager:
          return '/analytics/general';
        case Role.doctor:
          return '/doctor';
        default:
          return '/login';
      }
    } catch (error) {
      return '/login';
    }
  } else {
    return '/login';
  }
};

export default getRedirectUrlForUser;
