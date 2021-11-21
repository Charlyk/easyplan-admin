import { awsBaseUrl } from '../../eas.config';
import isValidUrl from './isValidUrl';

/**
 * convert image url to lambda url
 * @param {string} imageUrl
 * @return {string}
 */
export default function urlToAWS(imageUrl) {
  if (isValidUrl(imageUrl)) {
    const url = new URL(imageUrl);
    return `${awsBaseUrl}/${url.pathname.replace('/', '')}`;
  } else {
    return `${awsBaseUrl}/${imageUrl}`;
  }
}
