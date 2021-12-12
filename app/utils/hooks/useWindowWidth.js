import { useCallback, useEffect, useState } from 'react';

const useWindowWidth = () => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const updateDimensions = useCallback(() => {
    const width = window.innerWidth;
    setWidth(width);
  }, []);

  return width;
};

export default useWindowWidth;
