import { imageLambdaUrl } from "../eas.config";

/**
 * convert image url to lambda url
 * @param {string} imageUrl
 * @param {number} width
 * @return {string}
 */
export default function urlToLambda(imageUrl, width = 50) {
  const url = new URL(imageUrl);
  return `${imageLambdaUrl}${url.pathname}?width=${width}`;
}
