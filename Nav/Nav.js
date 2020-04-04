import 'react-native-gesture-handler';
import React, {Component} from 'react';
import Preferences from '../Preferences/Preferences';
import Home from '../Home/Home';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

class Nav extends Component {
  render() {
    return (
      <>
        <NavigationContainer>
          <Stack.Navigator>
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
      </>
    );
  }
}

export default Nav;
