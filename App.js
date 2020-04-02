import 'react-native-gesture-handler';
import React, {Component, useEffect} from 'react';
import OnBoarding from './OnBoarding/OnBoarding';
import Preferences from './Preferences/Preferences';
import Home from './Home/Home';
import configureStore from './store/configureStore';
import {Provider} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const store = configureStore();
const Stack = createStackNavigator();

function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="OnBoarding"
              component={OnBoarding}
              options={{
                headerStyle: {
                  height: 0,
                },
              }}
            />
            <Stack.Screen
              name="Preferences"
              component={Preferences}
              options={{
                title: 'Select your preferences',
                headerStyle: {
                },
              }}
            />
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                title: 'HOME',
                headerStyle: {
                },
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </>
  );
}

export default App;
