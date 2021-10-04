import { environment } from "../eas.config";

const getClinicUrl = (clinic, authToken) => {
  if (typeof window === 'undefined') {
    return '';
  }
  const { host, protocol } = window.location;
  const [_, domain, location, location2] = host.split('.');
  const queryString = new URLSearchParams({
    token: authToken,
    clinicId: clinic.clinicId
  });
  switch (environment) {
    case 'production':
    case 'local':
      return `${protocol}//${clinic.clinicDomain}.${domain}.${location}/redirect?${queryString}`;
    default:
      return `${protocol}//${clinic.clinicDomain}.${domain}.${location}.${location2}/redirect?${queryString}`;
  }

}

export default getClinicUrl;
