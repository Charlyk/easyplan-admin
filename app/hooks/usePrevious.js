import { useEffect, useRef } from 'react';

import isEqual from 'lodash/isEqual';

export default function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  //if the items are equal, keep the reference to the new one to avoid extra rerenders in case or arrays or objects
  if (isEqual(value, ref.current)) {
    return value;
  }
  return ref.current;
}
