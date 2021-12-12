import isValidUrl from './isValidUrl';

/**
 * convert image url to lambda url
 * @param {string} imageUrl
 * @return {string}
 */
export default function urlToLambda(imageUrl) {
  if (isValidUrl(imageUrl)) {
    const url = new URL(imageUrl);
    return url.pathname.replace('/', '');
  } else {
    return imageUrl;
  }
}
