import { useCallback, useEffect, useState } from 'react';

import useWindowWidth from './useWindowWidth';

const useIsMobileDevice = () => {
  const windowWidth = useWindowWidth();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    updateMobileDevice();
  }, [windowWidth]);

  const updateMobileDevice = useCallback(() => {
    setIsMobile(windowWidth !== 0 && windowWidth < 1025);
  }, [windowWidth]);

  return isMobile;
};

export default useIsMobileDevice;
