import { environment } from "../../eas.config";

export default function getSubdomain(req) {
  if (environment === 'local') {
    return process.env.DEFAULT_CLINIC;
  }
  const { host } = req.headers;
  const [clinicDomain] = host.split('.');
  return clinicDomain
}
