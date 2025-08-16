import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as resources from '@/i18n/resources';
import {I18nManager} from 'react-native';

i18n.use(initReactI18next).init({
  resources: {
    ...Object.entries(resources).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: {
          translation: value,
        },
      }),
      {},
    ),
  },
  lng: I18nManager.isRTL ? 'ar' : 'en',
});

export default i18n;
