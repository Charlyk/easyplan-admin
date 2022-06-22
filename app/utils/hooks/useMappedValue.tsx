import { useMemo } from 'react';
import { useTranslate } from 'react-polyglot';
import { useSelector } from 'react-redux';
import { appLanguageSelector } from 'redux/selectors/appDataSelector';

const useMappedValue = (
  rawValues: { id: string | number; name: string }[],
  initialValue?: { id: string | number; name: string },
) => {
  const textForKey = useTranslate();
  const appLanguage = useSelector(appLanguageSelector);

  return useMemo(() => {
    const translatedValues = (rawValues ?? []).map((value) => ({
      ...value,
      name: textForKey(value.name.toLowerCase()),
    }));

    if (initialValue) {
      translatedValues.push({
        id: initialValue.id,
        name: textForKey(initialValue.name),
      });
    }

    return translatedValues;
  }, [appLanguage]);
};

export default useMappedValue;
