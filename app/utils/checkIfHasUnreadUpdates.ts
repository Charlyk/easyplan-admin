import { checkForNewRecentChanges } from 'middleware/api/recentChanges';

export const checkIfHasUnreadUpdates = async () => {
  const response = await checkForNewRecentChanges();

  return response.data;
};
