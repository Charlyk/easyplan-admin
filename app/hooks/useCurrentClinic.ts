import useAppData from './useAppData';

const useCurrentClinic = () => {
  const appData = useAppData();
  return [appData.currentClinic];
};

export default useCurrentClinic;
