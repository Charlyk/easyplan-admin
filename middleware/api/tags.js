import { del, get, post, put } from './request';

/**
 * Fetch all tags for current clinic
 * @param  {*} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestFetchTags(headers = null) {
  return get('/api/tags', headers);
}

/**
 * Create new tag for current clinic
 * @param {string} title
 * @param {*} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestCreateTag(title, headers = null) {
  return post('/api/tags', headers, { title });
}

/**
 * Delete tag with specified id from current clinic
 * @param {number} tagId
 * @param {*} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestDeleteTag(tagId, headers = null) {
  const queryString = new URLSearchParams({ tagId: `${tagId}` }).toString();
  return del(`/api/tags?${queryString}`, headers);
}

/**
 * Share tags between clinics
 * @param {number} clinicId
 * @param {Array<*>} tags
 * @param {*} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestShareTags(clinicId, tags, headers = null) {
  const queryString = new URLSearchParams({
    clinicId: `${clinicId}`,
  }).toString();
  const tagIds = tags.map((item) => item.id);
  return post(`/api/tags/share?${queryString}`, headers, { tagIds });
}

/**
 * Assign a tag to patient
 * @param {number} tagId
 * @param {number} patientId
 * @param {*} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestAssignTag(tagId, patientId, headers = null) {
  return put(`/api/tags/${patientId}?tagId=${tagId}`, headers, {});
}

/**
 * Remove a tag from patient
 * @param {number} tagId
 * @param {number} patientId
 * @param {*} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestUnassignTag(tagId, patientId, headers = null) {
  return del(`/api/tags/${patientId}?tagId=${tagId}`, headers);
}
