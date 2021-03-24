import strings from './strings/strings';

/**
 * Update localization language
 * @param {'en'|'ro'|'ru'} newLanguage
 */
export function setAppLanguage(newLanguage) {
  typeof localStorage !== 'undefined' && localStorage.setItem('appLanguage', newLanguage);
}

/**
 * Get application language code
 * @return {string}
 */
export function getAppLanguage() {
  const lang = typeof localStorage !== "undefined" ? localStorage.getItem('appLanguage') : null;
  return lang ? lang : 'ro';
}

/**
 * Get translated text by key
 * @param {string} key
 * @return {string}
 */
export function textForKey(key) {
  if (typeof key !== 'string') return key;
  const lang = getAppLanguage();
  const text = strings[lang][key.toLowerCase()];
  return text ? text : key;
}