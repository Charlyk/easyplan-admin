import { Role } from "../app/utils/constants";

const getRedirectUrlForUser = (user) => {
  if (user == null) {
    return '/login';
  }
  const { userClinic } = user;
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
      return '/login'
    }
  } else {
    return '/login';
  }
}

export default getRedirectUrlForUser;
