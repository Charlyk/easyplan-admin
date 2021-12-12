import { useEffect, useState } from 'react';

const useWindowFocused = () => {
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    window?.addEventListener('focus', handleWindowFocused);
    window?.addEventListener('blur', handleWindowBlurred);
    return () => {
      window?.removeEventListener('focus', handleWindowFocused);
      window?.removeEventListener('blur', handleWindowBlurred);
    };
  }, []);

  const handleWindowFocused = () => {
    setIsFocused(true);
  };

  const handleWindowBlurred = () => {
    setIsFocused(false);
  };

  return isFocused;
};

export default useWindowFocused;
