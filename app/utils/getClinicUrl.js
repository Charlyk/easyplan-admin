import { appBaseUrl, environment } from "../../eas.config";

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
  const clinicDomain = clinic.clinicDomain ?? clinic.domainName;
  switch (environment) {
    case 'production':
      return `${protocol}//${clinicDomain}.${domain}.${location}/redirect?${queryString}`;
    case 'local':
      return `${appBaseUrl}/redirect?${queryString}`;
    default:
      return `${protocol}//${clinicDomain}.${domain}.${location}.${location2}/redirect?${queryString}`;
  }

}

export default getClinicUrl;
