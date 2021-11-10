import { baseApiUrl, imageLambdaUrl } from "../../eas.config";
import isValidUrl from "./isValidUrl";

/**
 * convert image url to lambda url
 * @param {string} imageUrl
 * @param {number} width
 * @return {string}
 */
export default function urlToLambda(imageUrl, width = 50) {
  console.log(imageUrl)
  if (isValidUrl(imageUrl)) {
    const url = new URL(imageUrl);
    return `${baseApiUrl}/files${url.pathname}`;
  } else {
    return `${baseApiUrl}/files/${imageUrl}`;
  }
}
