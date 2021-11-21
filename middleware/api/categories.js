import { post, put } from './request';

/**
 * Change name for a category
 * @param {string} categoryName
 * @param {number} categoryId
 * @param {any} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestEditCategory(
  categoryName,
  categoryId,
  headers = null,
) {
  return put(`/api/categories/${categoryId}`, headers, { categoryName });
}

/**
 * Create new category
 * @param {string} categoryName
 * @param {any} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function requestCreateCategory(categoryName, headers = null) {
  return post('/api/categories', headers, { categoryName });
}
