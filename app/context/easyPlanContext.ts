import React from 'react';
import { CurrentClinic, CurrentUser } from 'types';

interface EasyPlanContextProps {
  currentUser: CurrentUser | null;
  currentClinic: CurrentClinic | null;
  updateCurrentUser: () => void;
  updateCurrentClinic: () => void;
  updateAppData: () => void;
}

const EasyPlanContext = React.createContext<EasyPlanContextProps>({
  currentClinic: null,
  currentUser: null,
  updateCurrentUser: () => null,
  updateCurrentClinic: () => null,
  updateAppData: () => null,
});

export default EasyPlanContext;
