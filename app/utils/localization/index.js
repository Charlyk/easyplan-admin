import strings from './strings/strings';

/**
 * Update localization language
 * @param {'en'|'ro'|'ru'} newLanguage
 */
export function setAppLanguage(newLanguage) {
  typeof localStorage !== 'undefined' &&
    localStorage.setItem('appLanguage', newLanguage);
}

/**
 * Get application language code
 * @return {string}
 */
export function getAppLanguage() {
  const lang =
    typeof localStorage !== 'undefined'
      ? localStorage.getItem('appLanguage')
      : null;
  return lang ? lang : 'ro';
}

/**
 * Get translated text by key
 * @param {string} key
 * @param {strings|numbers} params
 * @return string
 * @return {string}
 */
export function textForKey(key, ...params) {
  if (typeof key !== 'string') return key;
  const lang = getAppLanguage();
  let text = strings[lang][key.toLowerCase()];
  if (text == null) return key;
  for (let i = 0; i < params.length; i++) {
    text = text.replace(`{${i + 1}}`, params[i]);
  }
  return text;
}
