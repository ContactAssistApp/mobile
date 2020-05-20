import ReactNative from 'react-native';
import I18n from 'react-native-i18n';
import {LocaleConfig} from 'react-native-calendars';

// Import all locales
import en from './en.json';
import es from './es.json';

import moment from 'moment';
// XXX We MUST import all moment.js locales paired with the strings
import moment_es from 'moment/locale/es.js';


// Should the app fallback to English if user locale doesn't exists
I18n.fallbacks = true;

// Define the supported translations
I18n.translations = {
    en,
    es
};

I18n.defaultLocale = "en";
//FIXME use getLanguages or something
I18n.locale = "es"; //change it to 'es' for dev purposes

moment.locale(I18n.locale)

LocaleConfig.locales[I18n.locale] = {
  monthNames: moment.months(),
  monthNamesShort: moment.monthsShort(),
  dayNames: moment.weekdays(),
  dayNamesShort:moment.weekdaysShort()
};

LocaleConfig.defaultLocale = I18n.locale;

const currentLocale = I18n.currentLocale();

// Is it a RTL language?
export const isRTL = currentLocale.indexOf('he') === 0 || currentLocale.indexOf('ar') === 0;

// Allow RTL alignment in RTL languages
ReactNative.I18nManager.allowRTL(isRTL);

// The method we'll use instead of a regular string
export function strings(name, params = {}) {
  return I18n.t(name, params);
};

export function fmt_date(date, fmt) {
  return moment(date).locale(currentLocale).format(fmt);
}

export default I18n;
