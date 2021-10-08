export default function getSubdomain(req) {
  const { host } = req.headers;
  const [clinicDomain] = host.split('.');
  return clinicDomain
}
