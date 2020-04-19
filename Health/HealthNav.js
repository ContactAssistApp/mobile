import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Health from './Health';
import Report from './Report';
import colors from '../assets/colors';

const Stack = createStackNavigator();

class HealthNav extends Component {
  render() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Health"
          component={Health}
          options={{
            title: 'Health Report',
            headerStyle: {
              height: 0,
            },
          }}
        />
        <Stack.Screen
          name="Report"
          component={Report}
          options={{
            title: 'Report Summary',
            headerTintColor: colors.primary_theme,
            headerBackTitle: ' ',
          }}
        />
      </Stack.Navigator>
    );
  }
}

export default HealthNav;
