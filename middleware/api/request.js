import axios from 'axios';

const host = 'http://localhost';
const port = 3000;

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
    case 'get':
      return headers
        ? axios.get(`${host}:${port}${path}`, { headers })
        : axios.get(path);
    case 'post':
      return headers
        ? axios.post(`${host}:${port}${path}`, body, { headers })
        : axios.post(path, body);
    case 'put':
      return headers
        ? axios.put(`${host}:${port}${path}`, body, { headers })
        : axios.put(path, body);
    case 'delete':
      return headers
        ? axios.delete(`${host}:${port}${path}`, { headers })
        : axios.delete(path);
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
  return request(path, 'get', headers);
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
  return request(path, 'delete', headers);
}
