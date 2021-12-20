import useAppData from './useAppData';

const useCurrentUser = () => {
  const appData = useAppData();
  return [appData.currentUser, appData.updateCurrentUser];
};

export default useCurrentUser;
