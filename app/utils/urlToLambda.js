import { awsBaseUrl } from "../../eas.config";
import isValidUrl from "./isValidUrl";

/**
 * convert image url to lambda url
 * @param {string} imageUrl
 * @return {string}
 */
export default function urlToLambda(imageUrl) {
  if (isValidUrl(imageUrl)) {
    const url = new URL(imageUrl);
    return `${awsBaseUrl}${url.pathname}`;
  } else {
    return `${awsBaseUrl}/${imageUrl}`;
  }
}
