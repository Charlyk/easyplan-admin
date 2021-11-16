import { del, get, post } from "./request";

/**
 * Fetch all tags for current clinic
 * @param  {*} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestFetchTags(headers = null) {
  return get('/api/tags', headers)
}

/**
 * Create new tag for current clinic
 * @param {string} title
 * @param {*} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestCreateTag(title, headers = null) {
  return post('/api/tags', headers, { title })
}

/**
 * Delete tag with specified id from current clinic
 * @param {number} tagId
 * @param {*} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestDeleteTag(tagId, headers = null) {
  const queryString = new URLSearchParams({ tagId: `${tagId}` }).toString()
  return del(`/api/tags?${queryString}`, headers)
}
