import React, { useEffect, useRef } from 'react';

export const useCombinedRefs = (
  ...refs
): React.MutableRefObject<HTMLElement> => {
  const targetRef = useRef(null);

  useEffect(() => {
    // assign target reference to specified refs
    for (const ref of refs) {
      if (!ref) {
        continue;
      }

      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else {
        ref.current = targetRef.current;
      }
    }
  }, [refs]);

  return targetRef;
};
