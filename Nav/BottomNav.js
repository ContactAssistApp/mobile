import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../assets/colors.js';
import Home from '../Home/Home';
import HealthNav from '../Health/HealthNav';
import Resources from '../Resources/Resources';
import CustomIcon from '../assets/icons/CustomIcon.js';
import ContactLog from '../ContactLog/ContactLog';

const Tab = createBottomTabNavigator();

export default function BottomNav() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: colors.primary_theme,
        inactiveTintColor: colors.gray_icon,
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => (
            <CustomIcon name={'home24'} color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="ContactLog"
        component={ContactLog}
        options={{
          tabBarLabel: 'Contact Log',
          tabBarIcon: ({color}) => (
            <CustomIcon name={'contactLog24'} color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="HealthNav"
        component={HealthNav}
        options={{
          tabBarLabel: 'Health',
          tabBarIcon: ({color}) => (
            <CustomIcon name={'heart24'} color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Resources"
        component={Resources}
        options={{
          tabBarLabel: 'Resources',
          tabBarIcon: ({color}) => (
            <CustomIcon name={'resource24'} color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
