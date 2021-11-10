import axios from "axios";
import { environment, isDev } from "../../eas.config";
import { Agent } from "https";

const host = environment === 'local' ? 'http://app.easyplan.loc' : 'http://localhost';
const port = environment === 'local' ? 80 : isDev ? 3001 : 3000

/**
 * perform an axios request to the server
 * @param {string} path
 * @param {'get'|'post'|'put'|'delete'} method
 * @param {Object|null} headers
 * @param {Object|null} body
 * @return {Promise<AxiosResponse<any>>}
 */
export async function request(path, method, headers = null, body = null) {
  const agent = new Agent({
    rejectUnauthorized: environment !== 'production',
  });

  switch (method) {
    case "get":
      return headers
        ? axios.get(`${host}:${port}${path}`, { headers, httpsAgent: agent })
        : axios.get(path, { httpsAgent: agent });
    case 'post':
      return headers
        ? axios.post(`${host}:${port}${path}`, body, { headers, httpsAgent: agent })
        : axios.post(path, body, { httpsAgent: agent });
    case 'put':
      return headers
        ? axios.put(`${host}:${port}${path}`, body, { headers, httpsAgent: agent })
        : axios.put(path, body, { httpsAgent: agent });
    case 'delete':
      return headers
        ? axios.delete(`${host}:${port}${path}`, { headers, httpsAgent: agent })
        : axios.delete(path, { httpsAgent: agent });
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
