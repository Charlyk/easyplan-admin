import { AxiosResponse } from 'axios';
import { requestDeleteCategory as deleteCategory } from 'middleware/api/categories';

export async function requestDeleteCategory(
  categoryId,
): Promise<AxiosResponse<any>> {
  return deleteCategory(categoryId);
}
