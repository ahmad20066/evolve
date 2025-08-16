import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { LogBox } from 'react-native';
import { persistor, store } from '@/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FCMPushNotificationsProvider } from '@/providers/FCMPushNotification';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';
import '@/i18n';
import ApplicationNavigator from '@/navigators/application';

LogBox.ignoreLogs([
  'Warning: ...',
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

function App() {
  const queryClient = new QueryClient();
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18n}>
            <FCMPushNotificationsProvider>
              <ApplicationNavigator />
            </FCMPushNotificationsProvider>
          </I18nextProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}
export default App;
