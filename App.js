import 'react-native-gesture-handler';
import React, {Component, useEffect} from 'react';
// import {
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   Platform
// } from 'react-native';
// import Home from './Home/HomeContainer';
import OnBoarding from './OnBoarding/OnBoarding';
import configureStore from './store/configureStore';
import {Provider} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Button, SafeAreaView, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
const store = configureStore();
const Stack = createStackNavigator();

function HomeScreen() {
  return (
    <View>
      <Text>Home Screen</Text>
    </View>
  );
}

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
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </>
  );
}

export default App;
