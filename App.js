import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import AppNav from './Nav/AppNav';
import SplashScreen from 'react-native-splash-screen';
import configureStore from './store/configureStore';

const store = configureStore();

function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <Provider store={store}>
      <AppNav />
    </Provider>
  );
}

export default App;
