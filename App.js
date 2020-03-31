import React, {Component, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform
} from 'react-native';
// import Home from './Home/HomeContainer';
import OnBoarding from './OnBoarding/OnBoarding';
import configureStore from './store/configureStore';
import {Provider} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';

const store = configureStore();

function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <>
      <Provider store={store}>
        {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
        <SafeAreaView>
          <ScrollView contentInsetAdjustmentBehavior="automatic">
            <OnBoarding />
          </ScrollView>
        </SafeAreaView>
      </Provider>
    </>
  );
}

export default App;
