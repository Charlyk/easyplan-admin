import { useMemo } from 'react';
import { useTranslate } from 'react-polyglot';

const useMappedValue = (rawValues: { id: string | number; name: string }[]) => {
  const textForKey = useTranslate();

  return useMemo(() => {
    return rawValues.map((value) => ({
      ...value,
      name: textForKey(value.name),
    }));
  }, []);
};

export default useMappedValue;
