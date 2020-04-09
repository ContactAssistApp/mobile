import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Preferences from '../Preferences/Preferences';
import colors from '../assets/colors';

const Stack = createStackNavigator();

class OnBoardingNav extends Component {
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

export default OnBoardingNav;
