import { useContext } from 'react';
import EasyPlanContext from '../context/easyPlanContext';

const useAppData = () => {
  const easyContext = useContext(EasyPlanContext);
  return {
    currentUser: easyContext.currentUser,
    currentClinic: easyContext.currentClinic,
    updateCurrentUser: easyContext.updateCurrentUser,
    updateCurrentClinic: easyContext.updateCurrentClinic,
    updateAppData: easyContext.updateAppData,
  };
};

export default useAppData;
