import { get, put } from './request';

export const getRecentChanges = async (headers = null) => {
  return get('/api/changes', headers);
};

export const markChangesAsRead = async (body, headers = null) => {
  return put('/api/changes', headers, body);
};
