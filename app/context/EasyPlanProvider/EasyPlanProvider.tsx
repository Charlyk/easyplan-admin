import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import EasyPlanContext from 'app/context/easyPlanContext';
import { setCurrentEntities } from 'redux/slices/appDataSlice';
import { CurrentClinic, CurrentUser } from 'types';
import { EasyPlanProviderProps } from './EasyPlanProvider.types';

const EasyPlanProvider: React.FC<EasyPlanProviderProps> = ({
  children,
  appData,
}) => {
  const dispatch = useDispatch();
  const [currentClinic, setCurrentClinic] = useState<CurrentClinic | null>(
    null,
  );
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const { currentUser, currentClinic } = appData;
    setCurrentClinic(currentClinic);
    setCurrentUser(currentUser);
    dispatch(setCurrentEntities({ currentUser, currentClinic }));
  }, [appData]);

  const handleUpdateCurrentUser = useCallback(() => {
    // do some stuff
  }, []);

  const handleUpdateCurrentClinic = useCallback(() => {
    // do some stuff
  }, []);

  const handleUpdateAppData = useCallback(() => {
    // do some stuff
  }, []);

  return (
    <EasyPlanContext.Provider
      value={{
        currentUser,
        currentClinic,
        updateCurrentUser: handleUpdateCurrentUser,
        updateCurrentClinic: handleUpdateCurrentClinic,
        updateAppData: handleUpdateAppData,
      }}
    >
      {children}
    </EasyPlanContext.Provider>
  );
};

export default EasyPlanProvider;
