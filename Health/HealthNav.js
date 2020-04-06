import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Health from './Health';
import Report from './Report';

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
              height: 0
            },
          }}
        />
        <Stack.Screen
          name="Report"
          component={Report}
          options={{
            title: 'Report Summary',
            headerStyle: {
            },
          }}
        />
      </Stack.Navigator>
    );
  }
}

export default HealthNav;
