import * as React from 'react';
import {Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../assets/colors.js';
import Home from '../Home/Home';
// import Health from '../Health/Health';
import HealthNav from '../Health/HealthNav';
import Resources from '../Resources/Resources';

const Tab = createBottomTabNavigator();

export default function BottomNav() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        tabBarOptions={{
          activeTintColor: colors.PURPLE_50,
          inactiveTintColor: colors.GRAY_50,
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({color}) => (
              <Icon name="home" color={color} size={28} />
            ),
          }}
        />
        <Tab.Screen
          name="HealthNav"
          component={HealthNav}
          options={{
            tabBarLabel: 'Health',
            tabBarIcon: ({color}) => (
              <Icon name="heart-outline" color={color} size={28} />
            ),
          }}
        />
        <Tab.Screen
          name="Resources"
          component={Resources}
          options={{
            tabBarLabel: 'Resources',
            tabBarIcon: ({color}) => (
              <Icon name="file-document-box-outline" color={color} size={28} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
