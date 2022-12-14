import { loginUrl } from 'eas.config';
import { Role } from './constants';

export default function redirectToUrl(user, clinic, path) {
  const selectedClinic = user?.clinics.find(
    (item) => item.clinicId === clinic?.id,
  );

  if (selectedClinic == null || selectedClinic.accessBlocked) {
    return loginUrl;
  }

  const role = selectedClinic.roleInClinic;
  let shouldRedirect;
  let redirectPath;

  switch (role) {
    case Role.reception:
      shouldRedirect =
        path === '/' ||
        path.startsWith('/doctor') ||
        path.startsWith('/users') ||
        path.startsWith('/messages') ||
        path.startsWith('/services') ||
        path.startsWith('/analytics/general') ||
        path.startsWith('/analytics/doctors') ||
        path.startsWith('/analytics/activity-logs') ||
        path.startsWith('/reports/payments');
      if (shouldRedirect) redirectPath = '/calendar/day';
      break;
    case Role.admin:
    case Role.manager:
      shouldRedirect = path === '/' || path.startsWith('/doctor');
      if (shouldRedirect) redirectPath = '/analytics/general';
      break;
    case Role.doctor:
      shouldRedirect =
        path === '/' ||
        path.startsWith('/analytics') ||
        path.startsWith('/services') ||
        path.startsWith('/users') ||
        path.startsWith('/calendar') ||
        path.startsWith('/patients') ||
        path.startsWith('/messages') ||
        path.startsWith('/settings') ||
        path.startsWith('/reports');
      if (shouldRedirect) redirectPath = '/doctor';
      break;
    default:
      shouldRedirect = true;
      redirectPath = loginUrl;
      break;
  }
  return shouldRedirect ? redirectPath : null;
}
