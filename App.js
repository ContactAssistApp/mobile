import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import AppNav from './Nav/AppNav';
import SplashScreen from 'react-native-splash-screen';
import {LocalizationProvider} from './components/Translations';
import configureStore from './store/configureStore';

const store = configureStore();

function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
	<LocalizationProvider>
      <Provider store={store}>
        <AppNav />
      </Provider>
	</LocalizationProvider>
  );
}

export default App;
