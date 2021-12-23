import { useSelector } from 'react-redux';
import { appDataSelector } from 'redux/selectors/appDataSelector';

const useAppData = () => {
  const appData = useSelector(appDataSelector);
  return {
    currentUser: appData.currentUser,
    currentClinic: appData.currentClinic,
  };
};

export default useAppData;
