import axios from "axios";
import { baseAppUrl } from "../../eas.config";

/**
 * perform an axios request to the server
 * @param {string} path
 * @param {'get'|'post'|'put'|'delete'} method
 * @param {Object|null} headers
 * @param {Object|null} body
 * @return {Promise<AxiosResponse<any>>}
 */
export async function request(path, method, headers = null, body = null) {
  switch (method) {
    case "get":
      return headers
        ? axios.get(`${baseAppUrl}${path}`, { headers })
        : axios.get(`${baseAppUrl}${path}`);
    case 'post':
      return headers
        ? axios.post(`${baseAppUrl}${path}`, body, { headers })
        : axios.post(`${baseAppUrl}${path}`, body);
    case 'put':
      return headers
        ? axios.put(`${baseAppUrl}${path}`, body, { headers })
        : axios.put(`${baseAppUrl}${path}`, body);
    case 'delete':
      return headers
        ? axios.delete(`${baseAppUrl}${path}`, { headers })
        : axios.delete(`${baseAppUrl}${path}`);
    default:
      throw Error('Method not allowed');
  }
}

/**
 * Perform a get request
 * @param {string} path
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function get(path, headers) {
  return request(path, 'get', headers)
}

/**
 * Perform a post request
 * @param {string} path
 * @param {Object|null} headers
 * @param {Object} body
 * @return {Promise<AxiosResponse<*>>}
 */
export async function post(path, headers, body) {
  return request(path, 'post', headers, body);
}

/**
 * Perform a put request
 * @param {string} path
 * @param {Object|null} headers
 * @param {Object} body
 * @return {Promise<AxiosResponse<*>>}
 */
export async function put(path, headers, body) {
  return request(path, 'put', headers, body);
}

/**
 * Perform a delete request
 * @param {string} path
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function del(path, headers) {
  return request(path, 'delete', headers)
}
