import { checkForNewRecentChanges } from 'middleware/api/recentChanges';

export const checkIfHasUnreadUpdates = async () => {
  try {
    const response = await checkForNewRecentChanges();
    return response.data;
  } catch (error) {
    console.warn(error);
  }
};
