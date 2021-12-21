import useAppData from './useAppData';

const useCurrentClinic = () => {
  const appData = useAppData();
  return [appData.currentClinic, appData.updateCurrentClinic];
};

export default useCurrentClinic;
