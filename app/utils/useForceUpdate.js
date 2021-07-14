//create your forceUpdate hook
import { useState } from 'react';

const useForceUpdate = () => {
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value + 1); // update the state to force render
};

export default useForceUpdate;
