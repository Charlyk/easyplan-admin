import useAppData from './useAppData';

const useCurrentUser = () => {
  const appData = useAppData();
  return [appData.currentUser];
};

export default useCurrentUser;
