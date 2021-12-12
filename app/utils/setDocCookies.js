const expirationTime = 3155695200000; // 100 years

export default function setDocCookies(name, value, options = {}) {
  const cookieValue = value;

  const date = new Date();
  date.setTime(date.getTime() + expirationTime);

  const cookieOptions = {
    path: '/',
    expires: date.toUTCString(),
    ...options,
  };

  let updatedCookie = `${name}=${cookieValue}`;

  for (const optionKey in cookieOptions) {
    const optionValue = cookieOptions[optionKey];
    updatedCookie += '; ' + optionKey;

    if (optionValue !== true) {
      updatedCookie += '=' + optionValue;
    }
  }

  document.cookie = updatedCookie;
}
