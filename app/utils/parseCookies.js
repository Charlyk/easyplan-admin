import cookie from 'cookie';

export default function parseCookies(req) {
  return cookie.parse(req?.headers?.cookie || '');
}
