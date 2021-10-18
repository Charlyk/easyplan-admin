export default function extractCookieByName(cookieName) {
  const cookies = document?.cookie?.split('; ');
  const matchedCookie = cookies.find(
    (row) => row.length > 0 && row.startsWith(cookieName),
  );
  return matchedCookie != null ? matchedCookie.split('=')[1] : null;
}
