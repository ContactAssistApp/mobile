import 'react-native-gesture-handler';
import React, {Component} from 'react';
import Preferences from '../Preferences/Preferences';
import BottomNav from '../BottomNav/BottomNav';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import colors from '../assets/colors';

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
                headerTintColor: colors.primary_theme,
                headerStyle: {
                },
              }}
            />
            <Stack.Screen
              name="BottomNav"
              component={BottomNav}
              options={{
                title: 'BottomNav',
                headerStyle: {
                  height: 0,
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
